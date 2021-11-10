import Customer from "../../db/models/customer.model.js";

export const addAlternateCustomerAddress = async (data, callback) => {
	console.log(data);

	const customerId = data.customerId;
	const alternateAddressObj = {
		street: data.street,
		apt: data.apt,
		city: data.city,
		zipcode: data.zipcode,
		state: data.state,
		country: data.country,
		type: "alternate",
	};

	try {
		await Customer.findByIdAndUpdate(customerId, {
			$push: {
				addresses: alternateAddressObj,
			},
		});
		res.status(200).send("Added");
	} catch (err) {
		console.error("Error => ", err);
		res.status(500).send("Could not add alternate address");
	}
};
