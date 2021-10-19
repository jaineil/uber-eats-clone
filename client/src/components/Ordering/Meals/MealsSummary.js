import classes from "./MealsSummary.module.css";

const MealsSummary = (props) => {
	return (
		<section className={classes.summary}>
			<h2>Delicious Food, Delivered To You</h2>
			<p>{props.summary}</p>
			<p>
				All our meals are cooked with high-quality ingredients,
				just-in-time and of course by experienced chefs!
			</p>
		</section>
	);
};

export default MealsSummary;
