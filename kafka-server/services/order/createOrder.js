import Order from "../../db/models/order.model.js";
import Customer from "../../db/models/customer.model.js";
import Restaurant from "../../db/models/restaurant.model.js";

export const createOrder = async (data, callback) => {
	console.log(data);
	const customerId = data.customerId;
	const restaurantId = data.restaurantId;
	const addressId = data.addressId;
	const items = data.items;

	try {
		const customer = await Customer.findById(customerId);
		console.log("Found customer deets ", JSON.stringify(customer));
		const customerAddresses = customer.addresses;

		const restaurant = await Restaurant.findById(restaurantId);
		console.log("Found restaurant deets ", JSON.stringify(restaurant));

		let temp;
		let address;

		for (const addr of customerAddresses) {
			temp = addr._id.toString();
			if (temp === addressId) {
				address = addr;
				break;
			} else {
				continue;
			}
		}

		console.log("Found customer address deets", JSON.stringify(address));

		const customerDetails = {
			firstName: customer.firstName,
			lastName: customer.lastName,
			contactNumber: customer.contactNumber,
			street: address.street,
			apt: address.apt,
			city: address.city,
			zipcode: address.zipcode,
		};

		const restaurantDetails = {
			name: restaurant.name,
			contactNumber: restaurant.contactNumber,
			street: restaurant.street,
			shopNo: restaurant.shopNo,
			city: restaurant.city,
			zipcode: restaurant.zipcode,
		};

		let orderItems = [];

		for (const item of items) {
			orderItems.push({
				dishName: item.name,
				dishQuantity: item.amount,
				dishTotalPrice: item.price,
			});
		}

		const newOrder = new Order({
			customerId: customerId,
			restaurantId: restaurantId,
			customer: customerDetails,
			restaurant: restaurantDetails,
			status: "Order Placed",
			time: data.time,
			totalAmount: data.totalAmount,
			orderItems: orderItems,
			orderNote: data.note,
		});

		try {
			const response = await newOrder.save();
			console.log(JSON.stringify(response));
			callback(null, response);
		} catch (err) {
			console.error("Error => ", err);
		}
	} catch (err) {
		console.error("Error => ", err);
		callback(
			null,
			"Broken when fetching customer details to populate order doc"
		);
	}
};
