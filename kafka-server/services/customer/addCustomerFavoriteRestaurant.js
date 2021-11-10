import Customer from "../../db/models/customer.model.js";

export const addCustomerFavoriteRestaurant = async (data, callback) => {
	console.log("Incoming data => ", data);
	const customerId = data.customerId;
	const restaurantId = data.restaurantId;

	try {
		await Customer.findByIdAndUpdate(customerId, {
			$push: { favoriteRestaurants: restaurantId },
		});
		callback(null, "Added");
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not add favorite resto");
	}
};
