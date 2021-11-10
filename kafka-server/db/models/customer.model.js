import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerSchema = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	emailId: {
		type: String,
		lowercase: true,
		unique: true,
	},
	password: { type: String },
	dob: { type: String },
	contactNumber: { type: String },
	favoriteRestaurants: {
		type: [String],
		default: [],
	},
	addresses: {
		type: [
			{
				street: { type: String },
				apt: { type: String },
				city: { type: String },
				zipcode: { type: String },
				state: { type: String },
				country: { type: String },
				type: { type: String },
			},
		],
	},
	profileImg: { type: String },
});

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
