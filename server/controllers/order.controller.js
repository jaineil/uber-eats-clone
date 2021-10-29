import Order from '../models/order.model.js';
import Restaurant from '../models/restaurant.model.js';
import Customer from '../models/customer.model.js'


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
            console.log('Found customer deets ', JSON.stringify(customer));
            const customerAddresses = customer.addresses;

            const restaurant = await Restaurant.findById(restaurantId);
            console.log('Found restaurant deets ', JSON.stringify(restaurant));

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

            console.log('Found customer address deets', JSON.stringify(address));
            
            const customerDetails = {
                firstName: customer.firstName,
                lastName: customer.lastName,
                contactNumber: customer.contactNumber,
                street: address.street,
                apt: address.apt,
                city: address.city,
                zipcode: address.zipcode
            }

            const restaurantDetails = {
                name: restaurant.name,
                contactNumber: restaurant.contactNumber,
                street: restaurant.street,
                shopNo: restaurant.shopNo,
                city: restaurant.city,
                zipcode: restaurant.zipcode
            };

            let orderItems = [];

            for (const item of items) {
                orderItems.push({
                    dishName: item.name,
                    dishQuantity: item.amount,
                    dishTotalPrice: item.price
                });
            };

            const newOrder = new Order({
                customerId: customerId,
                restaurantId: restaurantId,
                customer: customerDetails,
                restaurant: restaurantDetails,
                status: "Order Placed",
                time: req.body.time,
                totalAmount: req.body.totalAmount,
                orderItems: orderItems
            })
            
            try {
                const response = await newOrder.save();
                console.log(JSON.stringify(response));
                res.status(200).send(response);
            } catch (err) {
                console.error('Error => ', err);
            }
        
        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Broken when fetching customer details to populate order doc');
        }
    }
    
    // API - to fetch paginated order history on customer/orders page
    fetchCustomerOrderHistory = async (req, res) => {

        console.log(req.body);

        const customerId = req.body.customerId;
        let paginationHook;
        let pageLimit;
        
        if (req.body.paginationHook) {
            paginationHook = req.body.paginationHook;
        } else {
            paginationHook = 'none';
        }
        if (req.body.pageLimit) {
            pageLimit = req.body.pageLimit;
        } else {
            pageLimit = 5;
        }

        if (paginationHook === 'none') {
            try {
                const response = await Order.find({ customerId: customerId }).limit(pageLimit);
                console.log(JSON.stringify(response));
                const lastFetchedOrder = response.at(-1);
                const newPaginationHook = lastFetchedOrder.id;
                const finalResponse = {
                    orders: response,
                    newPaginationHook: newPaginationHook
                };
                console.log(JSON.stringify(finalResponse));
                res.status(200).send(finalResponse);
            } catch (err) {
                console.error(err);
                console.log('Could not fetch customer order history w/o pagination');
            }
        } else {
            try {
                const response = await Order.find({ $and: [{ customerId: customerId }, { '_id': { '$gt': paginationHook } }] }).limit(pageLimit);
                const lastFetchedOrder = response.at(-1);
                const updatedPaginationHook = lastFetchedOrder.id;
                const finalResponse = {
                    orders: response,
                    newPaginationHook: updatedPaginationHook
                };
                console.log(JSON.stringify(finalResponse));
                res.status(200).send(finalResponse);
            } catch (err) {
                console.error(err);
                console.log('Could not fetch customer order history with pagination');
            }
        }
    }

    // API - to fetch paginated order history for restaurant/orders page
    fetchRestaurantOrderHistory = async (req, res) => {
        console.log(req.body);

        const restaurantId = req.body.restaurantId;
        let paginationHook;
        let pageLimit;
        
        if (req.body.paginationHook) {
            paginationHook = req.body.paginationHook;
        } else {
            paginationHook = 'none';
        }
        if (req.body.pageLimit) {
            pageLimit = req.body.pageLimit;
        } else {
            pageLimit = 5;
        }

        if (paginationHook === 'none') {
            try {
                const response = await Order.find({ restaurantId: restaurantId }).limit(pageLimit);
                console.log(JSON.stringify(response));
                const lastFetchedOrder = response.at(-1);
                const newPaginationHook = lastFetchedOrder.id;
                const finalResponse = {
                    orders: response,
                    newPaginationHook: newPaginationHook
                };
                console.log(JSON.stringify(finalResponse));
                res.status(200).send('Fetched');
            } catch (err) {
                console.error(err);
                console.log('Could not fetch customer order history w/o pagination');
            }
        } else {
            try {
                const response = await Order.find({ $and: [{ restaurantId: restaurantId }, { '_id': { '$gt': paginationHook } }] }).limit(pageLimit);
                const lastFetchedOrder = response.at(-1);
                const updatedPaginationHook = lastFetchedOrder.id;
                const finalResponse = {
                    orders: response,
                    newPaginationHook: updatedPaginationHook
                };
                console.log(JSON.stringify(finalResponse));
                res.status(200).send('Fetched');
            } catch (err) {
                console.error(err);
                console.log('Could not fetch customer order history with pagination');
            }
        }
    }

    // API - to handle cancellation of order by customer
    // Allows cancellation in Order Placed state before restaurant takes it to Preparing state
    handleCustomerOrderCancellation = async (req, res) => {
        const orderId = res.body.orderId;

        try {
            const response = await Order.findById(orderId);
            if (response.status === 'Order Placed') {
                await Order.findByIdAndUpdate(orderId, { $set: { 'status': 'Cancelled' } });
                res.status(200).send({cancelled: true});
            }
            res.status(400).send({ cancelled: false });

        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Error when cancelling order');
        }
    }

    // API - to update current status of customer's order, done by restaurant
    // statuses - order-placed, preparing, ready-for-pickup, out-for-delivery, picked-up, delivered
    updateRestaurantReceivedOrderStatus = async (req, res) => {
        console.log(req.body);
        const orderId = req.body.orderId;
        const updatedStatus = req.body.status;

        try {
            await Order.findByIdAndUpdate(orderId, { $set: { status: updatedStatus } });
            res.status(200).send({cancelled: true});
        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Error when updating order status');
        }
    }
}