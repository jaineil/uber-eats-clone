import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
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
import Axios from "axios";
import "../Registration/Registration.component.css";
import { awsServer } from "../../config/awsIP";

export const RestaurantLogin = (props) => {
	const history = useHistory();
	console.log(history);
	//console.log(JSON.stringify(props));

	const [emailId, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");

	const loginToAccount = async (e) => {
		e.preventDefault();
		Axios.defaults.withCredentials = true;

		const payload = {
			emailId: emailId,
			password: password,
		};

		console.log("Created payload! => ", JSON.stringify(payload));
		try {
			const response = await Axios.get(
				`http://${awsServer}/validate-restaurant`,
				{
					params: {
						emailId: emailId,
						password: password,
					},
				}
			);
			console.log(response);
			console.log("Successfully login");
			console.log(cookie.load("restaurantId"));
			history.push("/restaurantDashboard");
		} catch (err) {
			console.error(
				"Error when logging in the restaurant owner => ",
				err
			);
			setMessage("Invalid credentials!");
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
			<Row>
				<Col>
					<h1 className="text">Login to UberEats for Restaurant</h1>
					<h4>{message}</h4>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form onSubmit={(e) => loginToAccount(e)}>
						<FormGroup className="mb-3">
							<FormLabel className="labels">Email ID: </FormLabel>
							<FormControl
								type="email"
								name="emailId"
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mb-3">
							<FormLabel className="labels">Password: </FormLabel>
							<FormControl
								type="password"
								name="password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mb-3">
							<Row>
								<Col>
									<Button
										variant="primary"
										type="submit"
										style={{
											color: "white",
											backgroundColor: "black",
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
											color: "white",
											backgroundColor: "black",
											border: "black",
										}}
									>
										<Link
											to="restaurantSignup"
											className="submit-button"
										>
											New user?
											<br />
											Go to sign up
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
