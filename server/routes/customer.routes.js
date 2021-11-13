import express from "express";
import { CustomerController } from "../controllers/customer.controller.js";

const customerRoutes = express.Router();
const customerController = new CustomerController();

// customerRoutes.post("/create-customer", customerController.createCustomer);

// customerRoutes.post("/update-customer", customerController.updateCustomerMeta);

customerRoutes.get(
	"/validate-customer",
	customerController.validateCustomerSignin
);

// customerRoutes.get(
// 	"/fetch-customer-location/:customerId",
// 	customerController.fetchCurrentCustomerLocation
// );

// customerRoutes.get(
// 	"/fetch-customer/:customerId",
// 	customerController.fetchCustomerMeta
// );

// customerRoutes.post(
// 	"/add-favorite",
// 	customerController.addCustomerFavoriteRestaurant
// );

// customerRoutes.get(
// 	"/fetch-favorites/:customerId",
// 	customerController.fetchCustomerFavorites
// );

// customerRoutes.post(
// 	"/add-address",
// 	customerController.addAlternateCustomerAddress
// );

// customerRoutes.get(
// 	"/fetch-addresses/:customerId",
// 	customerController.fetchCustomerAddresses
// );

export default customerRoutes;
