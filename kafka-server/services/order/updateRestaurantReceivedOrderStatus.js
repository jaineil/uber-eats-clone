import Order from "../../db/models/order.model.js";

export const updateRestaurantReceivedOrderStatus = async (data, callback) => {
	console.log("Incoming data => ", data);
	const orderId = data.orderId;
	const updatedStatus = data.orderStatus;

	try {
		await Order.findByIdAndUpdate(orderId, {
			$set: { status: updatedStatus },
		});
		callback(null, "Updated");
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Error when updating order status");
	}
};
