import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import {
	Container,
	Navbar,
	Carousel,
	Row,
	Col,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
	InputGroup,
	Button,
} from "react-bootstrap";
import cookie from "react-cookies";
import Axios from "axios";
import { uploadFile } from "react-s3";
import { config } from "../../config/awsConfig";
import { Link } from "react-router-dom";
import { awsServer } from "../../config/awsIP";

export const EditDish = (props) => {
	const history = useHistory();
	if (!cookie.load("restaurantId")) {
		console.log("No user cookie!");
		history.push("/restaurantSignin");
	} else {
		console.log("All good on the cookie front!");
	}
	const mealId = props.match.params.mealId;

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState();
	const [category, setCategory] = useState("");
	const [ingredients, setIngredients] = useState("");
	const [dishImgUrl, setDishImgUrl] = useState("");

	const componentIsMounted = useRef(true);

	const fetchOneDish = async () => {
		console.log("About to fetch dish => ", mealId);
		try {
			const response = await Axios.get(
				`http://${awsServer}/fetchOneDish/${mealId}`
			);

			const mealMeta = response.data[0];

			setName(mealMeta.NAME);
			setDescription(mealMeta.DESCRIPTION);
			setIngredients(mealMeta.INGREDIENTS);
			setPrice(mealMeta.PRICE);
			setCategory(mealMeta.CATEGORY);
			setDishImgUrl(mealMeta.ITEM_IMAGE_URL);
		} catch (err) {
			console.error(err);
		}
	};

	const pushRestaurantImgToAWS = async (e) => {
		try {
			const res = await uploadFile(e.target.files[0], config);
			console.log("Uploaded on AWS S3 => ", JSON.stringify(res));
			setDishImgUrl(res.location);
			return;
		} catch (err) {
			console.error(
				"Failed when uploading bg image for restaurant => ",
				err
			);
		}
	};

	const selectDishCategory = (e) => {
		e.preventDefault();
		setCategory(e.target.value);
	};

	const handleSave = async (e) => {
		e.preventDefault();

		const payload = {
			name: name,
			description: description,
			price: parseInt(price),
			category: category,
			ingredients: ingredients,
			dishImgUrl: dishImgUrl,
			mealId: mealId,
		};

		console.log("About to shoot => ", JSON.stringify(payload));

		try {
			const response = await Axios.post(
				`http://${awsServer}/updateOneDish`,
				payload
			);

			console.log(
				"Successfully updated a dish => ",
				JSON.stringify(response.data)
			);
			// history.push("/restaurantMenu");
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
		fetchOneDish();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Container fluid>
			<Navbar variant="light" style={{ backgroundColor: "#EAAA00" }}>
				<Container>
					<Navbar.Brand>
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

			<Carousel>
				<Carousel.Item style={{ height: "60vh" }}>
					<img
						className="d-block w-100"
						src={dishImgUrl}
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
					<h3 className="text mt-3">Update Dish Information</h3>
				</Col>
			</Row>
			<Row
				style={{
					paddingLeft: "50px",
					paddingRight: "500px",
				}}
			>
				<Col>
					<Form className="p2">
						<FormGroup className="mt-3">
							<FormLabel>Dish Name:</FormLabel>
							<FormControl
								type="text"
								name="name"
								defaultValue={name}
								onChange={(e) => {
									setName(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Description:</FormLabel>
							<FormControl
								name="description"
								as="textarea"
								rows={2}
								defaultValue={description}
								onChange={(e) => {
									setDescription(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<FormGroup className="mt-3">
							<FormLabel>Ingredients:</FormLabel>
							<FormControl
								name="ingredients"
								as="textarea"
								rows={2}
								defaultValue={ingredients}
								onChange={(e) => {
									setIngredients(e.target.value);
								}}
								required
							/>
						</FormGroup>

						<Form.Group className="mt-3">
							<Form.Label>Select category:</Form.Label>
							<FormControl
								as="select"
								onChange={selectDishCategory}
								defaultValue={category}
							>
								<option>Select category</option>
								<option value="APPETIZER">Appetizer</option>
								<option value="SALAD">Salad</option>
								<option value="MAIN COURSE">Main Course</option>
								<option value="DESSERT">Dessert</option>
								<option value="BEVERAGES">Beverages</option>
							</FormControl>
						</Form.Group>

						<Form.Group className="mt-3">
							<Form.Label>Price:</Form.Label>
							<InputGroup>
								<InputGroup.Text>$</InputGroup.Text>
								<FormControl
									defaultValue={price}
									onChange={(e) => {
										setPrice(e.target.value);
									}}
								/>
								<InputGroup.Text>.00</InputGroup.Text>
							</InputGroup>
						</Form.Group>

						<FormGroup className="mt-3">
							<Form.Label>Add dish image:</Form.Label>
							<Form.Control
								type="file"
								onChange={pushRestaurantImgToAWS}
							/>
						</FormGroup>

						<div className="d-grid gap-2">
							<Button
								variant="dark"
								type="submit"
								style={{ color: "white", marginLeft: "650px" }}
								size="lg"
								className="mb-5"
								onClick={handleSave}
							>
								<Link
									to="/restaurantMenu"
									style={{ color: "white" }}
								>
									Save new details.
								</Link>
							</Button>
						</div>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};
