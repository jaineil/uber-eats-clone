import { Container, Navbar, Row, Col, Card, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import cookie from "react-cookies";
import "./RestaurantDashboard.css";
import RestNavbar from "../Navbar/RestNavbar";

export const RestaurantDashboard = (props) => {
	const history = useHistory();

	if (!cookie.load("restaurantId")) {
		console.log("No user cookie!");
		history.push("/restaurantSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const handleClick = (path) => {
		history.push(path);
	};

	return (
		<Container
			fluid
			style={{
				backgroundImage: `url("https://uber-eats-webapp-clone.s3.us-west-1.amazonaws.com/stock-rest-dashboard.jpeg")`,
				height: "100vh",
			}}
		>
			<RestNavbar />
			<Row>
				<Col>
					<Card
						style={{
							width: "24rem",
							height: "12rem",
							backgroundColor: "black",
							opacity: "0.75",
						}}
						className="card"
					>
						<Card.Body>
							<Card.Title
								style={{
									color: "white",
									textAlign: "center",
								}}
							>
								<h5>Your Profile</h5>
							</Card.Title>
							<Card.Text
								style={{ color: "white", textAlign: "center" }}
							>
								Edit your restaurant's information.
							</Card.Text>
							<Button
								variant="primary"
								onClick={() =>
									handleClick("/restaurantProfile")
								}
								className="btn"
							>
								View Profile.
							</Button>
						</Card.Body>
					</Card>
				</Col>

				<Col>
					<Card
						style={{
							width: "24rem",
							height: "12rem",
							backgroundColor: "black",
							opacity: "0.75",
						}}
						className="card"
					>
						<Card.Body>
							<Card.Title
								style={{ color: "white", textAlign: "center" }}
							>
								<h5>View Menu</h5>
							</Card.Title>
							<Card.Text
								style={{ color: "white", textAlign: "center" }}
							>
								Edit your restaurant's menu.
							</Card.Text>
							<Button
								variant="primary"
								onClick={() => handleClick("/restaurantMenu")}
								className="btn"
							>
								View Menu.
							</Button>
						</Card.Body>
					</Card>
				</Col>

				<Col>
					<Card
						style={{
							width: "24rem",
							height: "12rem",
							backgroundColor: "black",
							opacity: "0.75",
						}}
						className="card"
					>
						<Card.Body>
							<Card.Title
								style={{ color: "white", textAlign: "center" }}
							>
								<h5>View Orders</h5>
							</Card.Title>
							<Card.Text
								style={{ color: "white", textAlign: "center" }}
							>
								View your restaurant's information.
							</Card.Text>
							<Button
								variant="primary"
								onClick={() => handleClick("/orders")}
								className="btn"
							>
								View Orders.
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	);
};
