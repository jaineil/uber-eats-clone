import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {
	Container,
	Col,
	Row,
	Button,
	Alert,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
} from "react-bootstrap";
import CustNavbar from "../Navbar/CustNavbar";
import Axios from "axios";
import cookie from "react-cookies";
import { awsServer } from "../../config/awsIP";

export const OrderSummary = (props) => {
	const history = useHistory();
	if (!cookie.load("customerId")) {
		console.log("No user cookie!");
		history.push("/customerSignin");
	} else {
		console.log("All good on the cookie front!");
	}
	const customerId = cookie.load("customerId");
	const cart = JSON.parse(sessionStorage.state);
	console.log(JSON.stringify(cart));

	const componentIsMounted = useRef(true);

	const [show, setShow] = useState(false);
	const [addressIds, setAddressIds] = useState([]);
	const [selectedAddressId, setSelectedAddressId] = useState("");
	const [street, setStreet] = useState("");
	const [apt, setApt] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");

	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const fetchAllAddresses = async () => {
			try {
				const response = await Axios.get(
					`http://${awsServer}/fetchAddresses/${customerId}`
				);
				console.log(response.data);
				setAddressIds(response.data);
				const defaultAddress = response.data[0];
				setSelectedAddressId(defaultAddress.ID);
			} catch (err) {
				console.error(err);
			}
		};
		fetchAllAddresses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const orderItemsList = cart.cartItems.map((item) => (
		<Row>
			<Col xs={6} md={4}>
				<h5>{item.name}</h5>
			</Col>
			<Col xs={6} md={4}>
				<h5>Qty. {item.amount}</h5>
			</Col>
			<Col xs={6} md={4}>
				<h5>${item.price}</h5>
			</Col>
		</Row>
	));

	const addressList = addressIds.map((addr) => (
		<option value={addr.ID}>
			{addr.HOUSE_NUMBER} {addr.STREET} {addr.CITY} {addr.STATE}{" "}
			{addr.PINCODE}
		</option>
	));

	const selectAddressHandler = (e) => {
		e.preventDefault();
		setSelectedAddressId(e.target.value);
	};

	const addNewAddressForCustomer = async () => {
		const payload = {
			customerId: customerId,
			street: street,
			apt: apt,
			city: city,
			state: state,
			zipcode: zipcode,
			country: "United States",
		};
		try {
			await Axios.post(
				`http://${awsServer}/addNewCustomerAddress`,
				payload
			);
		} catch (err) {
			console.error("Error when registering new customer => ", err);
		}
	};

	const finalizedOrder = async () => {
		setShow(true);
		const today = new Date();
		const payload = {
			restaurantId: cart.restaurantId,
			customerId: customerId,
			time: today.toISOString(),
			amount: parseInt(cart.total),
			addressId: selectedAddressId,
			items: cart.cartItems,
		};
		const res = await Axios.post(`http://${awsServer}/placeOrder`, payload);
		console.log("Response from API => ", res);
	};

	return (
		<Container fluid>
			<CustNavbar />
			<Row
				style={{
					paddingTop: "25px",
					paddingLeft: "50px",
					paddingRight: "50px",
				}}
			>
				<Col md={8} style={{ background: "whitesmoke" }}>
					<h3 className="mt-3">Select Address</h3>
					<FormControl as="select" onChange={selectAddressHandler}>
						{addressList}
					</FormControl>
					<br />
					<h5>Don't see your address?</h5>
					<h5>Add a new address:</h5>

					<Form onSubmit={addNewAddressForCustomer}>
						<FormGroup className="mt-3">
							<FormLabel>Street: </FormLabel>
							<FormControl
								type="text"
								placeholder="eg. 1234 Main St"
								onChange={(e) => {
									setStreet(e.target.value);
								}}
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Apartment: </FormLabel>
							<FormControl
								type="text"
								placeholder="eg. Apartment, studio, or floor"
								onChange={(e) => {
									setApt(e.target.value);
								}}
							/>
						</FormGroup>

						<Row>
							<Col>
								<FormGroup className="mt-3">
									<FormLabel>City: </FormLabel>
									<FormControl
										type="text"
										placeholder="eg. San Jose"
										onChange={(e) => {
											setCity(e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup className="mt-3">
									<FormLabel>State: </FormLabel>
									<FormControl
										type="text"
										placeholder="eg. CA"
										onChange={(e) => {
											setState(e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup className="mt-3 mb-3">
									<FormLabel>Zipcode: </FormLabel>
									<FormControl
										type="text"
										placeholder="eg. 95111"
										onChange={(e) => {
											setZipcode(e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
						</Row>
						<Button
							type="submit"
							style={{
								background: "black",
								border: "black",
							}}
							className="mb-3"
						>
							Submit
						</Button>
					</Form>
				</Col>

				<Col md={4} style={{ background: "whitesmoke" }}>
					<h2 className="mt-3">Order Summary</h2>
					<br />
					{orderItemsList}
					<hr />
					<Row>
						<Col xs={6} md={4}></Col>
						<Col xs={6} md={4}></Col>
						<Col xs={6} md={4}>
							<h5>${cart.total}</h5>
						</Col>
					</Row>
					<br />

					<Alert show={show} variant="success">
						<Alert.Heading>Congratulations!</Alert.Heading>
						<p>
							Your order has been placed! Stay hungry, our
							delivery executive will be assigned shortly.
						</p>
						<hr />
						<div className="d-flex justify-content-end">
							<Button
								variant="primary"
								style={{
									background: "black",
									border: "black",
								}}
							>
								<Link to="dashboard" className="submit-button">
									Go to dashboard
								</Link>
							</Button>
						</div>
					</Alert>

					{!show && (
						<Button
							onClick={finalizedOrder}
							className="mb-3"
							style={{
								background: "black",
								border: "black",
							}}
						>
							Order
						</Button>
					)}
				</Col>
			</Row>
		</Container>
	);
};
