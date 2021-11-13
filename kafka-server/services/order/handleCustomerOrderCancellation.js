import Order from "../../db/models/order.model.js";

export const handleCustomerOrderCancellation = async (data, callback) => {
	const orderId = data.orderId;

	try {
		const response = await Order.findById(orderId);
		if (response.status === "Order Placed") {
			await Order.findByIdAndUpdate(orderId, {
				$set: { status: "Cancelled" },
			});
			res.status(200).send({ cancelled: true });
		}
		callback(null, { cancelled: false });
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Error when cancelling order");
	}
};
