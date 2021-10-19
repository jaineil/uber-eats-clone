import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Form, Button, Navbar } from "react-bootstrap";
import cookie from "react-cookies";

const CustNavbar = (props) => {
	const history = useHistory();

	if (!cookie.load("customerId")) {
		console.log("No user cookie!");
		history.push("/customerSignin");
	} else {
		console.log("All good on the cookie front!");
	}
	const logoutHandler = () => {
		cookie.remove("customerId");
	};

	return (
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
			<Form inline className="mx-3">
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
			</Form>
		</Navbar>
	);
};

export default CustNavbar;
