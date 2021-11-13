import kafka from "kafka-node";

export class ConnectionProvider {
	constructor() {
		this.getConsumer = (topicName) => {
			this.client = new kafka.KafkaClient("localhost:9092");

			this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
				{ topic: topicName, partition: 0 },
			]);

			this.client.on("ready", () => {
				console.log("Client ready!");
			});

			return this.kafkaConsumerConnection;
		};

		this.getProducer = () => {
			// if (!this.kafkaProducerConnection) {
			//     this.client = new kafka.KafkaClient('localhost:2181');

			//     // const HighLevelProducer = kafka.HighLevelProducer;
			//     this.kafkaProducerConnection = new kafka.HighLevelProducer(this.client);
			//     //this.kafkaConnection = new kafka.Producer(this.client);
			//     console.log('Producer ready!');
			// }

			this.client = new kafka.KafkaClient("localhost:9092");

			// const HighLevelProducer = kafka.HighLevelProducer;
			this.kafkaProducerConnection = new kafka.HighLevelProducer(
				this.client
			);

			//this.kafkaConnection = new kafka.Producer(this.client);
			this.client.on("ready", () => {
				console.log("Producer ready!");
			});

			return this.kafkaProducerConnection;
		};
	}
}
