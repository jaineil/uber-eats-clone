import Customer from "../../db/models/customer.model.js";

export const updateCustomer = async (data, callback) => {
	console.log("Incoming data => ", data);

	const customerId = data.customerId;

	const updateCustomerDetailsObj = {
		firstName: data.firstName,
		lastName: data.lastName,
		emailId: data.emailId,
		contactNumber: data.mobileNumber,
		profileImg: data.customerImgUrl,
	};

	const updateCustomerAddressObj = {
		street: data.street,
		apt: data.apt,
		city: data.city,
		zipcode: data.zipcode,
		state: data.state,
		country: "United States",
		type: "default",
	};

	try {
		await Customer.updateOne(
			{ _id: customerId },
			{
				firstName: updateCustomerDetailsObj.firstName,
				lastName: updateCustomerDetailsObj.lastName,
				emailId: updateCustomerDetailsObj.emailId,
				contactNumber: updateCustomerDetailsObj.contactNumber,
				profileImg: updateCustomerDetailsObj.profileImg,
				$set: {
					"addresses.0": updateCustomerAddressObj,
				},
			}
		);

		callback(null, "Updated");
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not update customer profile");
	}
};
