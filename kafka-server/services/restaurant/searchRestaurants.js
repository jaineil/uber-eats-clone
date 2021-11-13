import Restaurant from "../../db/models/restaurant.model.js";

export const searchRestaurants = async (data, callback) => {
	console.log(data);

	const query = data.searchString;
	const queryString = query.toLowerCase();

	if (
		queryString === "pickup" ||
		queryString === "pick up" ||
		queryString === "pick-up"
	) {
		try {
			const response = await Restaurant.find({ pickupOption: true });
			console.log(JSON.stringify(response));
			callback(null, response);
		} catch (err) {
			console.error("Error => ", err);
			callback(null, "Could not find pick up restaurants");
		}
	} else if (queryString === "delivery") {
		try {
			const response = await Restaurant.find({
				deliveryOption: true,
			});
			console.log(JSON.stringif(response));
			callback(null, response);
		} catch (err) {
			console.error("Error => ", err);
			callback(null, "Could not find delivery restaurants");
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
			callback(null, response);
		} catch (err) {
			console.error("Error => ", err);
			callback(null, "Could not find search string in restaurants");
		}
	}
};
