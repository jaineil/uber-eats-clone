import { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
	Row,
	Col,
	Container,
	Form,
	FormControl,
	Pagination,
} from "react-bootstrap";
import cookie from "react-cookies";
import Axios from "axios";
import classes from "../Orders/RestaurantOrders.module.css";
import RestNavbar from "../Navbar/RestNavbar";
import { awsServer } from "../../config/awsIP";

export const RestaurantOrders = () => {
	const [displayOrders, setDisplayOrders] = useState([]);
	const [paginationItems, setPaginationItems] = useState([]);
	const [orderStatus, setOrderStatus] = useState();
	const [pageLimit, setPageLimit] = useState();
	const [currentPageNumber, setCurrentPageNumber] = useState();
	const [totalPages, setTotalPages] = useState();

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

	const defaultFetchOrders = async () => {
		console.log("About to fetch orders for => ", restaurantId);

		try {
			const orders = await Axios.get(
				`http://${awsServer}/restaurant-order-history`,
				{
					params: {
						restaurantId: restaurantId,
						pageLimit: 5,
						pageNumber: 1,
					},
				}
			);

			const computedTotalPages = await Axios.get(
				`http://${awsServer}/compute-pages`,
				{
					params: {
						id: restaurantId,
						pageLimit: 5,
					},
				}
			);

			console.log(
				"Total pages created => ",
				computedTotalPages.data.pages
			);

			setCurrentPageNumber(1);
			setPageLimit(5);
			setTotalPages(computedTotalPages.data.pages);

			createDisplayableOrderCards(orders.data);
			createPaginationButtons(computedTotalPages.data.pages, 1);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchOrders = async (
		selectedOrderStatus,
		selectedPageLimit,
		selectedPageNumber
	) => {
		console.log("About to fetch filtered orders for => ", restaurantId);
		console.log(
			"New filters payload => ",
			selectedOrderStatus,
			selectedPageLimit,
			selectedPageNumber
		);
		try {
			const orders = await Axios.get(
				`http://${awsServer}/restaurant-order-history`,
				{
					params: {
						orderStatus: selectedOrderStatus,
						restaurantId: restaurantId,
						pageLimit: selectedPageLimit,
						pageNumber: selectedPageNumber,
					},
				}
			);

			const computedTotalPages = await Axios.get(
				`http://${awsServer}/compute-pages`,
				{
					params: {
						id: restaurantId,
						orderStatus: selectedOrderStatus,
						pageLimit: selectedPageLimit,
					},
				}
			);

			console.log(
				"Total pages created => ",
				computedTotalPages.data.pages
			);

			setTotalPages(computedTotalPages.data.pages);
			createPaginationButtons(
				computedTotalPages.data.pages,
				selectedPageNumber
			);
			createDisplayableOrderCards(orders.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		defaultFetchOrders();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const createPaginationButtons = (totalPages, updatedCurrentPageNumber) => {
		let items = [];

		for (let number = 1; number <= totalPages; number++) {
			items.push({
				number: number,
				isActive: number === parseInt(updatedCurrentPageNumber),
			});
		}
		setPaginationItems(items);
	};

	const createPaginationButtonsHTML = (obj) => {
		return (
			<Pagination.Item
				key={obj.number}
				active={obj.isActive}
				activeLabel=""
				onClick={handleOrdersPageChange}
			>
				{obj.number}
			</Pagination.Item>
		);
	};

	const updateOrderStatus = (id) => async (e) => {
		const payload = {
			orderId: id,
			orderStatus: e.target.value,
		};

		try {
			console.log("Shooting payload => ", payload);
			await Axios.post(
				`http://${awsServer}/update-order-status`,
				payload
			);
			window.location.reload(false);
			//console.log("Shot this update call with payload =>", payload);
		} catch (err) {
			console.error("Error when updating order status => ", err);
		}
	};

	const handleOrdersStatusChange = async (e) => {
		const newOrderStatus = e.target.value;
		setOrderStatus(newOrderStatus);

		if (newOrderStatus === "All") {
			await defaultFetchOrders();
		} else {
			await fetchOrders(newOrderStatus, pageLimit, currentPageNumber);
		}
	};

	const handleOrdersPageLimit = async (e) => {
		const newPageLimit = e.target.value;
		setPageLimit(parseInt(newPageLimit));

		if (newPageLimit === "default") {
			await defaultFetchOrders();
		} else {
			await fetchOrders(orderStatus, newPageLimit, currentPageNumber);
		}
	};

	const handleOrdersPageChange = async (e) => {
		const newCurrentPageNumber = e.target.innerText;
		setCurrentPageNumber(newCurrentPageNumber);

		await fetchOrders(orderStatus, pageLimit, newCurrentPageNumber);
	};

	const createOrdersSummary = (orderItems) => {
		const orderItemsList = orderItems.map((orderItem) => (
			<Row>
				<Col style={{ width: "150px", marginLeft: "100px" }}>
					{orderItem.dishName}
					<hr />
				</Col>
			</Row>
		));

		return orderItemsList;
	};

	const makeDisplayableDate = (time) => {
		const d = new Date(time);
		return d.toDateString();
	};

	const createDisplayableOrderCards = (orders) => {
		let ordersList = [];
		console.log("Orders => ", orders);
		for (const order of orders) {
			ordersList.push(
				<Container>
					<li className={classes.order}>
						<Row>
							<Col>
								<h3>
									{order.customer.firstName}{" "}
									{order.customer.lastName}
								</h3>
								<div>
									{order.customer.street} #
									{order.customer.apt}
								</div>
								<div>{order.customer.city}</div>
								<br />
								<div>
									<Col>
										Contact: {order.customer.contactNumber}
									</Col>
								</div>
							</Col>

							<Col>
								<Row>Current status: {order.status}</Row>
								<Row>
									When: {makeDisplayableDate(order.time)}
								</Row>
								<Row>
									{order.orderNote
										? `Order notes: ${order.orderNote}`
										: ""}
								</Row>
							</Col>

							<Col>
								<Form.Label>Update status:</Form.Label>
								<FormControl
									as="select"
									onChange={updateOrderStatus(order._id)}
								>
									<option value={order.status}>
										{order.status}
									</option>
									<option value="Order Placed">
										Order Placed
									</option>
									<option value="Cancelled">Cancelled</option>
									<option value="Preparing">Preparing</option>
									<option value="On the way">
										On the way
									</option>
									<option value="Delivered">Delivered</option>
								</FormControl>
							</Col>

							<Col>
								<div>
									{createOrdersSummary(order.orderItems)}
								</div>
								<div style={{ paddingLeft: "100px" }}>
									<h6>Total: ${order.totalAmount}</h6>
								</div>
							</Col>
						</Row>
					</li>
				</Container>
			);
		}

		setDisplayOrders(ordersList);
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

			<Row>
				<Col>
					<FormControl
						as="select"
						onChange={handleOrdersStatusChange}
						style={{ backgroundColor: "whitesmoke" }}
					>
						<option value="All">
							Select type of order to view
						</option>
						<option value="Order Placed">Order Placed</option>
						<option value="Preparing">Preparing</option>
						<option value="Cancelled">Cancelled</option>
						<option value="On the way">On the way</option>
						<option value="Picked up">Picked up</option>
						<option value="Delivered">Delivered</option>
					</FormControl>
				</Col>
				<Col></Col>
				<Col>
					<FormControl
						as="select"
						onChange={handleOrdersPageLimit}
						style={{ backgroundColor: "whitesmoke" }}
					>
						<option value="default">
							Select number of results
						</option>
						<option value="2">2</option>
						<option value="5">5</option>
						<option value="10">10</option>
					</FormControl>
				</Col>
			</Row>

			<section className={classes.orders}>
				<div className={classes.card}>
					<ul>{displayOrders}</ul>
				</div>
				<br />
				<div>
					<Pagination size="sm">
						{paginationItems.map(createPaginationButtonsHTML)}
					</Pagination>
				</div>
			</section>
		</Container>
	);
};
