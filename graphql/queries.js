const db = require("../models/db");
const Restaurant = db.restaurants;
const Customer = db.customers;
const Order = db.orders;

//RESTAURANTS

exports.getEditDish = async (args) => {
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

exports.findAllRestaurants = async (args) => {
	const city = args.city;

	Restaurant.find()
		.then((data) => {
			console.log("DATA:", data);
			return data;
		})
		.catch((err) => {
			return {
				message:
					err.message ||
					"Some error occurred while creating the Customer.",
			};
		});
};

exports.findOneRestaurant = async (args) => {
	const restId = args.restaurantId;

	Restaurant.findById(restId, (err, data) => {
		if (err) {
			if (err.kind === "not_found") {
				return {
					message: `Not found Restaurant with id ${req.params.restaurantId}.`,
				};
			} else {
				return {
					message:
						"Error retrieving Restaurant with id " +
						req.params.restaurantId,
				};
			}
		} else return data;
	});
};

exports.getDishesbyRest = async (args) => {
	const restId = args.restId;

	Restaurant.find({ _id: restId }, "dishes")
		.then((data) => {
			console.log("dishesbyrest:", data[0].dishes);
			return data[0].dishes;
		})
		.catch((err) => {
			return {
				message:
					err.message ||
					"Some error occurred while fetching the dishes.",
			};
		});
};

exports.getRestIdsFromDish = async (args) => {
	const dishName = args.dishName;

	Restaurant.find({ "dishes.name": dishName })
		.then((response) => {
			const restIds = response.map((r) => {
				return r._id;
			});
			console.log("DONE", restIds);
			return restIds;
		})
		.catch((err) => {
			console.log("NOT DONE");
		});
};

exports.getRestIdsFromType = async (args) => {
	console.log("HERE");
	let vegan = args.vegan == "true" ? "Vegan" : "";
	let veg = args.veg == "true" ? "Veg" : "";
	let nonVeg = args.nonVeg == "true" ? "Non-Veg" : "";

	if (
		args.veg == "false" &&
		args.vegan == "false" &&
		args.nonVeg == "false"
	) {
		vegan = "Vegan";
		veg = "Veg";
		nonVeg = "Non-Veg";
	}
	Restaurant.find({ "dishes.type": { $in: [veg, vegan, nonVeg] } })
		.then((response) => {
			const restIds = response.map((r) => {
				return r._id;
			});
			console.log("DONE", restIds);
			return restIds;
		})
		.catch((err) => {
			console.log("NOT DONE");
		});
};

//CUSTOMER
exports.getAddresses = async (args) => {
	const custId = args.custId;

	console.log("addresses");

	Customer.find({ _id: custId }, "addresses")
		.then((data) => {
			console.log("DATA1:", data[0].addresses);
			return data[0].addresses;
		})
		.catch((err) => {
			return {
				message:
					err.message ||
					"Some error occurred while creating the Customer.",
			};
		});
};

exports.findAllCustomers = async (args) => {
	Customer.find()
		.then((data) => {
			console.log("GET ALL CUSTOMERS RESPONSE:", data);
			return data;
		})
		.catch((err) => {
			return {
				message:
					err.message ||
					"Some error occurred while fetching the favourites.",
			};
		});
};

exports.findOneCustomer = async (args) => {
	const id = args.id;

	Customer.findById(id)
		.then((data) => {
			if (!data) return { message: "No Customer with id " + id };
			else return data;
		})
		.catch((err) => {
			return { message: "Error retrieving Customer with id=" + id };
		});
};

//ORDERS

exports.getRestaurantsOrders = async (args) => {
	const restId = args.restId;
	let orderFilter = args.orderFilter;
	const pageLimit = parseInt(args.pageLimit);
	const pageNumber = parseInt(args.pageNumber);

	console.log("limit", pageLimit);
	console.log("pageSelected", pageNumber);
	console.log("restId backend: ", restId);
	console.log("ORDER FILTER backend: ", orderFilter);

	const toSkip = (pageNumber - 1) * pageLimit;
	console.log("to skip", toSkip);

	if (orderFilter == "All Orders") {
		Order.find({ restaurantId: restId })
			.skip(toSkip)
			.limit(pageLimit)
			.then((data) => {
				console.log("PAYLOAD:", data);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	} else {
		Order.find({
			restaurantId: restId,
			orderFilter: orderFilter,
		})
			.skip(toSkip)
			.limit(pageLimit)
			.then((data) => {
				console.log("PAYLOAD:", data);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	}
};

exports.getCustomersOrders = async (args) => {
	const custId = args.custId;
	let orderStatus = args.orderStatus;
	const pageLimit = parseInt(args.pageLimit);
	const pageNumber = parseInt(args.pageNumber);

	console.log("limit", pageLimit);
	console.log("pageSelected", pageNumber);
	console.log("custID backend: ", custId);
	console.log("ORDER STATUS backend: ", orderStatus);

	const toSkip = (pageNumber - 1) * pageLimit;
	console.log("to skip", toSkip);

	if (orderStatus == "All Orders") {
		Order.find({ "customer.customerId": custId })
			.skip(toSkip)
			.limit(pageLimit)
			.then((data) => {
				console.log("PAYLOAD:", data);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	} else {
		Order.find({ "customer.customerId": custId, orderStatus: orderStatus })
			.skip(toSkip)
			.limit(pageLimit)
			.then((data) => {
				console.log("PAYLOAD:", data);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	}
};

exports.getRestaurantsOrdersCount = async (args) => {
	const restId = args.restId;
	let orderFilter = args.orderFilter;
	const pageLimit = parseInt(args.pageLimit);

	console.log("restID backend: ", restId);
	console.log("ORDER FILTER backend: ", orderFilter);

	if (orderFilter == "All Orders") {
		Order.find({ restaurantId: restId })
			.then((data) => {
				const numberofPages = Math.ceil(data.length / pageLimit);
				console.log("PAYLOAD:", numberofPages);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message || "Some error while getting rest count",
				};
			});
	} else {
		Order.find({
			restaurantId: restId,
			orderFilter: orderFilter,
		})
			.limit(pageLimit)
			.then((data) => {
				console.log("PAYLOAD:", data.length);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	}
};

exports.getCustomerOrdersCount = async (args) => {
	const custId = args.custId;
	let orderStatus = args.orderStatus;
	const pageLimit = parseInt(args.pageLimit);

	console.log("custID backend: ", custId);
	console.log("ORDER STATUS backend: ", orderStatus);

	if (orderStatus == "All Orders") {
		Order.find({ "customer.customerId": custId })
			.then((data) => {
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	} else {
		Order.find({ "customer.customerId": custId, orderStatus: orderStatus })
			.limit(pageLimit)
			.then((data) => {
				console.log("PAYLOAD:", data.length);
				return data;
			})
			.catch((err) => {
				return {
					message:
						err.message ||
						"Some error occurred while creating the Customer.",
				};
			});
	}
};
