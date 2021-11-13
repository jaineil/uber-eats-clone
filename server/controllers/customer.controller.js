import Customer from "../models/customer.model.js";
import Restaurant from "../models/restaurant.model.js";

export class CustomerController {
	// API - to create new customer on sign-up
	createCustomer = async (req, res) => {
		console.log(req.body);
		const createCustomerReqObj = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			emailId: req.body.emailId,
			password: req.body.password,
			dob: req.body.dob,
			contactNumber: req.body.contactNumber,
			address: {
				street: req.body.street,
				apt: req.body.apt,
				city: req.body.city,
				zipcode: req.body.zipcode,
				state: req.body.state,
				country: req.body.country,
				type: req.body.type,
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
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not create customer");
		}
	};

	// API - to update customer details on profile page
	updateCustomerMeta = async (req, res) => {
		console.log(req.body);
		const customerId = req.body.customerId;

		const updateCustomerDetailsObj = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			emailId: req.body.emailId,
			password: req.body.password,
			dob: req.body.dob,
			contactNumber: req.body.contactNumber,
			profileImg: req.body.img,
		};

		const updateCustomerAddressObj = {
			street: req.body.street,
			apt: req.body.apt,
			city: req.body.city,
			zipcode: req.body.zipcode,
			state: req.body.state,
			type: "default",
		};

		try {
			await Customer.findByIdAndUpdate(customerId, {
				...updateCustomerDetailsObj,
				$set: { "addresses.0": updateCustomerAddressObj },
			});

			res.status(200).send("Updated");
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not update customer profile");
		}
	};

	// API - to validate customer's credentials on sign-in
	validateCustomerSignin = async (req, res) => {
		console.log(req.query);
		const validateCustomerSigninReqObj = {
			emailId: req.query.emailId,
			password: req.query.password,
		};

		try {
			const response = await Customer.findOne({
				emailId: validateCustomerSigninReqObj.emailId,
			});
			console.log(JSON.stringify(response));

			if (response.password !== validateCustomerSigninReqObj.password) {
				console.log("Password mismatch");
				res.status(400).send({ validCredentials: false });
			} else {
				const customerId = response.id;
				console.log(customerId);
				console.log(typeof customerId);
				res.cookie("customerId", customerId, {
					maxAge: 3600000,
					httpOnly: false,
					path: "/",
				});
				req.session.user = customerId;

				res.status(200).send({
					validCredentials: true,
				});
			}
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not validate customer");
		}
	};

	// API - to fetch customer details for profile page
	fetchCustomerMeta = async (req, res) => {
		console.log(req.params);
		const customerId = req.params.customerId;

		try {
			const response = await Customer.findById(customerId);
			console.log(JSON.stringify(response));
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch customer meta");
		}
	};

	// API - to fetch current customer location (city)
	fetchCurrentCustomerLocation = async (req, res) => {
		console.log(req.params);
		const customerId = req.params.customerId;

		try {
			const response = await Customer.findById(customerId);
			const city = response.addresses[0].city;
			console.log(city);
			res.status(200).send({ city: city });
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch customer current location");
		}
	};

	// API - to add a restaurant to favorites on dashboard page
	addCustomerFavoriteRestaurant = async (req, res) => {
		console.log(req.body);
		const customerId = req.body.customerId;
		const restaurantId = req.body.restaurantId;

		try {
			await Customer.findByIdAndUpdate(customerId, {
				$push: { favoriteRestaurants: restaurantId },
			});
			res.status(200).send("Added");
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not add favorite resto");
		}
	};

	// API - to fetch all restaurants marked favorites by customer on favorites page
	fetchCustomerFavorites = async (req, res) => {
		console.log(req.params);
		const customerId = req.params.customerId;

		try {
			const customerMeta = await Customer.findById(customerId);
			const favoriteIds = customerMeta.favoriteRestaurants;
			console.log(JSON.stringify(favoriteIds));
			const response = await Restaurant.find({
				_id: { $in: favoriteIds },
			});
			console.log(JSON.stringify(response));
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch customer favortie restos");
		}
	};

	// API - to add new/alternate customer address on checkout page
	addAlternateCustomerAddress = async (req, res) => {
		console.log(req.body);

		const customerId = req.body.customerId;
		const alternateAddressObj = {
			street: req.body.street,
			apt: req.body.apt,
			city: req.body.city,
			zipcode: req.body.zipcode,
			state: req.body.state,
			country: req.body.country,
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

	// API - to fetch all customer addresses for checkout page
	fetchCustomerAddresses = async (req, res) => {
		console.log(req.params);
		const customerId = req.params.customerId;

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
			res.status(200).send(addresses);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch customer addressess");
		}
	};
}
