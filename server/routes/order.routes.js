import express from "express";
import { OrderController } from "../controllers/order.controller.js";

const orderRoutes = express.Router();
const orderController = new OrderController();

// orderRoutes.post("/create-order", orderController.createOrder);

// orderRoutes.get("/compute-pages", orderController.computePagination);

// orderRoutes.get(
// 	"/customer-order-history",
// 	orderController.fetchCustomerOrderHistory
// );

// orderRoutes.get(
// 	"/restaurant-order-history",
// 	orderController.fetchRestaurantOrderHistory
// );

// orderRoutes.post(
// 	"/cancel-order/:orderId",
// 	orderController.handleCustomerOrderCancellation
// );

// orderRoutes.post(
// 	"/update-order-status",
// 	orderController.updateRestaurantReceivedOrderStatus
// );

export default orderRoutes;
