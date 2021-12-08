const db = require("../models/db");
const Restaurant = db.restaurants;
const Customer = db.customers;
const Order = db.orders;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

//CUSTOMERS

exports.createCustomer = async (args) => {
	try {
		const customer = new Customer({
			email: args.email,
			password: bcrypt.hashSync(args.password, salt),
			name: args.name,
			about: args.about,
			dob: args.dob,
			nickname: args.nickname,
			phoneno: args.phoneno,
			profilePic: args.profilePic,
			addresses: args.addresses,
			favourites: args.favourites,
			// orders: req.body.orders
		});

		console.log("CREATE NEW", customer);

		await customer.save();
		return { message: "Successfully created customer profile" };
	} catch (err) {
		console.log("Error", err);
		return { message: "Error Creating user" };
	}
};

exports.addAddress = async (args) => {
	const { custId, ...address } = args;

	console.log("CUSTID", custId);
	console.log("ADDRESS", address);

	Customer.update({ _id: custId }, { $push: { addresses: address } })
		.then((response) => {
			console.log("DONE", response);
			return response;
		})
		.catch((err) => {
			console.log("NOT DONE");
		});
};

exports.updateAddress = async (args) => {
	const custId = args.custId;
	const address = args.address;

	console.log("adddress to update:", address);
	console.log("customer to update:", custId);

	Customer.update(
		{ _id: custId, "addresses._id": address.addressId },
		{
			$set: {
				"addresses.$.street": address.street,
				"addresses.$.city": address.city,
				"addresses.$.state": address.state,
				"addresses.$.country": address.country,
				"addresses.$.zipcode": address.zipcode,
			},
		}
	)
		.then((response) => {
			console.log("DONE", response);
			return address;
		})
		.catch((err) => {
			console.log("NOT DONE");
		});
};

exports.custUpdate = async (args) => {
	const id = args.id;
	const toUpdate = args.toUpdate;
	Customer.findByIdAndUpdate(id, toUpdate, { useFindAndModify: false })
		.then((data) => {
			if (!data) {
				return {
					message: `Cannot update Customer with id=${id}. Maybe Customer was not found!`,
				};
			} else return req.body;
		})
		.catch((err) => {
			return {
				message: "Error updating Customer with id=" + id,
			};
		});
};

//RESTAURANTS

exports.restUpdate = async (args) => {
	const restId = args.restId;
	const dishId = args.dishId;
	console.log("herererere graphhiqqlll");

	try {
		const response = await Restaurant.find({ _id: restId }, "dishes");
		const data = await response[0].dishes.find(
			(dish) => dish._id == dishId
		);

		console.log("DONE", data);
		return data;
	} catch (err) {
		console.log("NOT DONE");
	}
};

exports.addDish = async (args) => {
	const { restId, ...dish } = args;

	console.log("RESTID", restId);
	console.log("DISH", dish);

	Restaurant.update({ _id: restId }, { $push: { dishes: dish } })
		.then((response) => {
			console.log("DONE", response);
			return res.status(200).send(response);
		})
		.catch((err) => {
			console.log("NOT DONE");
		});
};

exports.editDish = async (args) => {
	const restId = args.restId;
	const dishId = args.dishId;
	console.log("herererere graphhiqqlll");

	try {
		const response = await Restaurant.find({ _id: restId }, "dishes");
		const data = await response[0].dishes.find(
			(dish) => dish._id == dishId
		);

		console.log("DONE", data);
		return data;
	} catch (err) {
		console.log("NOT DONE");
	}
};

exports.deleteDish = async (args) => {
	const restId = args.restId;
	const dishId = args.dishId;
	console.log("herererere graphhiqqlll");

	try {
		const response = await Restaurant.find({ _id: restId }, "dishes");
		const data = await response[0].dishes.find(
			(dish) => dish._id == dishId
		);

		console.log("DONE", data);
		return data;
	} catch (err) {
		console.log("NOT DONE");
	}
};

//ORDERS

exports.orderUpdate = async (args) => {
	const status = args.status;
	const orderId = args.orderId; //params
	const filter = args.filter;

	console.log("orderId", orderId);
	console.log("STATUS", status);
	console.log("FILTER", filter);

	let orderFilter = filter;

	if (status == "Delivered" || status == "Picked Up")
		orderFilter = "Completed Order";
	else if (status == "Cancelled") orderFilter = "Cancelled Order";

	try {
		const data = await Order.updateOne(
			{ _id: orderId },
			{
				$set: {
					orderStatus: status,
					orderFilter: orderFilter,
				},
			}
		);
		console.log("PAYLOAD:", data);

		return { message: "Successfully Updated Status" };
	} catch (err) {
		return {
			message:
				err.message ||
				"Some error occurred while creating the Customer.",
		};
	}
};

// if (res) {
//     if (orderStatus == 'Delivered' || orderStatus == 'Picked Up') {
//         sql.query("UPDATE orders SET orderFilter='Completed Order' WHERE id=?",
//             [id],
//             (err, res) => {
//                 if (err) {
//                     console.log("ERROR", err)
//                 }
//                 if (res)
//                     console.log(res)
//             })
//     }
//     if (orderStatus == 'Cancelled') {
//         sql.query("UPDATE orders SET orderFilter='Cancelled Order' WHERE id=?",
//             [id],
//             (err, res) => {
//                 if (err) {
//                     console.log("ERROR", err)
//                 }
//                 if (res)
//                     console.log(res)
//             })
//     }
// }
// }
