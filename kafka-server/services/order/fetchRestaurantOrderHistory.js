import Order from "../../db/models/order.model.js";

export const fetchRestaurantOrderHistory = async (data, callback) => {
	console.log("Incoming data => ", data);
	const restaurantId = data.restaurantId;
	const orderStatus = data.orderStatus ? data.orderStatus : null;
	const pageLimit = data.pageLimit ? parseInt(data.pageLimit) : 5;
	const requestedPageNumber = parseInt(data.pageNumber);
	const skip = pageLimit * (requestedPageNumber - 1);

	console.log("Computed documents to skip => ", skip);

	if (orderStatus === null || orderStatus === "All") {
		try {
			const orders = await Order.find({ restaurantId: restaurantId })
				.skip(skip)
				.limit(pageLimit);

			console.log(JSON.stringify(orders));
			callback(null, orders);
		} catch (err) {
			console.error(err);
			callback(
				null,
				"Could not fetch restaurant order history w/o status filter"
			);
		}
	} else {
		// fetch all orders with a given orderStatus in request
		try {
			const orders = await Order.find({
				$and: [{ restaurantId: restaurantId }, { status: orderStatus }],
			})
				.skip(skip)
				.limit(pageLimit);
			console.log(JSON.stringify(orders));
			callback(null, orders);
		} catch (err) {
			console.error(err);
			callback(
				null,
				"Could not fetch restaurant order history wiith status filter"
			);
		}
	}
};
