import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import uri from "./models/config/db.config.js";
import { make_request } from "./kafka/client.js";
import customerRoutes from "./routes/customer.routes.js";
import orderRoutes from "./routes/order.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import { serverIP } from "./serverConfig.js";

const app = express();
app.use(cors({ origin: `http://${serverIP}:3000`, credentials: true }));
app.use(cookieParser());

app.use(
	session({
		secret: "cmpe273_lab",
		resave: false,
		saveUninitialized: false,
		duration: 60 * 60 * 1000,
		activeDuration: 5 * 60 * 1000,
	})
);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

app.use(customerRoutes);
app.use(restaurantRoutes);
app.use(orderRoutes);

try {
	mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		maxPoolSize: 500,
	});
	console.log("Mongoose is connected!");
	app.listen(3001, () => {
		console.log("Server listening on port 3001");
	});
} catch (err) {
	console.error("Could not connect Mongoose => ", err);
}

app.post("/create-customer", async (req, res) => {
	console.log("Inside create-customer route");
	make_request("create-customer", req.body, (err, results) => {
		//console.log(results);
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			res.json(results);
			res.end();
		}
	});
});

app.post("/update-customer", async (req, res) => {
	console.log("Inside update-customer route");
	make_request("update-customer", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			res.json(results);
			console.log(results);
			res.end();
		}
	});
});

app.get("/fetch-customer/:customerId", async (req, res) => {
	console.log("Inside fetch-customer route");
	make_request("fetch-customer", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched user default location successfully!");
			console.log(results);
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-customer-location/:customerId", async (req, res) => {
	console.log("Inside fetch-customer-location route");
	make_request("fetch-customer-location", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched user default location successfully!");
			console.log(results);
			res.json(results);
			res.end();
		}
	});
});

app.get("/restaurants", async (req, res) => {
	console.log("Inside route to fetch restaurants");
	make_request("fetch-restaurants", req.query, (err, results) => {
		//console.log(results);
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched restaurants successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-restaurant/:restaurantId", async (req, res) => {
	console.log("Inside route to fetch restaurant dishes");
	make_request("fetch-restaurant", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched dishes to show menu successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-addresses/:customerId", async (req, res) => {
	console.log("Inside route to fetch customer addresses");
	make_request("fetch-addresses", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched dishes to show menu successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/add-address", async (req, res) => {
	console.log("Inside route to add new customer address during checkout");
	make_request("add-customer-address", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Added new address for customer successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/create-order", async (req, res) => {
	console.log("Inside route to create order");
	make_request("create-order", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Added new order for customer successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/compute-pages", async (req, res) => {
	console.log("Inside route to compute total pages for order history");
	make_request("compute-pages", req.query, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Computed pagination pages successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/customer-order-history", async (req, res) => {
	console.log("Inside route to fetch all customer orders");
	make_request("customer-order-history", req.query, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched customer orders successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/cancel-order/:orderId", async (req, res) => {
	console.log("Inside route to cancel order for customer");
	make_request("cancel-order", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Cancelled order successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/add-favorite", async (req, res) => {
	console.log("Inside route to add restauarant to favorites");
	make_request("add-favorite", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Added restaurant to favorites successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-favorites/:customerId", async (req, res) => {
	console.log("Inside route to fetch all customer favorites");
	make_request("fetch-favorites", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched customer favorites successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/search", async (req, res) => {
	console.log("Inside route to search restaurants for customer");
	make_request("search", req.query, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Searched restaurants for customer successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/create-restaurant", async (req, res) => {
	console.log("Inside route to create a new restaurant");
	make_request("create-restaurant", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Created new restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/create-dish", async (req, res) => {
	console.log("Inside route to create a dish for restaurant");
	make_request("create-dish", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Created dish for restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-dish/:dishId", async (req, res) => {
	console.log("Inside route to fetch one dish for restaurant");
	make_request("fetch-dish", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched a dish for restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/update-dish", async (req, res) => {
	console.log("Inside route to update a dish for restaurant");
	make_request("update-dish", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Updated a dish for restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-dishes/:restaurantId", async (req, res) => {
	console.log("Inside route to fetch all dishes for restaurant");
	make_request("fetch-dishes", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched all dishes for restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/fetch-dishes/:restaurantId", async (req, res) => {
	console.log("Inside route to fetch all dishes for restaurant");
	make_request("fetch-dishes", req.params, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched all dishes for restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.get("/restaurant-order-history", async (req, res) => {
	console.log("Inside route to fetch all orders for restaurant");
	make_request("restaurant-order-history", req.query, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log("Fetched all orders for restaurant successfully!");
			res.json(results);
			res.end();
		}
	});
});

app.post("/update-order-status", async (req, res) => {
	console.log("Inside route to update order status for restaurant");
	make_request("update-order-status", req.body, (err, results) => {
		if (err) {
			console.error(err);
			res.json({
				status: "Error",
				msg: "System error, try again",
			});
		} else {
			console.log(
				"Updated order status for an order for restaurant successfully!"
			);
			res.json(results);
			res.end();
		}
	});
});
