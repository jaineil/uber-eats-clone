import Customer from "../../db/models/customer.model.js";
import Restaurant from "../../db/models/restaurant.model.js";

export const fetchCustomerFavorites = async (data, callback) => {
	console.log("Incoming data => ", data);
	const customerId = data.customerId;

	try {
		const customerMeta = await Customer.findById(customerId);
		const favoriteIds = customerMeta.favoriteRestaurants;
		console.log(JSON.stringify(favoriteIds));
		const response = await Restaurant.find({
			_id: { $in: favoriteIds },
		});
		console.log(JSON.stringify(response));
		callback(null, response);
	} catch (err) {
		console.error("Error => ", err);
		callback(null, "Could not fetch customer favortie restos");
	}
};
