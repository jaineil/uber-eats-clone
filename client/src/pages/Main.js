import React, { Component } from "react";
import { Route } from "react-router-dom";
import { CustomerSignup } from "./CustomerSignup/CustomerSignup.page";
import { CustomerSignin } from "./Login/CustomerSignin.page";
import { RestaurantSignup } from "./RestaurantSignup/RestaurantSignup.page";
import { RestaurantSignin } from "./Login/RestaurantLogin.page";
import { RestaurantDetails } from "./Ordering/RestaurantDetails.page";
import { OrderSummary } from "../components/Dashboard/OrderSummary";
import { Welcome } from "../components/Dashboard/Welcome";
import { RestaurantDashboard } from "../components/Dashboard/RestaurantDashboard";
import { RestaurantProfile } from "../components/Profile/RestaurantProfile";
import { RestaurantMenu } from "../components/Profile/RestaurantMenu";
import { EditDish } from "../components/Dish/EditDish";
import { RestaurantOrders } from "../components/Orders/RestaurantOrders";
import { CustomerDashboard } from "../components/Dashboard/CustomerDashboard";
import { CustomerFavorites } from "../components/Dashboard/CustomerFavorites";
import { CustomerOrders } from "../components/Orders/CustomerOrders";
//Main Component for routing all components

export default class Main extends Component {
	render() {
		return (
			<div>
				{/*Render Different Component based on Route*/}
				<Route path="/welcome" component={Welcome} />
				<Route path="/customerSignup" component={CustomerSignup} />
				<Route path="/customerSignin" component={CustomerSignin} />
				<Route
					path="/chooseDish/:restaurantId"
					component={RestaurantDetails}
				/>
				<Route path="/dashboard" component={CustomerDashboard} />
				<Route
					path="/favorites/:customerId"
					component={CustomerFavorites}
				/>
				<Route path="/order" component={OrderSummary} />
				<Route
					path="/viewOrders/:customerId"
					component={CustomerOrders}
				/>

				<Route path="/restaurantSignup" component={RestaurantSignup} />
				<Route path="/restaurantSignin" component={RestaurantSignin} />
				<Route
					path="/restaurantDashboard"
					component={RestaurantDashboard}
				/>
				<Route
					path="/restaurantProfile"
					component={RestaurantProfile}
				/>
				<Route path="/restaurantMenu" component={RestaurantMenu} />
				<Route path="/orders" component={RestaurantOrders} />
				<Route path="/dishes/edit/:mealId" component={EditDish} />
			</div>
		);
	}
}
