import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router";
import cookie from "react-cookies";
import {
	Container,
	Navbar,
	Nav,
	Form,
	FormControl,
	Row,
	Col,
	Button,
	ButtonGroup,
	Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CustomerDashboard.css";
import Axios from "axios";
import { awsServer } from "../../config/awsIP";

export const CustomerDashboard = (props) => {
	const customerId = cookie.load("customerId");
	const profileLink = `/profile/${customerId}`;
	const favoritesLink = `/favorites/${customerId}`;
	const pastOrdersLink = `/viewOrders/${customerId}`;
	const history = useHistory();

	if (!cookie.load("customerId")) {
		console.log("No user cookie!");
		history.push("/customerSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const [restaurants, setRestaurants] = useState([]);
	const [displayRestaurants, setDisplayRestaurants] = useState([]);
	const [searchedRestaurants, setSearchedRestaurants] = useState([]);
	const [location, setLocation] = useState();

	const [searchInput, setSearchInput] = useState("");

	const [vegState, setVegState] = useState(false);
	const [nonVegState, setNonVegState] = useState(false);
	const [veganState, setVeganState] = useState(false);
	const [pickupState, setPickupState] = useState(false);
	const [deliveryState, setDeliveryState] = useState(false);

	const componentIsMounted = useRef(true);

	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	const fetchRestaurants = async () => {
		console.log("About to fetch restaurants");
		try {
			const response = await Axios.get(
				`http://${awsServer}/fetchRestaurants/${customerId}`
			);
			setRestaurants(response.data);
			setDisplayRestaurants(response.data);
			setSearchedRestaurants(response.data);
			restaurants.map((item) => console.log(JSON.stringify(item)));
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchRestaurants();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchCustomerLocation = async () => {
		console.log("About to fetch customer location");
		try {
			const response = await Axios.get(
				`http://${awsServer}/fetchCustomerLocation/${customerId}`
			);
			setLocation(response.data[0].CITY);
		} catch (err) {
			console.log(err);
			console.log("Could not fetch customer location");
		}
	};

	useEffect(() => {
		fetchCustomerLocation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filteringHandler = (filters) => {
		let temp = [];
		console.log("incoming filters => ", filters);
		searchedRestaurants.map((r) => console.log(JSON.stringify(r)));
		if (
			filters.veg === true ||
			filters.nonVeg === true ||
			filters.vegan === true ||
			filters.pickupState === true ||
			filters.deliveryState === true
		) {
			for (const r of searchedRestaurants) {
				if (
					(r.VEG && filters.veg) ||
					(r.NON_VEG && filters.nonVeg) ||
					(r.VEGAN && filters.vegan) ||
					(r.PICKUP_OPTION && filters.pickupState) ||
					(r.DELIVERY_OPTION && filters.deliveryState)
				) {
					console.log("Pushing ", r.NAME);
					temp.push(r);
					setDisplayRestaurants(temp);
				}
			}
		} else {
			temp = restaurants;
			setDisplayRestaurants(temp);
			window.location.reload(false);
		}
	};

	const vegSelectHandler = async () => {
		const temp = document.getElementById("veg");
		let payload = {
			veg: vegState,
			nonVeg: nonVegState,
			vegan: veganState,
			pickupState: pickupState,
			deliveryState: deliveryState,
		};
		if (temp.style.backgroundColor === "white") {
			temp.style.backgroundColor = "black";
			temp.style.color = "white";
			temp.style.border = "black";
			setVegState(true);
			payload = { ...payload, veg: !vegState };
			console.log(payload);
			filteringHandler(payload);
			console.log("Added veg filter");
		} else {
			temp.style.backgroundColor = "white";
			temp.style.color = "black";
			temp.style.border = "black";
			setVegState(false);
			payload = { ...payload, veg: !vegState };
			console.log(payload);
			filteringHandler(payload);
			console.log("Remove veg filter");
		}
	};

	const nonVegSelectHandler = (e) => {
		const temp = document.getElementById("nonVeg");
		let payload = {
			veg: vegState,
			nonVeg: nonVegState,
			vegan: veganState,
			pickupState: pickupState,
			deliveryState: deliveryState,
		};
		if (temp.style.backgroundColor === "white") {
			temp.style.backgroundColor = "black";
			temp.style.color = "white";
			temp.style.border = "black";
			setNonVegState(true);
			payload = { ...payload, nonVeg: !nonVegState };
			console.log(payload);
			filteringHandler(payload);
			console.log("Add nonVeg filter");
		} else {
			temp.style.backgroundColor = "white";
			temp.style.color = "black";
			temp.style.border = "black";
			setNonVegState(false);
			payload = { ...payload, nonVeg: !nonVegState };
			console.log(payload);
			filteringHandler(payload);
			console.log("Remove nonVeg filter");
		}
	};

	const veganSelectHandler = (e) => {
		const temp = document.getElementById("vegan");
		let payload = {
			veg: vegState,
			nonVeg: nonVegState,
			vegan: veganState,
			pickupState: pickupState,
			deliveryState: deliveryState,
		};
		if (temp.style.backgroundColor === "white") {
			temp.style.backgroundColor = "black";
			temp.style.color = "white";
			temp.style.border = "black";
			setVeganState(true);
			payload = { ...payload, vegan: !veganState };
			console.log(payload);
			filteringHandler(payload);
			console.log("Add vegan filter");
		} else {
			temp.style.backgroundColor = "white";
			temp.style.color = "black";
			temp.style.border = "black";
			setVeganState(false);
			payload = { ...payload, vegan: !veganState };
			console.log(payload);
			filteringHandler(payload);
			console.log("Remove vegan filter");
		}
	};

	const pickupSelectHandler = (e) => {
		const pickupBtn = document.getElementById("pickup");
		let payload = {
			veg: vegState,
			nonVeg: nonVegState,
			vegan: veganState,
			pickupState: pickupState,
			deliveryState: deliveryState,
		};

		if (pickupBtn.style.backgroundColor === "white") {
			pickupBtn.style.backgroundColor = "black";
			pickupBtn.style.color = "white";
			pickupBtn.style.border = "black";
			document.getElementById("delivery").disabled = true;
			payload = { ...payload, pickupState: !pickupState };
			setPickupState(true);
			console.log(payload);
			filteringHandler(payload);
			console.log("Add pickup filter");
		} else {
			pickupBtn.style.backgroundColor = "white";
			pickupBtn.style.color = "black";
			pickupBtn.style.border = "black";
			document.getElementById("delivery").disabled = false;
			setPickupState(false);
			console.log(payload);
			filteringHandler({ ...payload, pickupState: !pickupState });
			console.log("Remove pickup filter");
		}
	};

	const deliverySelectHandler = (e) => {
		const deliveryBtn = document.getElementById("delivery");
		let payload = {
			veg: vegState,
			nonVeg: nonVegState,
			vegan: veganState,
			pickupState: pickupState,
			deliveryState: deliveryState,
		};

		if (deliveryBtn.style.backgroundColor === "white") {
			deliveryBtn.style.backgroundColor = "black";
			deliveryBtn.style.color = "white";
			deliveryBtn.style.border = "black";
			document.getElementById("pickup").disabled = true;
			payload = { ...payload, deliveryState: !deliveryState };
			setDeliveryState(true);
			console.log(payload);
			filteringHandler(payload);
			console.log("Add delivery filter");
		} else {
			deliveryBtn.style.backgroundColor = "white";
			deliveryBtn.style.color = "black";
			deliveryBtn.style.border = "black";
			document.getElementById("pickup").disabled = false;
			setDeliveryState(false);
			console.log(payload);
			filteringHandler({ ...payload, deliveryState: !deliveryState });
			console.log("Remove delivery filter");
		}
	};

	const searchHandler = async (e) => {
		try {
			const res = await Axios.get("/search", {
				params: {
					searchString: searchInput,
				},
			});
			console.log(res.data);
			setSearchedRestaurants(res.data);
			setDisplayRestaurants(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const resetHandler = () => {
		fetchRestaurants();
		window.location.reload(false);
	};

	const logoutHandler = () => {
		cookie.remove("customerId");
	};

	const addToFavorite = (restaurantId) => async (e) => {
		const payload = {
			restaurantId: restaurantId,
			customerId: customerId,
		};
		console.log(JSON.stringify(payload));
		try {
			const res = await Axios.post(
				`http://${awsServer}/addFavorite`,
				payload
			);
			console.log("Successfully added to favorites ", res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const displayRestaurantsList = displayRestaurants.map((resto) => (
		<Col className="ml-3 mt-3" style={{ width: "55rem", height: "500px" }}>
			<Card style={{ width: "18rem", height: "30rem" }}>
				<Card.Img
					variant="top"
					style={{ height: "20vh" }}
					src={resto.RESTAURANT_IMAGE_URL}
				/>
				<Card.Body style={{ height: "10vh" }}>
					<Row>
						<Card.Title>
							<h5>{resto.NAME}</h5>
						</Card.Title>
					</Row>
					<Row>
						<Col>
							<Card.Text>
								<h6>Opens at: {resto.OPENS_AT} </h6>
							</Card.Text>
						</Col>
						<Col>
							<Card.Text>
								<h6>Closes at: {resto.CLOSES_AT}</h6>
							</Card.Text>
						</Col>
						<Card.Text>
							<h5>{resto.CITY}</h5>
						</Card.Text>
					</Row>
				</Card.Body>
				<Card.Footer style={{ height: "15vh" }}>
					<Row>
						<Col>
							<Link to={`/chooseDish/${resto.ID}`}>
								<Button
									variant="primary"
									size="sm"
									style={{
										backgroundColor: "black",
										border: "black",
									}}
								>
									View
								</Button>
							</Link>
						</Col>
						<Col>
							<Button
								variant="primary"
								size="sm"
								style={{
									backgroundColor: "black",
									border: "black",
								}}
								onClick={addToFavorite(resto.ID)}
							>
								Add to favorite
							</Button>
						</Col>
					</Row>
				</Card.Footer>
			</Card>
		</Col>
	));

	return (
		<Container
			fluid
			style={{ backgroundColor: "whitesmoke", height: "500vh" }}
		>
			<Navbar
				collapseOnSelect
				expand="sm"
				bg="light"
				variant="light"
				className="mb-3"
			>
				<Navbar.Brand as={Link} to="/dashboard">
					<img
						src="https://uber-eats-webapp-clone.s3.us-west-1.amazonaws.com/logo.svg"
						width="150"
						height="30"
						className="d-inline-block align-top"
						alt="UberEats logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav"></Navbar.Collapse>
				<Button
					style={{
						color: "white",
						backgroundColor: "black",
						border: "black",
					}}
				>
					Location | {location}
				</Button>
				<Form inline className="mx-3">
					<ButtonGroup>
						<Button
							variant="secondary"
							as={Link}
							to="/welcome"
							style={{
								color: "white",
								backgroundColor: "black",
								border: "black",
							}}
							onClick={logoutHandler}
						>
							Logout
						</Button>
					</ButtonGroup>
				</Form>
			</Navbar>

			<Form style={{ paddingLeft: "450px" }}>
				<Row>
					<Col className="mt-4" md={6}>
						<FormControl
							placeholder="Search here..."
							onChange={(e) => {
								setSearchInput(e.target.value);
							}}
						/>
					</Col>

					<Col>
						<Button
							onClick={searchHandler}
							className="mt-4"
							style={{
								marginRight: "10px",
								backgroundColor: "white",
								border: "black",
								color: "black",
							}}
						>
							Search
						</Button>
					</Col>
					<Col>
						<Button
							onClick={resetHandler}
							className="mt-4"
							style={{
								marginRight: "10px",
								backgroundColor: "white",
								border: "black",
								color: "black",
							}}
						>
							Reset
						</Button>
					</Col>
				</Row>
			</Form>

			<Nav className="flex-column">
				<Nav.Link href={profileLink} style={{ color: "black" }}>
					Profile
				</Nav.Link>
				<Nav.Link href={favoritesLink} style={{ color: "black" }}>
					Favorites
				</Nav.Link>
				<Nav.Link href={pastOrdersLink} style={{ color: "black" }}>
					Your orders
				</Nav.Link>
			</Nav>

			<Container
				style={{
					alignContent: "center",
					alignItems: "center",
					marginTop: "5rem",
					marginRight: "35vh",
					width: "50rem",
				}}
			>
				<ButtonGroup>
					<Button
						style={{
							marginRight: "10px",
							backgroundColor: "white",
							border: "black",
							color: "black",
						}}
						id="veg"
						onClick={vegSelectHandler}
					>
						Veg
					</Button>
					<Button
						style={{
							marginRight: "10px",
							backgroundColor: "white",
							border: "black",
							color: "black",
						}}
						id="nonVeg"
						onClick={nonVegSelectHandler}
					>
						Non-veg
					</Button>
					<Button
						style={{
							marginRight: "10px",
							backgroundColor: "white",
							border: "black",
							color: "black",
						}}
						id="vegan"
						onClick={veganSelectHandler}
					>
						Vegan
					</Button>

					<Button
						style={{
							marginRight: "10px",
							backgroundColor: "white",
							border: "black",
							color: "black",
						}}
						id="pickup"
						onClick={pickupSelectHandler}
					>
						Pick-up
					</Button>

					<Button
						style={{
							marginRight: "10px",
							backgroundColor: "white",
							border: "black",
							color: "black",
						}}
						id="delivery"
						onClick={deliverySelectHandler}
					>
						Delivery
					</Button>
				</ButtonGroup>
			</Container>

			<Container
				style={{
					width: "70rem",
					height: "200rem",
				}}
			>
				<Row>{displayRestaurantsList}</Row>
			</Container>
		</Container>
	);
};
