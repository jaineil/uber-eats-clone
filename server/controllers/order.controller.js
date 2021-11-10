import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import Customer from "../models/customer.model.js";

export class OrderController {
	// API - to place order (restaurant details logic pending)
	createOrder = async (req, res) => {
		console.log(req.body);
		const customerId = req.body.customerId;
		const restaurantId = req.body.restaurantId;
		const addressId = req.body.addressId;
		const items = req.body.items;

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

			console.log(
				"Found customer address deets",
				JSON.stringify(address)
			);

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
				time: req.body.time,
				totalAmount: req.body.totalAmount,
				orderItems: orderItems,
				orderNote: req.body.note,
			});

			try {
				const response = await newOrder.save();
				console.log(JSON.stringify(response));
				res.status(200).send(response);
			} catch (err) {
				console.error("Error => ", err);
			}
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send(
				"Broken when fetching customer details to populate order doc"
			);
		}
	};

	computePagination = async (req, res) => {
		console.log(req.query);

		const id = req.query.id;
		const orderStatus = req.query.orderStatus
			? req.query.orderStatus
			: null;
		const pageLimit = req.query.pageLimit ? req.query.pageLimit : 5;
		console.log("About to compute pages");

		// fetch all orders as no orderStatus is given in request
		if (orderStatus === null || orderStatus === "All") {
			try {
				const totalOrders = await Order.find({
					$or: [{ customerId: id }, { restaurantId: id }],
				});

				const pages = Math.ceil(totalOrders.length / pageLimit);
				res.status(200).send({ pages: pages });
			} catch (err) {
				console.error("Error => ", err);
				res.status(500).send(
					"Broken when calculating number of pages for all orders"
				);
			}
		} else {
			// fetch all orders with a given orderStatus in request
			try {
				const totalOrders = await Order.find({
					$and: [
						{ $or: [{ customerId: id }, { restaurantId: id }] },
						{ status: orderStatus },
					],
				});

				const pages = Math.ceil(totalOrders.length / pageLimit);
				console.log(pages);
				res.status(200).send({ pages: pages });
			} catch (err) {
				console.error("Error => ", err);
				res.status(500).send(
					`Broken when calculating number of pages for order status: ${orderStatus}`
				);
			}
		}
	};

	// API - to fetch paginated order history on customer/orders page
	fetchCustomerOrderHistory = async (req, res) => {
		console.log(req.query);

		const customerId = req.query.customerId;
		const orderStatus = req.query.orderStatus
			? req.query.orderStatus
			: null;
		const pageLimit = req.query.pageLimit
			? parseInt(req.query.pageLimit)
			: 5;
		const requestedPageNumber = parseInt(req.query.pageNumber);

		const skip = pageLimit * (requestedPageNumber - 1);

		console.log("Computed documents to skip => ", skip);

		// fetch all orders where no orderStatus is given in request
		if (orderStatus === null || orderStatus === "All") {
			try {
				const orders = await Order.find({ customerId: customerId })
					.skip(skip)
					.limit(pageLimit);
				console.log(JSON.stringify(orders));
				res.status(200).send(orders);
			} catch (err) {
				console.error(err);
				console.log(
					"Could not fetch customer order history w/o status filter"
				);
				res.status(500).send(
					"Could not fetch customer order history w/o status filter"
				);
			}
		} else {
			// fetch all orders with a given orderStatus in request
			try {
				const orders = await Order.find({
					$and: [{ customerId: customerId }, { status: orderStatus }],
				})
					.skip(skip)
					.limit(pageLimit);
				console.log(JSON.stringify(orders));
				res.status(200).send(orders);
			} catch (err) {
				console.error(err);
				console.log(
					"Could not fetch customer order history w/ status filter"
				);
				res.status(500).send(
					"Could not fetch customer order history w/ status filter"
				);
			}
		}
	};

	// API - to fetch paginated order history for restaurant/orders page
	fetchRestaurantOrderHistory = async (req, res) => {
		console.log(req.query);

		const restaurantId = req.query.restaurantId;
		const orderStatus = req.query.orderStatus
			? req.query.orderStatus
			: null;
		const pageLimit = req.query.pageLimit
			? parseInt(req.query.pageLimit)
			: 5;
		const requestedPageNumber = parseInt(req.query.pageNumber);
		const skip = pageLimit * (requestedPageNumber - 1);

		console.log("Computed documents to skip => ", skip);

		if (orderStatus === null || orderStatus === "All") {
			try {
				const orders = await Order.find({ restaurantId: restaurantId })
					.skip(skip)
					.limit(pageLimit);

				console.log(JSON.stringify(orders));
				res.status(200).send(orders);
			} catch (err) {
				console.error(err);
				res.status(500).send(
					"Could not fetch restaurant order history w/o status filter"
				);
			}
		} else {
			// fetch all orders with a given orderStatus in request
			try {
				const orders = await Order.find({
					$and: [
						{ restaurantId: restaurantId },
						{ status: orderStatus },
					],
				})
					.skip(skip)
					.limit(pageLimit);
				console.log(JSON.stringify(orders));
				res.status(200).send(orders);
			} catch (err) {
				console.error(err);
				res.status(500).send(
					"Could not fetch restaurant order history wiith status filter"
				);
			}
		}
	};

	// API - to handle cancellation of order by customer
	// Allows cancellation in Order Placed state before restaurant takes it to Preparing state
	handleCustomerOrderCancellation = async (req, res) => {
		const orderId = req.params.orderId;

		try {
			const response = await Order.findById(orderId);
			if (response.status === "Order Placed") {
				await Order.findByIdAndUpdate(orderId, {
					$set: { status: "Cancelled" },
				});
				res.status(200).send({ cancelled: true });
			}
			res.status(400).send({ cancelled: false });
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Error when cancelling order");
		}
	};

	// API - to update current status of customer's order, done by restaurant
	// statuses - 'Order Placed', 'Preparing', 'Ready for pickup', 'Out for delivery', 'Picked up', 'Delivered'
	updateRestaurantReceivedOrderStatus = async (req, res) => {
		console.log(req.body);
		const orderId = req.body.orderId;
		const updatedStatus = req.body.orderStatus;

		try {
			await Order.findByIdAndUpdate(orderId, {
				$set: { status: updatedStatus },
			});
			res.status(200).send("Updated");
		} catch (err) {
			console.error("Error => ", err);
			res.status(500).send("Error when updating order status");
		}
	};
}
