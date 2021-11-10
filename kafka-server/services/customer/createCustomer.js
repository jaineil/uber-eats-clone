import Customer from "../../db/models/customer.model.js";

export const createCustomer = async (data, callback) => {
	console.log("Incoming data => ", data);

	const createCustomerReqObj = {
		firstName: data.firstName,
		lastName: data.lastName,
		emailId: data.emailId,
		password: data.password,
		dob: data.dob,
		contactNumber: data.contactNumber,
		address: {
			street: data.street,
			apt: data.apt,
			city: data.city,
			zipcode: data.zipcode,
			state: data.state,
			country: data.country,
			type: data.type,
		},
	};

	const newCustomer = new Customer({
		firstName: createCustomerReqObj.firstName,
		lastName: createCustomerReqObj.lastName,
		emailId: createCustomerReqObj.emailId,
		password: createCustomerReqObj.password,
		dob: createCustomerReqObj.dob,
		contactNumber: createCustomerReqObj.contactNumber,
		addresses: createCustomerReqObj.address,
	});

	try {
		const response = await newCustomer.save();
		console.log(JSON.stringify(response));
		// res.status(200).send(response);
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		// res.status(500).send('Could not create customer');
		callback(null, "Internal server error: Could not create customer");
	}
};
