import Order from "../../db/models/order.model.js";

export const computePagination = async (data, callback) => {
	console.log(data);

	const id = data.id;
	const orderStatus = data.orderStatus ? data.orderStatus : null;
	const pageLimit = data.pageLimit ? data.pageLimit : 5;
	console.log("About to compute pages");

	// fetch all orders as no orderStatus is given in request
	if (orderStatus === null || orderStatus === "All") {
		try {
			const totalOrders = await Order.find({
				$or: [{ customerId: id }, { restaurantId: id }],
			});

			const pages = Math.ceil(totalOrders.length / pageLimit);
			callback(null, { pages: pages });
		} catch (err) {
			console.error("Error => ", err);
			callback(
				null,
				"Broken when calculating number of pages for all orders"
			);
		}
	} else {
		// fetch all orders with a given orderStatus in request
		try {
			const totalOrders = await Order.find({
				$and: [
					{ $or: [{ customerId: id }, { restaurantId: id }] },
					{ status: orderStatus },
				],
			});

			const pages = Math.ceil(totalOrders.length / pageLimit);
			console.log(pages);
			callback(null, { pages: pages });
		} catch (err) {
			console.error("Error => ", err);
			callback(
				null,
				`Broken when calculating number of pages for order status: ${orderStatus}`
			);
		}
	}
};
