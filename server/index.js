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

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
