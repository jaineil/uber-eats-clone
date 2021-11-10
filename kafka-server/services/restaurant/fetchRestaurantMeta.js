import Restaurant from "../../db/models/restaurant.model.js";

export const fetchRestaurantMeta = async (data, callback) => {
	console.log(data);

	const restaurantId = data.restaurantId;

	try {
		const response = await Restaurant.findById(restaurantId);
		console.log(JSON.stringify(response));
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch restaurant details");
	}
};
