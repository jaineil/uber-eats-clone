import Restaurant from "../../db/models/restaurant.model.js";

export const fetchRestaurants = async (data, callback) => {
	console.log("Inside fetch restaurants service => ", data);
	const city = data.city;

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
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch restaurants for customer dashboard");
	}
};
