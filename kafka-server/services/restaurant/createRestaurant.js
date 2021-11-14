import Restaurant from "../../db/models/restaurant.model.js";

export const createRestaurant = async (data, callback) => {
	console.log(data);
	const restaurantObj = {
		name: data.name,
		emailId: data.emailId,
		password: data.password,
		contactNumber: data.contactNumber,
		street: data.street,
		shopNo: data.apt,
		city: data.city,
		state: data.state,
		zipcode: data.zipcode,
		country: data.country,
		opensAt: data.opensAt,
		closesAt: data.closesAt,
		description: data.description,
		cuisine: data.cuisine,
		profileImgUrl: data.restaurantImageUrl,
		deliveryOption: data.deliveryOption,
		pickupOption: data.pickupOption,
		veg: data.vegStatus,
		nonVeg: data.nonVegStatus,
		vegan: data.veganStatus,
	};

	const newRestaurant = new Restaurant(restaurantObj);

	try {
		const response = await newRestaurant.save();
		console.log(JSON.stringify(response));
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not create a restaurant");
	}
};
