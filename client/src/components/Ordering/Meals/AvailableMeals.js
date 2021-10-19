import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";

const AvailableMeals = (props) => {
	return (
		<section className={classes.meals}>
			<Card>
				<ul>{props.mealsList}</ul>
			</Card>
		</section>
	);
};

export default AvailableMeals;
