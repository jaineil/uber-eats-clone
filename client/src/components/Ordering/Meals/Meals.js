import { Fragment } from "react";
import MealsSummary from "./MealsSummary";
import AvailableMeals from "./AvailableMeals";
import MealItem from "./MealItem/MealItem";

const Meals = (props) => {
	const mealsList = props.meals.map((meal) => (
		<MealItem
			key={meal._id}
			id={meal._id}
			name={meal.name}
			description={meal.description}
			price={meal.price}
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
