import Restaurant from "../../db/models/restaurant.model.js";

export const fetchOneDish = async (data, callback) => {
	console.log("Incoming data => ", data);
	const dishId = data.dishId;

	try {
		const restaurant = await Restaurant.find({ "dishes._id": dishId });
		const dishes = restaurant[0].dishes;
		const dish = dishes.filter((dish) => dish.id === dishId);
		console.log(JSON.stringify(dish));
		callback(null, dish[0]);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch a particular dish");
	}
};
