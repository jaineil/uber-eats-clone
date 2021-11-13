import Restaurant from "../../db/models/restaurant.model.js";

export const fetchAllDishes = async (data, callback) => {
	console.log("Incoming data => ", data);
	const restaurantId = data.restaurantId;
	console.log("About to fetch dishes for restaurant => ", restaurantId);
	try {
		const restaurant = await Restaurant.findById(restaurantId);
		console.log(restaurant);
		const response = restaurant.dishes;
		console.log(JSON.stringify(response));
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch all dishes for a restaurant");
	}
};
