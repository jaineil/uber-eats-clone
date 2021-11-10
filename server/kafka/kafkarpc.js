import crypto from "crypto";
import { ConnectionProvider } from "./connection.js";

const TIMEOUT = 12000; // time to wait for response in ms
let self;

export class KafkaRPC {
	constructor() {
		self = this;
		this.connection = new ConnectionProvider();
		this.requests = {}; // hash to store request in wait for response
		this.response_queue = false; // placeholder for the future queue
		this.producer = this.connection.getProducer();
	}

	makeRequest(topicName, content, callback) {
		self = this;
		// generate a unique correlation id for this call
		const correlationId = crypto.randomBytes(16).toString("hex");

		// create a timeout for what should happen if we don't get a response
		const tId = setTimeout(
			(correlationId) => {
				// if this ever gets called we didn't get a response in a
				// timely fashion
				console.log("timeout");

				callback(
					new Error("Timed out correlation id => " + correlationId)
				);

				// delete the entry from hash
				delete self.requests[correlationId];
			},
			TIMEOUT,
			correlationId
		);

		// create a request entry to store in a hash
		const entry = {
			callback: callback,
			timeout: tId, // the id for the timeout so we can clear it
		};

		// put the entry in the hash so we can match the response later
		self.requests[correlationId] = entry;

		//make sure we have a response topic
		self.setupResponseQueue(self.producer, topicName, () => {
			const payloads = [
				{
					topic: topicName,
					messages: JSON.stringify({
						correlationId: correlationId,
						replyTo: "response_topic",
						data: content,
					}),
					partition: 0,
				},
			];
			console.log("In response!");
			console.log(self.producer.ready);
			self.producer.send(payloads, (err, data) => {
				if (err) console.log("Broke when sending from producer", err);
				console.log(data);
			});
		});
	}

	setupResponseQueue = (producer, topicName, next) => {
		// don't mess around if we have a queue
		if (this.response_queue) return next();

		self = this;

		// subscribe to messages
		const consumer = self.connection.getConsumer("response_topic");

		consumer.on("message", (message) => {
			console.log("Message received");
			const data = JSON.parse(message.value);

			// get the correlationId
			const correlationId = data.correlationId;

			// is it a response to a pending request
			if (correlationId in self.requests) {
				// retrieve the request entry
				const entry = self.requests[correlationId];

				//make sure we don't timeout by clearing it
				clearTimeout(entry.timeout);

				//delete the entry from hash
				delete self.requests[correlationId];

				//callback, no err
				entry.callback(null, data.data);
			}
		});

		self.response_queue = true;
		console.log("Returning next!");
		return next();
	};
}
