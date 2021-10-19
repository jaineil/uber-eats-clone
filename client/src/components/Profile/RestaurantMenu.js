import React, { useRef, useState, useEffect } from "react";
import {
	Container,
	Navbar,
	Card,
	Button,
	Row,
	Col,
	Modal,
	Form,
	InputGroup,
	FormControl,
	FormGroup,
} from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import Axios from "axios";
import { uploadFile } from "react-s3";
import { config } from "../../config/awsConfig";
import RestNavbar from "../Navbar/RestNavbar";
import { awsServer } from "../../config/awsIP";

export const RestaurantMenu = (props) => {
	const history = useHistory();
	if (!cookie.load("restaurantId")) {
		console.log("No user cookie!");
		history.push("/restaurantSignin");
	} else {
		console.log("All good on the cookie front!");
	}

	const [menuList, setMenuList] = useState([]);
	const [show, setShow] = useState(false);

	const [newDishName, setNewDishName] = useState("");
	const [newDishDescription, setNewDishDescription] = useState("");
	const [newDishPrice, setNewDishPrice] = useState(0);
	const [newDishCategory, setNewDishCategory] = useState("");
	const [newDishType, setNewDishType] = useState("");
	const [newDishIngredients, setNewDishIngredients] = useState("");
	const [newDishImageUrl, setNewDishImageUrl] = useState("");

	const restaurantId = cookie.load("restaurantId");

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleSave = async (e) => {
		e.preventDefault();
		handleClose();
		const payload = {
			restaurantId: restaurantId,
			name: newDishName,
			description: newDishDescription,
			price: parseInt(newDishPrice),
			category: newDishCategory,
			foodType: newDishType,
			ingredients: newDishIngredients,
			dishImgUrl: newDishImageUrl,
		};
		try {
			const response = await Axios.post(
				`http://${awsServer}/createDish`,
				payload
			);

			console.log(
				"Successfully added new dish => ",
				JSON.stringify(response.data)
			);

			fetchRestaurantDishes();
		} catch (err) {
			console.error(err);
		}
	};

	const selectDishCategory = (e) => {
		e.preventDefault();
		setNewDishCategory(e.target.value);
	};

	const selectDishType = (e) => {
		e.preventDefault();
		setNewDishType(e.target.value);
	};

	const componentIsMounted = useRef(true);
	useEffect(() => {
		// each useEffect can return a cleanup function
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	const fetchRestaurantDishes = async () => {
		console.log("About to fetch dishes for => ", restaurantId);
		try {
			const response = await Axios.get(
				`http://${awsServer}/fetchDishes/${restaurantId}`
			);
			setMenuList(response.data);
			console.log(
				menuList.map((item) => console.log(JSON.stringify(item)))
			);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchRestaurantDishes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const pushRestaurantImgToAWS = async (e) => {
		try {
			const res = await uploadFile(e.target.files[0], config);
			console.log("Uploaded on AWS S3 => ", JSON.stringify(res));
			setNewDishImageUrl(res.location);
			return;
		} catch (err) {
			console.error(
				"Failed when uploading bg image for restaurant => ",
				err
			);
		}
	};

	const menuItemsList = menuList.map((meal) => (
		<Col className="ml-3 mt-3" style={{ width: "55rem", height: "500px" }}>
			<Card style={{ width: "18rem", height: "30rem" }}>
				<Card.Img
					variant="top"
					style={{ height: "30vh" }}
					src={meal.ITEM_IMAGE_URL}
				/>
				<Card.Body style={{ height: "50vh" }}>
					<Row>
						<Card.Title>{meal.NAME}</Card.Title>
					</Row>
					<Row>
						<Card.Text>{meal.DESCRIPTION}</Card.Text>
					</Row>
				</Card.Body>
				<Card.Footer>
					<Col>
						<Card.Text>Cost: ${meal.PRICE}</Card.Text>
					</Col>
					<Col>
						<Link to={`/dishes/edit/${meal.ID}`}>
							<Button
								variant="primary"
								size="sm"
								style={{
									backgroundColor: "black",
									border: "black",
								}}
							>
								Edit
							</Button>
						</Link>
					</Col>
				</Card.Footer>
			</Card>
		</Col>
	));

	return (
		<Container
			fluid
			style={{ backgroundColor: "whitesmoke", height: "500vh" }}
		>
			<RestNavbar />

			<Container style={{ paddingRight: "150px", paddingLeft: "40px" }}>
				<div className="d-grid gap-2">
					<Button
						variant="primary"
						onClick={handleShow}
						style={{ backgroundColor: "black", border: "black" }}
					>
						Add a new dish
					</Button>
				</div>
			</Container>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>Add a new dish</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3">
							<Form.Label>Name:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter dish name"
								onChange={(e) => {
									setNewDishName(e.target.value);
								}}
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Price:</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<FormControl
									aria-label="Amount (to the nearest dollar)"
									onChange={(e) => {
										setNewDishPrice(e.target.value);
									}}
								/>
								<InputGroup.Text>.00</InputGroup.Text>
							</InputGroup>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Select category:</Form.Label>
							<FormControl
								as="select"
								onChange={selectDishCategory}
							>
								<option value="appetizer">Appetizer</option>
								<option value="salad">Salad</option>
								<option value="mainCourse">Main Course</option>
								<option value="dessert">Dessert</option>
								<option value="beverages">Beverages</option>
							</FormControl>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Select type:</Form.Label>
							<FormControl as="select" onChange={selectDishType}>
								<option value="veg">Veg</option>
								<option value="nonveg">Non Veg</option>
								<option value="vegan">Vegan</option>
							</FormControl>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Ingredients:</Form.Label>
							<Form.Control
								as="textarea"
								rows={2}
								onChange={(e) => {
									setNewDishIngredients(e.target.value);
								}}
							/>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								as="textarea"
								rows={2}
								onChange={(e) => {
									setNewDishDescription(e.target.value);
								}}
							/>
						</Form.Group>

						<FormGroup className="mb-3">
							<Form.Label>Add dish image:</Form.Label>
							<Form.Control
								type="file"
								onChange={pushRestaurantImgToAWS}
							/>
						</FormGroup>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleSave}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>

			<Container
				style={{
					width: "70rem",
				}}
			>
				<Row>{menuItemsList}</Row>
			</Container>
		</Container>
	);
};
