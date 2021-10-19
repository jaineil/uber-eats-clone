import { Fragment } from "react";

import HeaderCartButton from "./HeaderCartButton";
import CustNavbar from "../../Navbar/CustNavbar";
import classes from "./Header.module.css";

const Header = (props) => {
	return (
		<Fragment>
			<header className={classes.header}>
				<CustNavbar />
				<h1>{props.name}</h1>
				<HeaderCartButton onClick={props.onShowCart} />
			</header>
			<div className={classes["main-image"]}>
				<img
					src={props.restaurantImg}
					alt="A table full of delicious food!"
				/>
			</div>
		</Fragment>
	);
};

export default Header;
