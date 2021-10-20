import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import uri from './models/config/db.config.js';

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

try {
	mongoose.connect(
		uri,
		{ useNewUrlParser: true, useUnifiedTopology: true },
	);
	console.log('Mongoose is connected!');
	app.listen(3000, () => {
		console.log('Server listening on port 3000');
	});
} catch (err) {
	console.error('Could not connect Mongoose => ', err);
}
