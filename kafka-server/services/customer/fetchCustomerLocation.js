import Customer from "../../db/models/customer.model.js";

export const fetchCustomerLocation = async (data, callback) => {
	console.log(data);
	const customerId = data.customerId;

	try {
		const response = await Customer.findById(customerId);
		const city = response.addresses[0].city;
		console.log(city);
		callback(null, { city: city });
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch customer current location");
	}
};
