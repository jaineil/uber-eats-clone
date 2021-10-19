import { Fragment } from "react";
import MealsSummary from "./MealsSummary";
import AvailableMeals from "./AvailableMeals";
import MealItem from "./MealItem/MealItem";

const Meals = (props) => {
	const mealsList = props.meals.map((meal) => (
		<MealItem
			key={meal.ID}
			id={meal.ID}
			name={meal.NAME}
			description={meal.DESCRIPTION}
			price={meal.PRICE}
		/>
	));

	return (
		<Fragment>
			<MealsSummary summary={props.summary} cuisine={props.cuisine} />
			<AvailableMeals mealsList={mealsList} />
		</Fragment>
	);
};

export default Meals;
