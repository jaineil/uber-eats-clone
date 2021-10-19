import React, { useState } from "react";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	FormLabel,
	FormControl,
	FormGroup,
	Navbar,
} from "react-bootstrap";
import { useHistory } from "react-router";
import Axios from "axios";
import { Link } from "react-router-dom";
import "./Registration.component.css";
import { awsServer } from "../../config/awsIP";

export const CustomerRegistration = (props) => {
	const history = useHistory();

	const [username, setUserName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("mm-dd-yyyy");
	const [mobileNumber, setMobileNumber] = useState("");
	const [street, setStreet] = useState("");
	const [apt, setApt] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [emailId, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const createAccount = async (e) => {
		e.preventDefault();

		const payload = {
			username: username,
			firstName: firstName,
			lastName: lastName,
			dateOfBirth: new Date(dateOfBirth).toISOString(),
			mobileNumber: String(mobileNumber),
			street: street,
			apt: apt,
			city: city,
			state: state,
			zipcode: zipcode,
			country: "United States",
			emailId: emailId,
			password: password,
		};
		console.log("Created payload!");
		try {
			await Axios.post(`http://${awsServer}/createCustomer`, payload);
			console.log("Successfully registered");
			history.push("/customerSignin");
		} catch (err) {
			console.error("Error when registering new customer => ", err);
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
					<h1 className="text">Customer Registration</h1>
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
							<FormLabel>Username: </FormLabel>
							<FormControl
								//className="registration-form"
								type="text"
								name="username"
								onChange={(e) => {
									setUserName(e.target.value);
								}}
								placeholder="eg. johndoe"
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>First Name: </FormLabel>
							<FormControl
								type="text"
								name="firstName"
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								placeholder="eg. John"
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Last Name: </FormLabel>
							<FormControl
								type="text"
								name="lastName"
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								placeholder="eg. Doe"
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Date of Birth: </FormLabel>
							<FormControl
								type="date"
								name="dateOfBirth"
								onChange={(e) => {
									setDateOfBirth(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Mobile Number: </FormLabel>
							<FormControl
								type="tel"
								name="mobileNumber"
								onChange={(e) => {
									setMobileNumber(e.target.value);
								}}
								placeholder="XXX-XXX-XXXX"
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
										placeholder="eg. California"
										onChange={(e) => {
											setZipcode(e.target.value);
										}}
									/>
								</FormGroup>
							</Col>
						</Row>

						<FormGroup className="mt-3">
							<FormLabel>Email ID: </FormLabel>
							<FormControl
								type="email"
								name="emailId"
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								placeholder="XXX-XXX-XXXX"
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Password: </FormLabel>
							<FormControl
								type="password"
								name="password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3 mb-3">
							<Row>
								<Col>
									<Button
										variant="primary"
										type="submit"
										style={{
											background: "black",
											border: "black",
										}}
									>
										Submit
									</Button>
								</Col>
								<Col>
									<Button
										variant="primary"
										style={{
											background: "black",
											border: "black",
										}}
									>
										<Link
											to="customerSignin"
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
