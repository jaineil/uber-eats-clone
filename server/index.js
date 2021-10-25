import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import uri from './models/config/db.config.js';
import customerRoutes from './routes/customer.routes.js';
import orderRoutes from './routes/order.routes.js';
import restaurantRoutes from './routes/restaurant.routes.js';

const app = express();
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(cookieParser());

app.use(
	session({
		secret: 'cmpe273_lab',
		resave: false,
		saveUninitialized: false,
		duration: 60 * 60 * 1000,
		activeDuration: 5 * 60 * 1000,
	}),
);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	}),
);

app.use(customerRoutes);
app.use(restaurantRoutes);
// app.use(orderRoutes);

try {
	mongoose.connect(
		uri,
		{ useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 500 },
	);
	console.log('Mongoose is connected!');
	app.listen(3001, () => {
		console.log('Server listening on port 3001');
	});
} catch (err) {
	console.error('Could not connect Mongoose => ', err);
}
