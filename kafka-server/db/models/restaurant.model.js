import mongoose from "mongoose";

const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
	name: { type: String },
	emailId: { type: String, unique: true },
	password: { type: String },
	contactNumber: { type: String },
	street: { type: String },
	shopNo: { type: String },
	city: { type: String },
	state: { type: String },
	zipcode: { type: String },
	country: { type: String },
	opensAt: { type: String },
	closesAt: { type: String },
	description: { type: String },
	cuisine: { type: String },
	profileImgUrl: { type: String },
	deliveryOption: { type: Boolean },
	pickupOption: { type: Boolean },
	veg: { type: Boolean },
	nonVeg: { type: Boolean },
	vegan: { type: Boolean },
	dishes: {
		type: [
			{
				name: { type: String },
				price: { type: Number },
				description: { type: String },
				category: { type: String },
				foodType: { type: String },
				ingredients: { type: String },
				dishImgUrl: { type: String },
			},
		],
	},
});

const Restaurant = mongoose.model("restaurant", restaurantSchema);

export default Restaurant;
