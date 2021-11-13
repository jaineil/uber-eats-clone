import express from "express";
import { RestaurantController } from "../controllers/restaurant.controller.js";

const restaurantRoutes = express.Router();
const restaurantController = new RestaurantController();

// restaurantRoutes.post("/create-restaurant", restaurantController.create);

restaurantRoutes.get(
	"/validate-restaurant",
	restaurantController.validateRestaurantSignin
);

// restaurantRoutes.get(
// 	"/fetch-restaurant/:restaurantId",
// 	restaurantController.fetchRestaurantMeta
// );

restaurantRoutes.post(
	"/update-restaurant-details",
	restaurantController.updateRestaurantMeta
);

// restaurantRoutes.get("/restaurants", restaurantController.fetchRestaurants);

// restaurantRoutes.post("/create-dish", restaurantController.createDish);

// restaurantRoutes.get(
// 	"/fetch-dish/:dishId",
// 	restaurantController.fetchOneDishForRestaurant
// );

// restaurantRoutes.post("/update-dish", restaurantController.updateDish);

// restaurantRoutes.get(
// 	"/fetch-dishes/:restaurantId",
// 	restaurantController.fetchAllDishesForRestaurant
// );

// restaurantRoutes.get("/search", restaurantController.search);

export default restaurantRoutes;
