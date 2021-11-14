import Restaurant from "../models/restaurant.model.js";

export class RestaurantController {
	// API - to create a new restaurant
	create = async (req, res) => {
		console.log(req.body);
		const restaurantObj = {
			name: req.body.name,
			emailId: req.body.emailId,
			password: req.body.password,
			contactNumber: req.body.contactNumber,
			street: req.body.street,
			shopNo: req.body.apt,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,
			country: req.body.country,
			opensAt: req.body.opensAt,
			closesAt: req.body.closesAt,
			description: req.body.description,
			cuisine: req.body.cuisine,
			profileImgUrl: req.body.restaurantImageUrl,
			deliveryOption: req.body.deliveryOption,
			pickupOption: req.body.pickupOption,
			veg: req.body.vegStatus,
			nonVeg: req.body.nonVegStatus,
			vegan: req.body.veganStatus,
		};

		const newRestaurant = new Restaurant(restaurantObj);

		try {
			const response = await newRestaurant.save();
			console.log(JSON.stringify(response));
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not create a restaurant");
		}
	};

	// API - to validate restaurant sign in
	validateRestaurantSignin = async (req, res) => {
		console.log(req.query);

		const emailId = req.query.emailId;
		const password = req.query.password;

		try {
			const response = await Restaurant.findOne({
				$and: [{ emailId: emailId }, { password: password }],
			});
			console.log(JSON.stringify(response));

			if (response) {
				const restaurantId = response.id;
				console.log(restaurantId);

				res.cookie("restaurantId", restaurantId, {
					maxAge: 3600000,
					httpOnly: false,
					path: "/",
				});
				req.session.user = restaurantId;

				res.status(200).send({
					validCredentials: true,
				});
			} else {
				console.log("User mismatch");
				res.status(400).send({ validCredentials: false });
			}
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not validate restaurant");
		}
	};

	fetchRestaurantMeta = async (req, res) => {
		console.log(req.params);

		const restaurantId = req.params.restaurantId;

		try {
			const response = await Restaurant.findById(restaurantId);
			console.log(JSON.stringify(response));
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch restaurant details");
		}
	};

	// API - to update restaurant details sent via restaurant profile page
	updateRestaurantMeta = async (req, res) => {
		console.log(req.body);

		const restaurantId = req.body.restaurantId;

		const updatedRestaurantObj = {
			name: req.body.name,
			emailId: req.body.emailId,
			password: req.body.password,
			contactNumber: req.body.contactNumber,
			street: req.body.street,
			shopNo: req.body.apt,
			city: req.body.city,
			state: req.body.state,
			zipcode: req.body.zipcode,
			country: req.body.country,
			opensAt: req.body.opensAt,
			closesAt: req.body.closesAt,
			description: req.body.description,
			cuisine: req.body.cuisine,
			profileImgUrl: req.body.img,
		};

		try {
			const response = await Restaurant.updateOne(
				{ _id: restaurantId },
				{
					$set: {
						name: updatedRestaurantObj.name,
						emailId: updatedRestaurantObj.emailId,
						password: updatedRestaurantObj.password,
						contactNumber: updatedRestaurantObj.contactNumber,
						street: updatedRestaurantObj.street,
						shopNo: updatedRestaurantObj.shopNo,
						city: updatedRestaurantObj.city,
						state: updatedRestaurantObj.state,
						zipcode: updatedRestaurantObj.zipcode,
						country: updatedRestaurantObj.country,
						opensAt: updatedRestaurantObj.opensAt,
						closesAt: updatedRestaurantObj.closesAt,
						description: updatedRestaurantObj.description,
						cuisine: updatedRestaurantObj.cuisine,
						profileImgUrl: updatedRestaurantObj.profileImgUrl,
					},
				}
			);

			console.log(JSON.stringify(response));
			res.status(200).send("Updated");
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not update restaurant meta");
		}
	};

	// API - to fetch all restaurants sorted by customer location for customer dashboard page
	fetchRestaurants = async (req, res) => {
		console.log(req.query);
		const city = req.query.city;

		try {
			const defaultCityRestaurants = await Restaurant.find({
				city: city,
			});
			console.log("Default city restaurants => ", defaultCityRestaurants);

			const otherRestaurants = await Restaurant.find({
				city: { $ne: city },
			});
			console.log("Other restaurants => ", otherRestaurants);

			const response = defaultCityRestaurants.concat(otherRestaurants);
			console.log("All restaurants => ", response);
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send(
				"Could not fetch restaurants for customer dashboard"
			);
		}
	};

