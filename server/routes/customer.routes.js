import express from 'express';
import { CustomerController } from '../controllers/customer.controller.js';

const customerRoutes = express.Router();
const customerController = new CustomerController();

customerRoutes.post('/create-customer', customerController.createCustomer);

export default customerRoutes;
