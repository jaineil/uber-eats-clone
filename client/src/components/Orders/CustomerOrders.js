import { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Row, Col, Container, FormControl } from "react-bootstrap";
import cookie from "react-cookies";
import Axios from "axios";
import CustNavbar from "../Navbar/CustNavbar";
import classes from "../Orders/RestaurantOrders.module.css";
import { awsServer } from "../../config/awsIP";

export const CustomerOrders = (props) => {
	const [orders, setOrders] = useState([]);
	const [displayOrders, setDisplayOrders] = useState([]);

	const history = useHistory();

	if (!cookie.load("customerId")) {
		console.log("No user cookie!");
		history.push("/customerSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const customerId = props.match.params.customerId;

	const componentIsMounted = useRef(true);
	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	const fetchOrders = async () => {
		console.log("About to fetch orders for => ", customerId);
		let temp = [];
		try {
			const response = await Axios.get(
				`http://${awsServer}/fetchOrderHistory/${customerId}`
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

	const createOrdersSummary = (dishNames) => {
		const arrDishNames = dishNames.split(",");
		console.log(arrDishNames);
		const orderItemsList = arrDishNames.map((orderItem) => (
			<Row>
				<Col style={{ width: "150px", marginLeft: "100px" }}>
					{orderItem}
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
									<h3>{order.NAME}</h3>
									<div>
										{order.STREET} #{order.HOUSE_NUMBER}
									</div>
									<div>{order.CITY}</div>
									<br />
									<div>
										<Col>
											Contact: {order.CONTACT_NUMBER}
										</Col>
									</div>
								</Col>

								<Col>
									<Row>Current status: {order.STATUS}</Row>
									<Row>When: {order.ORDER_TIME}</Row>
								</Col>

								<Col>
									<div>
										{createOrdersSummary(order.DISH_NAMES)}
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
			<CustNavbar />

			<h3
				className="mt-3"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				Your Past Orders
			</h3>
			<br />
			<FormControl
				as="select"
				onChange={handleOrdersFilterChange}
				style={{ backgroundColor: "whitesmoke" }}
			>
				<option>Select type of order to view</option>
				<option value="ORDER_PLACED">Order Placed</option>
				<option value="PREPARING">Preparing</option>
				<option value="ON_THE_WAY">On the way</option>
				<option value="DELIVERED">Delivered</option>
			</FormControl>

			<h4 style={{ color: "white" }}>Your past orders</h4>

			<section className={classes.orders}>
				<div className={classes.card}>
					<ul>{displayOrders}</ul>
				</div>
			</section>
		</Container>
	);
};
