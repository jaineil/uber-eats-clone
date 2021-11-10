import Order from "../../db/models/order.model.js";

export const fetchCustomerOrderHistory = async (data, callback) => {
	console.log(data);

	const customerId = data.customerId;
	const orderStatus = data.orderStatus ? data.orderStatus : null;
	const pageLimit = data.pageLimit ? parseInt(data.pageLimit) : 5;
	const requestedPageNumber = parseInt(data.pageNumber);

	const skip = pageLimit * (requestedPageNumber - 1);

	console.log("Computed documents to skip => ", skip);

	// fetch all orders where no orderStatus is given in request
	if (orderStatus === null || orderStatus === "All") {
		try {
			const orders = await Order.find({ customerId: customerId })
				.skip(skip)
				.limit(pageLimit);
			console.log(JSON.stringify(orders));
			callback(null, orders);
		} catch (err) {
			console.error(err);
			console.log(
				"Could not fetch customer order history w/o status filter"
			);
			callback(
				null,
				"Could not fetch customer order history w/o status filter"
			);
		}
	} else {
		// fetch all orders with a given orderStatus in request
		try {
			const orders = await Order.find({
				$and: [{ customerId: customerId }, { status: orderStatus }],
			})
				.skip(skip)
				.limit(pageLimit);
			console.log(JSON.stringify(orders));
			callback(null, orders);
		} catch (err) {
			console.error(err);
			console.log(
				"Could not fetch customer order history w/ status filter"
			);
			callback(
				null,
				"Could not fetch customer order history w/ status filter"
			);
		}
	}
};
