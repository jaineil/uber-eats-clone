import Restaurant from "../../db/models/restaurant.model.js";

export const updateDish = async (data, callback) => {
	console.log("Incoming data => ", data);

	const dishId = data.mealId;

	const updatedDishObj = {
		name: data.name,
		description: data.description,
		price: data.price,
		ingredients: data.ingredients,
		category: data.category,
		dishImgUrl: data.dishImgUrl,
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
		callback(null, "Updated");
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not update dish details for a restaurant");
	}
};
