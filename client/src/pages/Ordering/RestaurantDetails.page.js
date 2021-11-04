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
	console.log('Fetching details for resto => ', restaurantId);
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
					`http://${awsServer}/fetch-restaurant/${restaurantId}`
				);
				const meta = response.data;
				setRestaurantMeta(meta);
				setMeals(meta.dishes);
				console.log("Restaurant Meta => ", restaurantMeta);
			} catch (err) {
				console.error(err);
			}
		};
		fetchRestaurantMeta();
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
				restaurantImg={restaurantMeta.profileImgUrl}
				name={restaurantMeta.name}
			/>
			<main>
				<Meals meals={meals} summary={restaurantMeta.description} />
			</main>
		</CartProvider>
	);
};
