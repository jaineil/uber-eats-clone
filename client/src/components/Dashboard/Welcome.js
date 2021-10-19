import { Container, Navbar, Row, Col, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import "./Welcome.css";

export const Welcome = () => {
	const history = useHistory();

	const handleClick = (path) => {
		history.push(path);
	};

	return (
		<Container fluid>
			<Row>
				<Navbar bg="light">
					<Container>
						<Navbar.Brand href="#home">
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

				<Col
					md={6}
					style={{
						backgroundImage: `url("https://uber-eats-webapp-clone.s3.us-west-1.amazonaws.com/customer-theme.svg")`,
						backgroundRepeat: "no-repeat",
					}}
				>
					<Card
						style={{
							width: "24rem",
							height: "12rem",
							backgroundColor: "black",
						}}
						className="wel-card"
					>
						<Card.Body>
							<Card.Title
								style={{ color: "white", textAlign: "center" }}
							>
								Order
							</Card.Title>
							<Card.Text
								style={{ color: "white", textAlign: "center" }}
							>
								Order breakfast, lunch and dinner.
							</Card.Text>

							<Button
								variant="primary"
								onClick={() => handleClick("/customerSignup")}
								className="wel-btn"
							>
								New customer?
								<br />
								Go to sign up.
							</Button>
						</Card.Body>
					</Card>
				</Col>

				<Col
					md={6}
					style={{
						backgroundImage: `url("https://uber-eats-webapp-clone.s3.us-west-1.amazonaws.com/restaurant-theme.svg")`,
						backgroundRepeat: "no-repeat",
						height: "100vh",
					}}
				>
					<Card
						style={{
							width: "24rem",
							height: "12rem",
							backgroundColor: "black",
						}}
						className="wel-card"
					>
						<Card.Body>
							<Card.Title
								style={{ color: "white", textAlign: "center" }}
							>
								Deliver
							</Card.Title>
							<Card.Text
								style={{ color: "white", textAlign: "center" }}
							>
								Deliver breakfast, lunch and dinner.
							</Card.Text>

							<Button
								variant="primary"
								onClick={() => handleClick("/restaurantSignup")}
								className="wel-btn"
							>
								New restaurant?
								<br />
								Go to sign up.
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
