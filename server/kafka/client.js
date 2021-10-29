// var rpc = new (require('./kafkarpc'))();
import { KafkaRPC } from './kafkarpc.js'

//make request to kafka
export const make_request = (topicName, message, callback) => {
    const rpc = new KafkaRPC();
    rpc.makeRequest(topicName, message, (err, response) => {

        if (err) {
            console.error(err);
        } else {
			callback(null, response);
		}
	});
}