	// API - add a new dish for restaurant on restaurant/menu page
	createDish = async (req, res) => {
		console.log(req.body);

		const restaurantId = req.body.restaurantId;
		const newDishObj = {
			name: req.body.name,
			price: req.body.price,
			description: req.body.description,
			category: req.body.category,
			foodType: req.body.foodType,
			ingredients: req.body.ingredients,
			dishImgUrl: req.body.dishImgUrl,
		};

		try {
			const response = await Restaurant.findByIdAndUpdate(
				{ _id: restaurantId },
				{
					$push: {
						dishes: newDishObj,
					},
				}
			);
			console.log(JSON.stringify(response));
			res.status(200).send("Added");
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not add new dish to restaurant");
		}
	};

	// API - to fetch dish details to allow restaurant to edit details on restaurant/menu page
	fetchOneDishForRestaurant = async (req, res) => {
		console.log(req.params);
		const dishId = req.params.dishId;

		try {
			const restaurant = await Restaurant.find({ "dishes._id": dishId });
			const dishes = restaurant[0].dishes;
			const dish = dishes.filter((dish) => dish.id === dishId);
			console.log(JSON.stringify(dish));
			res.status(200).send(dish[0]);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch a particular dish");
		}
	};

	// API - to persist updated dish details sent from on restaurant/menu page
	updateDish = async (req, res) => {
		console.log(req.body);

		const dishId = req.body.mealId;

		const updatedDishObj = {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			ingredients: req.body.ingredients,
			category: req.body.category,
			dishImgUrl: req.body.dishImgUrl,
		};

		try {
			const response = await Restaurant.updateOne(
				{ "dishes._id": dishId },
				{
					$set: {
						"dishes.$.name": updatedDishObj.name,
						"dishes.$.description": updatedDishObj.description,
						"dishes.$.price": updatedDishObj.price,
						"dishes.$.ingredients": updatedDishObj.ingredients,
						"dishes.$.category": updatedDishObj.category,
						"dishes.$dishImgUrl": updatedDishObj.dishImgUrl,
					},
				}
			);
			console.log(JSON.stringify(response));
			res.status(200).send("Updated");
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send(
				"Could not update dish details for a restaurant"
			);
		}
	};

	// API - to view all dishes from a restaurant to a customer
	fetchAllDishesForRestaurant = async (req, res) => {
		console.log(req.params);
		const restaurantId = req.params.restaurantId;
		console.log("About to fetch dishes for restaurant => ", restaurantId);
		try {
			const restaurant = await Restaurant.findById(restaurantId);
			console.log(restaurant);
			const response = restaurant.dishes;
			console.log(JSON.stringify(response));
			res.status(200).send(response);
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Could not fetch all dishes for a restaurant");
		}
	};

	// API - to handle search queries on customer dashboard searchbar
	// comes in req.query since passed as params
	search = async (req, res) => {
		console.log(req.query);

		const query = req.query.searchString;
		const queryString = query.toLowerCase();

		if (
			queryString === "pickup" ||
			queryString === "pick up" ||
			queryString === "pick-up"
		) {
			try {
				const response = await Restaurant.find({ pickupOption: true });
				console.log(JSON.stringify(response));
				res.status(200).send(response);
			} catch (err) {
				console.error("Error => ", err);
				res.status(500).send("Could not find pick up restaurants");
			}
		} else if (queryString === "delivery") {
			try {
				const response = await Restaurant.find({
					deliveryOption: true,
				});
				console.log(JSON.stringif(response));
				res.status(200).send(response);
			} catch (err) {
				console.error("Error => ", err);
				res.status(500).send("Could not find delivery restaurants");
			}
		} else {
			try {
				console.log("About to do overall searching!");
				const response = await Restaurant.find({
					$or: [
						{
							name: {
								$regex: queryString,
								$options: "i",
							},
						},
						{
							"dishes.name": {
								$regex: queryString,
								$options: "i",
							},
						},
						{
							city: {
								$regex: queryString,
								$options: "i",
							},
						},
					],
				});

				console.log(JSON.stringify(response));
				res.status(200).send(response);
			} catch (err) {
				console.error("Error => ", err);
				res.status(500).send(
					"Could not find search string in restaurants"
				);
			}
		}
	};
}
