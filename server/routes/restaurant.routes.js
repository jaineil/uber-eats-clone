import express from 'express';
import { RestaurantController } from '../controllers/restaurant.controller.js';

const restaurantRoutes = express.Router();
const restaurantController = new RestaurantController();

restaurantRoutes.post('/create-restaurant', restaurantController.create);
restaurantRoutes.get('/validate-restaurant', restaurantController.validateRestaurantSignin);
restaurantRoutes.post('/update-restaurant-details', restaurantController.updateRestaurantMeta);

export default restaurantRoutes;