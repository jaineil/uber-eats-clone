import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    restaurantId: { type: String },
    restaurant: {
        type: {
            name: String,
            contactNumber: String,
            street: String,
            shopNo: String,
            city: String,
            zipcode: String
        }
    },
    customerId: { type: String },
    customer: {
        type: {
            firstName: String,
            lastName: String,
            contactNumber: String,
            street: String,
            apt: String,
            city: String,
            zipcode: String
        }
    },
    status: { type: String },
    time: { type: String },
    totalAmount: { type: String },
    orderItems: {
        type: [{
            dishName: { type: String },
            dishQuantity: { type: String },
            dishTotalPrice: { type: Number }
        }]
    },
    orderNote: { type: String }
});

const Order = mongoose.model('order', orderSchema);

export default Order;