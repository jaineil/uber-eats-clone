import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    restaurant: {
        type: {
            name: String,
            contactNumber: String,
            street: String,
            apt: String,
            city: String,
            zipcode: String
        }
    },
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
            dishTotalPrice: { type: String }
        }]
    }
});

const Order = mongoose.model('order', orderSchema);

export default Order;