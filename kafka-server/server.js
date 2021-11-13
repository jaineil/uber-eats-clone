import { ConnectionProvider } from "./kafka/connection.js";
import uri from "../server/models/config/db.config.js";
import mongoose from "mongoose";
import { createCustomer } from "./services/customer/createCustomer.js";
import { fetchCustomerLocation } from "./services/customer/fetchCustomerLocation.js";
import { fetchRestaurants } from "./services/restaurant/fetchRestaurants.js";
import { fetchRestaurantMeta } from "./services/restaurant/fetchRestaurantMeta.js";
import { fetchCustomerAddresses } from "./services/customer/fetchCustomerAddresses.js";
import { addAlternateCustomerAddress } from "./services/customer/addAlternateCustomerAddress.js";
import { createOrder } from "./services/order/createOrder.js";
import { computePagination } from "./services/order/computePagination.js";
import { fetchCustomerOrderHistory } from "./services/order/fetchCustomerOrderHistory.js";
import { addCustomerFavoriteRestaurant } from "./services/customer/addCustomerFavoriteRestaurant.js";
import { fetchCustomerFavorites } from "./services/customer/fetchCustomerFavorites.js";
import { createRestaurant } from "./services/restaurant/createRestaurant.js";
import { createDish } from "./services/restaurant/createDish.js";
import { fetchAllDishes } from "./services/restaurant/fetchAllDishes.js";
import { fetchOneDish } from "./services/restaurant/fetchDish.js";
import { updateDish } from "./services/restaurant/updateDish.js";
import { searchRestaurants } from "./services/restaurant/searchRestaurants.js";
import { fetchRestaurantOrderHistory } from "./services/order/fetchRestaurantOrderHistory.js";
import { updateRestaurantReceivedOrderStatus } from "./services/order/updateRestaurantReceivedOrderStatus.js";
import { handleCustomerOrderCancellation } from "./services/order/handleCustomerOrderCancellation.js";
import { updateCustomer } from "./services/customer/updateCustomer.js";
import { fetchCustomerMeta } from "./services/customer/fetchCustomerMeta.js";

try {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		maxPoolSize: 500,
	});
	console.log("Mongoose is connected!");
} catch (err) {
	console.error("Could not connect Mongoose => ", err);
}

const handleTopicRequest = (topicName, functionName) => {
	const connection = new ConnectionProvider();
	const consumer = connection.getConsumer(topicName);
	const producer = connection.getProducer();

	console.log("Kafka server is running!");

	consumer.on("message", (message) => {
		console.log("Message received for => ", topicName);
		console.log("Incoming message: ", message);
		const data = JSON.parse(message.value);

		functionName(data.data, (err, res) => {
			const payloads = [
				{
					topic: data.replyTo,
					messages: JSON.stringify({
						correlationId: data.correlationId,
						data: res,
					}),
					partition: 0,
				},
			];

			producer.send(payloads, (err, data) => {
				if (err) console.error(err);
				console.log("Payload sent back to producer => ", data);
			});

			return;
		});
	});
};

handleTopicRequest("create-customer", createCustomer);
handleTopicRequest("update-customer", updateCustomer);
handleTopicRequest("fetch-customer", fetchCustomerMeta);
handleTopicRequest("fetch-customer-location", fetchCustomerLocation);
handleTopicRequest("fetch-restaurants", fetchRestaurants);
handleTopicRequest("fetch-restaurant", fetchRestaurantMeta);
handleTopicRequest("fetch-addresses", fetchCustomerAddresses);
handleTopicRequest("add-customer-address", addAlternateCustomerAddress);
handleTopicRequest("create-order", createOrder);
handleTopicRequest("compute-pages", computePagination);
handleTopicRequest("customer-order-history", fetchCustomerOrderHistory);
handleTopicRequest("cancel-order", handleCustomerOrderCancellation);
handleTopicRequest("add-favorite", addCustomerFavoriteRestaurant);
handleTopicRequest("fetch-favorites", fetchCustomerFavorites);
handleTopicRequest("search", searchRestaurants);
handleTopicRequest("create-restaurant", createRestaurant);
handleTopicRequest("create-dish", createDish);
handleTopicRequest("fetch-dish", fetchOneDish);
handleTopicRequest("update-dish", updateDish);
handleTopicRequest("fetch-dishes", fetchAllDishes);
handleTopicRequest("restaurant-order-history", fetchRestaurantOrderHistory);
handleTopicRequest("update-order-status", updateRestaurantReceivedOrderStatus);
