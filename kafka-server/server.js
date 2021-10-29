import { ConnectionProvider } from './kafka/connection.js';
import uri from '../server/models/config/db.config.js';
import mongoose from 'mongoose';
import { createCustomer } from './services/createCustomer.js';

try {
	mongoose.connect(
		uri,
		{ useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 500 },
	);
	console.log('Mongoose is connected!');
} catch (err) {
	console.error('Could not connect Mongoose => ', err);
}

const handleTopicRequest = (topicName, functionName) => {
    const connection = new ConnectionProvider();
    const consumer = connection.getConsumer(topicName);
    const producer = connection.getProducer();
    
    console.log('Kafka server is running!');
    
    consumer.on('message', (message) => {
        console.log('Message received for => ', topicName);
        const data = JSON.parse(message.value);

        functionName(data.data, (err, res) => {
            const payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res
                    }),
                    partition: 0
                }
            ];

            producer.send(payloads, (err, data) => {
                console.log('Payload sent => ', data);
            });
            
            return;
            
        });

    });
}

handleTopicRequest('create-customer', createCustomer);