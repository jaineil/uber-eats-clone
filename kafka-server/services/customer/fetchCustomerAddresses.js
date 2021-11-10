import Customer from "../../db/models/customer.model.js";

export const fetchCustomerAddresses = async (data, callback) => {
	console.log(data.params);
	const customerId = data.customerId;

	try {
		const response = await Customer.findById(customerId);
		const fetchedAddresses = response.addresses;

		let addresses = [];
		for (const addr of fetchedAddresses) {
			addresses.push({
				street: addr.street,
				apt: addr.apt,
				city: addr.city,
				zipcode: addr.zipcode,
				state: addr.state,
				country: addr.country,
				type: addr.type,
				id: addr.id,
			});
		}
		console.log(JSON.stringify(addresses));

		callback(null, addresses);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch customer addressess");
	}
};
