import Restaurant from "../../db/models/restaurant.model.js";

export const createDish = async (data, callback) => {
	console.log("Incoming data => ", data);
	const restaurantId = data.restaurantId;
	const newDishObj = {
		name: data.name,
		price: data.price,
		description: data.description,
		category: data.category,
		foodType: data.foodType,
		ingredients: data.ingredients,
		dishImgUrl: data.dishImgUrl,
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
		callback(null, "Added");
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not add new dish to restaurant");
	}
};
