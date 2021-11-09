import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import {
	Container,
	Carousel,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
	Row,
	Col,
	Button,
} from "react-bootstrap";
import cookie from "react-cookies";
import Axios from "axios";
import { uploadFile } from "react-s3";
import "../Registration/Registration.component.css";
import { config } from "../../config/awsConfig";
import RestNavbar from "../Navbar/RestNavbar";
import { awsServer } from "../../config/awsIP";

export const RestaurantProfile = (props) => {
	const history = useHistory();
	if (!cookie.load("restaurantId")) {
		console.log("No user cookie!");
		history.push("/restaurantSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const [name, setName] = useState("");
	const [emailId, setEmail] = useState("");
	const [description, setDescription] = useState("");
	const [cuisine, setCuisine] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [street, setStreet] = useState("");
	const [apt, setApt] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [restaurantImgLocation, setRestaurantImgLocation] = useState("");
	const [opensAt, setOpensAt] = useState("");
	const [closesAt, setClosesAt] = useState("");
	const [addressId, setAddressId] = useState("");

	const componentIsMounted = useRef(true);
	const restaurantId = cookie.load("restaurantId");

	const fetchRestaurantProfile = async () => {
		console.log("About to fetch meta => ", restaurantId);
		try {
			const metaResponse = await Axios.get(
				`http://${awsServer}/fetch-restaurant/${restaurantId}`
			);

			const meta = metaResponse.data;

			setName(meta.name);
			setEmail(meta.emailId);
			setDescription(meta.description);
			setCuisine(meta.cuisine);
			setMobileNumber(meta.contactNumber);
			setRestaurantImgLocation(meta.profileImgUrl);
			setOpensAt(meta.opensAt);
			setClosesAt(meta.closesAt);
			setStreet(meta.street);
			setApt(meta.shopNo);
			setCity(meta.city);
			setState(meta.state);
			setZipcode(meta.zipcode);
			setAddressId(meta._id);

			console.log(meta);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	useEffect(() => {
		fetchRestaurantProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const pushRestaurantImgToAWS = async (e) => {
		try {
			const res = await uploadFile(e.target.files[0], config);
			console.log("Uploaded on AWS S3 => ", JSON.stringify(res));
			setRestaurantImgLocation(res.location);
			return;
		} catch (err) {
			console.error(
				"Failed when uploading bg image for restaurant => ",
				err
			);
		}
	};

	const updateAccount = async (e) => {
		e.preventDefault();

		const payload = {
			name: name,
			emailId: emailId,
			description: description,
			cuisine: cuisine,
			mobileNumber: String(mobileNumber),
			street: street,
			apt: apt,
			city: city,
			state: state,
			zipcode: zipcode,
			country: "United States",
			addressId: addressId,
			opensAt: opensAt,
			closesAt: closesAt,
			restaurantImageUrl: restaurantImgLocation,
			restaurantId: restaurantId,
		};

		console.log("Created payload => ", JSON.stringify(payload));

		try {
			const response = await Axios.post(
				`http://${awsServer}/update-restaurant-details`,
				payload
			);

			console.log(
				"Successfully registered => ",
				JSON.stringify(response.data)
			);

			fetchRestaurantProfile();
		} catch (err) {
			console.error("Error when registering new restaurant => ", err);
		}
	};

	return (
		<Container fluid style={{ background: "whitesmoke", height: "300vh" }}>
			<RestNavbar />
			<Carousel>
				<Carousel.Item>
					<img
						className="d-block w-100"
						src={restaurantImgLocation}
						alt="First slide"
					/>
				</Carousel.Item>
			</Carousel>

			<Row
				style={{
					paddingLeft: "50px",
					paddingRight: "50px",
				}}
			>
				<Col>
					<h3 className="text mt-3">
						Update your Restaurant Information
					</h3>
				</Col>
			</Row>
			<Row
				style={{
					paddingLeft: "50px",
					paddingRight: "500px",
				}}
			>
				<Col>
					<Form onSubmit={updateAccount} className="p2">
						<FormGroup className="mt-3">
							<FormLabel>Restaurant Name:</FormLabel>
							<FormControl
								type="text"
								name="name"
								onChange={(e) => {
									setName(e.target.value);
								}}
								defaultValue={name}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Email ID: </FormLabel>
							<FormControl
								type="email"
								name="emailId"
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								defaultValue={emailId}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Description:</FormLabel>
							<FormControl
								name="description"
								as="textarea"
								rows={3}
								onChange={(e) => {
									setDescription(e.target.value);
								}}
								defaultValue={description}
								placeholder="Write your description here"
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Cuisine: </FormLabel>
							<FormControl
								type="text"
								name="cuisine"
								onChange={(e) => {
									setCuisine(e.target.value);
								}}
								defaultValue={cuisine}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Contact Number:</FormLabel>
							<FormControl
								type="tel"
								name="mobileNumber"
								defaultValue={mobileNumber}
								onChange={(e) => {
									setMobileNumber(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Street: </FormLabel>
							<FormControl
								type="text"
								defaultValue={street}
								onChange={(e) => {
									setStreet(e.target.value);
								}}
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Shop no: </FormLabel>
							<FormControl
								type="text"
								defaultValue={apt}
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
										defaultValue={city}
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
										defaultValue={state}
										onChange={(e) => {
											setState(e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup className="mt-3">
									<FormLabel>Zipcode: </FormLabel>
									<FormControl
										type="text"
										defaultValue={zipcode}
										onChange={(e) => {
											setZipcode(e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
						</Row>

						<FormGroup className="mt-3">
							<Row>
								<Col>
									<FormLabel>Opens at: </FormLabel>
									<FormControl
										type="time"
										name="opensAt"
										defaultValue={opensAt}
										onChange={(e) => {
											setOpensAt(e.target.value);
										}}
										required
									/>
								</Col>
								<Col>
									<FormLabel>Closes at: </FormLabel>
									<FormControl
										type="time"
										name="closesAt"
										defaultValue={closesAt}
										onChange={(e) => {
											setClosesAt(e.target.value);
										}}
										required
									/>
								</Col>
							</Row>
						</FormGroup>

						<FormGroup className="mt-3">
							<Form.Label>Add restaurant image:</Form.Label>
							<Form.Control
								type="file"
								onChange={pushRestaurantImgToAWS}
							/>
						</FormGroup>

						<Button
							variant="dark"
							type="submit"
							style={{ color: "white", marginLeft: "650px" }}
							size="lg"
						>
							Save new details.
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
