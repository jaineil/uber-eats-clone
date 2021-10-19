import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import Header from "../../components/Ordering/Layout/Header";
import Meals from "../../components/Ordering/Meals/Meals";
import Cart from "../../components/Ordering/Cart/Cart";
import CartProvider from "../../store/CartProvider";
import Axios from "axios";
import cookie from "react-cookies";
import { awsServer } from "../../config/awsIP";

export const RestaurantDetails = (props) => {
	const history = useHistory();
	if (!cookie.load("customerId")) {
		console.log("No user cookie!");
		history.push("/customerSignin");
	} else {
		console.log("All good on the cookie front!");
	}
	const restaurantId = props.match.params.restaurantId;

	const [meals, setMeals] = useState([]);
	const [restaurantMeta, setRestaurantMeta] = useState([]);
	const [cartIsShown, setCartIsShown] = useState(false);

	const componentIsMounted = useRef(true);

	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const fetchRestaurantMeta = async () => {
			try {
				const response = await Axios.get(
					`http://${awsServer}/fetchRestaurantMeta/${restaurantId}`
				);
				const meta = response.data[0];
				setRestaurantMeta(meta);
				console.log("Restaurant Meta => ", restaurantMeta);
			} catch (err) {
				console.error(err);
			}
		};
		fetchRestaurantMeta();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const fetchAllMeals = async () => {
			try {
				const response = await Axios.get(
					`http://${awsServer}/fetchDishes/${restaurantId}`
				);
				setMeals(response.data);
				console.log("Restaurant Meta => ", meals);
			} catch (err) {
				console.error(err);
			}
		};
		fetchAllMeals();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const showCartHandler = () => {
		setCartIsShown(true);
	};

	const hideCartHandler = () => {
		setCartIsShown(false);
	};

	return (
		<CartProvider>
			{cartIsShown && (
				<Cart onClose={hideCartHandler} restaurantId={restaurantId} />
			)}
			<Header
				onShowCart={showCartHandler}
				restaurantImg={restaurantMeta.RESTAURANT_IMAGE_URL}
				name={restaurantMeta.NAME}
			/>
			<main>
				<Meals meals={meals} summary={restaurantMeta.DESCRIPTION} />
			</main>
		</CartProvider>
	);
};
