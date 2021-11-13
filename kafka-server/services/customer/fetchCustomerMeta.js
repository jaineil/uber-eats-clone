import Customer from "../../db/models/customer.model.js";

export const fetchCustomerMeta = async (data, callback) => {
	console.log("Incoming data => ", data);

	const customerId = data.customerId;

	try {
		const response = await Customer.findById(customerId);
		console.log(JSON.stringify(response));
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch customer meta");
	}
};
