import { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
	Row,
	Col,
	Container,
	Navbar,
	Form,
	FormControl,
} from "react-bootstrap";
import cookie from "react-cookies";
import Axios from "axios";
import classes from "../Orders/RestaurantOrders.module.css";
import RestNavbar from "../Navbar/RestNavbar";
import { awsServer } from "../../config/awsIP";

export const RestaurantOrders = () => {
	const [orders, setOrders] = useState([]);
	const [displayOrders, setDisplayOrders] = useState([]);

	const history = useHistory();

	if (!cookie.load("restaurantId")) {
		console.log("No user cookie!");
		history.push("/restaurantSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const restaurantId = cookie.load("restaurantId");
	const componentIsMounted = useRef(true);
	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	const fetchOrders = async () => {
		console.log("About to fetch dishes for => ", restaurantId);
		let temp = [];
		try {
			const response = await Axios.get(
				`http://${awsServer}/fetchCustomerOrders/${restaurantId}`
			);
			const fetchedOrders = response.data;

			for (const k of fetchedOrders) {
				console.log(k);
				temp.push(k);
			}

			setOrders(temp);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateOrderStatus = async (payload) => {
		try {
			console.log("Shooting payload => ", payload);
			await Axios.post(`http://${awsServer}/updateOrderStatus`, payload);
			window.location.reload(false);
		} catch (err) {
			console.error("Error when updating order status => ", err);
		}
	};

	const handleOrderStatusChange = (id) => async (e) => {
		const payload = {
			orderId: id,
			orderStatus: e.target.value,
		};
		await updateOrderStatus(payload);
	};

	const createOrdersSummary = (dishNames, dishQuantities) => {
		const arrDishNames = dishNames.split(",");
		const arrDishQuantities = dishQuantities.split(",");
		let orderItems = [];
		for (let i = 0; i < arrDishNames.length; i++) {
			const obj = {
				name: arrDishNames[i],
				quantity: arrDishQuantities[i],
			};
			orderItems.push(obj);
		}
		console.log(orderItems);

		const orderItemsList = orderItems.map((orderItem) => (
			<Row>
				<Col style={{ width: "150px", marginLeft: "100px" }}>
					{orderItem.name} - x{orderItem.quantity}
					<hr />
				</Col>
			</Row>
		));

		return orderItemsList;
	};

	const handleOrdersFilterChange = (e) => {
		const filter = e.target.value;
		let filteredOrders = [];

		for (const order of orders) {
			if (order.STATUS === filter) {
				filteredOrders.push(
					<Container>
						<li className={classes.order}>
							<Row>
								<Col>
									<h3>
										{order.FNAME} {order.LNAME}
									</h3>
									<div>
										{order.STREET} #{order.HOUSE_NUMBER}
									</div>
									<div>
										{order.CITY} {order.PINCODE}
									</div>
									<br />
									<div>
										<Col>
											Contact: {order.CONTACT_NUMBER}
										</Col>
									</div>
								</Col>

								<Col>
									<Form.Label>Update status:</Form.Label>
									<FormControl
										as="select"
										onChange={handleOrderStatusChange(
											order.ID
										)}
									>
										<option value={order.STATUS}>
											{order.STATUS}
										</option>
										<option value="ORDER_PLACED">
											ORDER_PLACED
										</option>
										<option value="PREPARING">
											PREPARING
										</option>
										<option value="ON_THE_WAY">
											ON_THE_WAY
										</option>
										<option value="DELIVERED">
											DELIVERED
										</option>
									</FormControl>
									<hr />
									<div>
										<Col>
											Current status: {order.STATUS}
										</Col>
									</div>
								</Col>

								<Col>
									<div>
										{createOrdersSummary(
											order.DISH_NAMES,
											order.DISH_QUANTITIES
										)}
									</div>
									<div style={{ paddingLeft: "100px" }}>
										<h6>Total: ${order.AMOUNT}</h6>
									</div>
								</Col>
							</Row>
						</li>
					</Container>
				);
			}
		}

		setDisplayOrders(filteredOrders);
	};

	return (
		<Container fluid>
			<RestNavbar />
			<h3
				className="mt-3"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				Your Restaurant's Orders
			</h3>

			<FormControl
				as="select"
				onChange={handleOrdersFilterChange}
				style={{ backgroundColor: "whitesmoke" }}
			>
				<option>Select order status to view orders</option>
				<option value="ORDER_PLACED">Order Placed</option>
				<option value="PREPARING">Preparing</option>
				<option value="ON_THE_WAY">On the way</option>
				<option value="DELIVERED">Delivery</option>
			</FormControl>

			<section className={classes.orders}>
				<div className={classes.card}>
					<ul>{displayOrders}</ul>
				</div>
			</section>
		</Container>
	);
};
