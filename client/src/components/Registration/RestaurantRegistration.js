import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {
	Container,
	Row,
	Col,
	Form,
	FormLabel,
	FormControl,
	FormGroup,
	Button,
	Navbar,
} from "react-bootstrap";
import Axios from "axios";
import { uploadFile } from "react-s3";
import "./Registration.component.css";
import { config } from "../../config/awsConfig";
import { awsServer } from "../../config/awsIP";

export const RestaurantRegistration = (props) => {
	const history = useHistory();

	const [name, setName] = useState("");
	const [emailId, setEmail] = useState("");
	const [password, setPassword] = useState("");
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

	const createAccount = async (e) => {
		e.preventDefault();

		let pickupOptionStatus;
		let vegStatus;
		let nonVegStatus;
		let veganStatus;

		await pushRestaurantImgToAWS(e);

		pickupOption === "on"
			? (pickupOptionStatus = true)
			: (pickupOptionStatus = false);

		veg === "on" ? (vegStatus = true) : (vegStatus = false);

		nonVeg === "on" ? (nonVegStatus = true) : (nonVegStatus = false);

		vegan === "on" ? (veganStatus = true) : (veganStatus = false);

		const payload = {
			name: name,
			emailId: emailId,
			password: password,
			description: description,
			cuisine: cuisine,
			mobileNumber: String(mobileNumber),
			street: street,
			apt: apt,
			city: city,
			state: state,
			zipcode: zipcode,
			country: "United States",
			opensAt: opensAt,
			closesAt: closesAt,
			pickupOption: pickupOptionStatus,
			vegStatus: vegStatus,
			nonVegStatus: nonVegStatus,
			veganStatus: veganStatus,
			restaurantImageUrl: restaurantImgLocation,
		};

		console.log("Created payload => ", JSON.stringify(payload));

		try {
			const response = await Axios.post(
				`http://${awsServer}/createRestaurant`,
				payload
			);
			console.log(
				"Successfully registered => ",
				JSON.stringify(response.data)
			);

			history.push("/restaurantSignin");
		} catch (err) {
			console.error("Error when registering new restaurant => ", err);
		}
	};

	return (
		<Container fluid>
			<Navbar bg="light">
				<Container>
					<Navbar.Brand href="/welcome">
						<img
							src="https://uber-eats-webapp-clone.s3.us-west-1.amazonaws.com/logo.svg"
							width="150"
							height="50"
							className="d-inline-block align-top"
							alt="UberEats logo"
						/>
					</Navbar.Brand>
				</Container>
			</Navbar>
			<Row
				style={{
					paddingLeft: "50px",
					paddingRight: "50px",
				}}
			>
				<Col>
					<h1 className="text">Register your Restaurant</h1>
				</Col>
			</Row>
			<Row
				style={{
					paddingLeft: "50px",
					paddingRight: "500px",
				}}
			>
				<Col>
					<Form onSubmit={createAccount} className="p2">
						<FormGroup className="mt-3">
							<FormLabel>Restaurant Name:</FormLabel>
							<FormControl
								type="text"
								name="name"
								onChange={(e) => {
									setName(e.target.value);
								}}
								placeholder="eg. Nick the Greek"
								required
							/>
						</FormGroup>
						<Row>
							<Col>
								<FormGroup className="mt-3">
									<FormLabel>Email ID: </FormLabel>
									<FormControl
										type="email"
										name="emailId"
										onChange={(e) => {
											setEmail(e.target.value);
										}}
										required
									/>
								</FormGroup>
							</Col>
							<Col>
								<FormGroup className="mt-3">
									<FormLabel>Password:</FormLabel>
									<FormControl
										type="password"
										name="password"
										onChange={(e) => {
											setPassword(e.target.value);
										}}
										required
									/>
								</FormGroup>
							</Col>
						</Row>

						<FormGroup className="mt-3">
							<FormLabel>Description:</FormLabel>
							<FormControl
								name="description"
								as="textarea"
								rows={3}
								onChange={(e) => {
									setDescription(e.target.value);
								}}
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
								placeholder="eg. Doe"
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Contact Number:</FormLabel>
							<FormControl
								type="tel"
								name="mobileNumber"
								onChange={(e) => {
									setMobileNumber(e.target.value);
								}}
								placeholder="eg. (XXX)-(XXX)-(XXXX)"
								required
							/>
						</FormGroup>

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
										placeholder="eg. California"
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
										onChange={(e) => {
											setOpensAt(e.target.value);
										}}
										placeholder="eg. 10:00 AM"
										required
									/>
								</Col>
								<Col>
									<FormLabel>Closes at: </FormLabel>
									<FormControl
										type="time"
										name="closesAt"
										onChange={(e) => {
											setClosesAt(e.target.value);
										}}
										placeholder="eg. 21:00 PM"
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
										label="Offer pick-ups."
										onChange={(e) =>
											setPickupOption(e.target.value)
										}
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Offer delivery."
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select Veg."
										onChange={(e) => setVeg(e.target.value)}
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select Non-veg."
										onChange={(e) =>
											setNonVeg(e.target.value)
										}
									/>
								</Col>
								<Col>
									<Form.Switch
										type="switch"
										id="form-switch"
										label="Select Vegan."
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

						<FormGroup className="mt-3">
							<Row>
								<Col>
									<Button
										variant="primary"
										type="submit"
										style={{
											border: "black",
											backgroundColor: "black",
										}}
									>
										Submit
									</Button>
								</Col>
								<Col>
									<Button
										variant="primary"
										style={{
											border: "black",
											backgroundColor: "black",
										}}
										className="mb-3"
									>
										<Link
											to="restaurantSignin"
											className="submit-button"
										>
											Go to login
										</Link>
									</Button>
								</Col>
							</Row>
						</FormGroup>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
