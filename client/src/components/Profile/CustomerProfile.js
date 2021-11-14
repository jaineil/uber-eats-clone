import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import {
	Container,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
	Row,
	Col,
	Button,
	Image,
} from "react-bootstrap";
import cookie from "react-cookies";
import Axios from "axios";
import { uploadFile } from "react-s3";
import "../Registration/Registration.component.css";
import { config } from "../../config/awsConfig";
import RestNavbar from "../Navbar/CustNavbar";
import { awsServer } from "../../config/awsIP";

export const CustomerProfile = (props) => {
	const history = useHistory();
	if (!cookie.load("customerId")) {
		console.log("No user cookie!");
		history.push("/customerSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [emailId, setEmail] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [street, setStreet] = useState("");
	const [apt, setApt] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [customerImgLocation, setCustomerImgLocation] = useState("");

	const componentIsMounted = useRef(true);
	const customerId = cookie.load("customerId");

	const fetchCustomerProfile = async () => {
		console.log("About to fetch meta => ", customerId);
		try {
			const metaResponse = await Axios.get(
				`http://${awsServer}/fetch-customer/${customerId}`
			);

			const meta = metaResponse.data;

			setFirstName(meta.firstName);
			setLastName(meta.lastName);
			setEmail(meta.emailId);
			setMobileNumber(meta.contactNumber);
			setCustomerImgLocation(meta.profileImgUrl);
			setStreet(meta.addresses[0].street);
			setApt(meta.addresses[0].apt);
			setCity(meta.addresses[0].city);
			setState(meta.addresses[0].state);
			setZipcode(meta.addresses[0].zipcode);
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
		fetchCustomerProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const pushRestaurantImgToAWS = async (e) => {
		try {
			const res = await uploadFile(e.target.files[0], config);
			console.log("Uploaded on AWS S3 => ", JSON.stringify(res));
			setCustomerImgLocation(res.location);
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
			firstName: firstName,
			lastName: lastName,
			emailId: emailId,
			mobileNumber: String(mobileNumber),
			street: street,
			apt: apt,
			city: city,
			state: state,
			zipcode: zipcode,
			customerImgUrl: customerImgLocation,
			customerId: customerId,
		};

		console.log("Created payload => ", JSON.stringify(payload));

		try {
			const response = await Axios.post(
				`http://${awsServer}/update-customer`,
				payload
			);

			console.log(
				"Successfully registered => ",
				JSON.stringify(response.data)
			);

			fetchCustomerProfile();
		} catch (err) {
			console.error("Error when registering new restaurant => ", err);
		}
	};

	return (
		<Container fluid style={{ background: "whitesmoke", height: "300vh" }}>
			<RestNavbar />
			<Row
				style={{
					paddingLeft: "50px",
					paddingRight: "50px",
				}}
			>
				<Col>
					<h3 className="text mt-3">
						Update your information, {firstName}
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
					<Image
						className="mx-auto d-block"
						xs={6}
						md={4}
						src="https://decider.com/wp-content/uploads/2021/03/rick-and-morty-s5-5.jpg?quality=80&strip=all/171x180"
						rounded
						style={{ backgroundColor: "black" }}
					/>
				</Col>
				<Col>
					<Form onSubmit={updateAccount} className="p2">
						<FormGroup className="mt-3">
							<FormLabel>First name:</FormLabel>
							<FormControl
								type="text"
								name="name"
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								defaultValue={firstName}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Last name:</FormLabel>
							<FormControl
								type="text"
								name="name"
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								defaultValue={lastName}
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
							<FormLabel>Apt no: </FormLabel>
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
							<Form.Label>Add new profile image:</Form.Label>
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
