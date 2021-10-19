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
	Navbar,
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
	const [vegan, setVegan] = useState(false);
	const [veg, setVeg] = useState(false);
	const [nonVeg, setNonVeg] = useState(false);
	const [mobileNumber, setMobileNumber] = useState("");
	const [street, setStreet] = useState("");
	const [apt, setApt] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [restaurantImgLocation, setRestaurantImgLocation] = useState("");
	const [opensAt, setOpensAt] = useState("");
	const [closesAt, setClosesAt] = useState("");
	const [pickupOption, setPickupOption] = useState(false);
	const [addressId, setAddressId] = useState("");

	const componentIsMounted = useRef(true);
	const restaurantId = cookie.load("restaurantId");

	const fetchRestaurantProfile = async () => {
		console.log("About to fetch meta => ", restaurantId);
		try {
			const metaResponse = await Axios.get(
				`http://${awsServer}/fetchRestaurantMeta/${restaurantId}`
			);

			const meta = metaResponse.data[0];

			setName(meta.NAME);
			setEmail(meta.EMAIL_ID);
			setDescription(meta.DESCRIPTION);
			setCuisine(meta.CUISINE);
			setMobileNumber(meta.CONTACT_NUMBER);
			setRestaurantImgLocation(meta.RESTAURANT_IMAGE_URL);
			setOpensAt(meta.OPENS_AT);
			setClosesAt(meta.CLOSES_AT);
			setPickupOption(meta.PICKUP_OPTION);
			setVeg(meta.VEG);
			setNonVeg(meta.NON_VEG);
			setVegan(meta.VEGAN);

			console.log(meta);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchRestaurantAddress = async () => {
		console.log("About to fetch address => ", restaurantId);
		try {
			const addr = await Axios.get(
				`http://${awsServer}/fetchRestaurantAddress/${restaurantId}`
			);
			const addrMeta = addr.data[0];
			setStreet(addrMeta.STREET);
			setApt(addrMeta.HOUSE_NUMBER);
			setCity(addrMeta.CITY);
			setState(addrMeta.STATE);
			setZipcode(addrMeta.PINCODE);
			setAddressId(addrMeta.ID);
			console.log(addr.data);
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

	useEffect(() => {
		fetchRestaurantAddress();
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

		let pickupOptionStatus;
		let vegStatus;
		let nonVegStatus;
		let veganStatus;

		pickupOption === "on"
			? (pickupOptionStatus = true)
			: (pickupOptionStatus = false);

		veg === "on" ? (vegStatus = true) : (vegStatus = false);

		nonVeg === "on" ? (nonVegStatus = true) : (nonVegStatus = false);

		vegan === "on" ? (veganStatus = true) : (veganStatus = false);

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
			pickupOption: pickupOptionStatus,
			veg: vegStatus,
			nonVeg: nonVegStatus,
			vegan: veganStatus,
			restaurantImageUrl: restaurantImgLocation,
			restaurantId: parseInt(restaurantId),
		};

		console.log("Created payload => ", JSON.stringify(payload));

		try {
			const response = await Axios.post(
				`http://${awsServer}/updateRestaurant`,
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
							<FormLabel>Apartment: </FormLabel>
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

						<FormGroup className="mt-3 mb-3">
							<Row>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select to allow pick-ups."
										onChange={(e) =>
											setPickupOption(e.target.value)
										}
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select for Veg."
										onChange={(e) => setVeg(e.target.value)}
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select for Non-veg."
										onChange={(e) =>
											setNonVeg(e.target.value)
										}
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select for Vegan."
										onChange={(e) =>
											setVegan(e.target.value)
										}
									/>
								</Col>
							</Row>
						</FormGroup>

						<FormGroup>
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
