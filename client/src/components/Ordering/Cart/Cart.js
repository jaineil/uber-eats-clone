import { useContext } from "react";
import { useHistory } from "react-router";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../../store/cart-context";

const Cart = (props) => {
	const history = useHistory();
	const restaurantId = props.restaurantId;
	const cartCtx = useContext(CartContext);

	const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
	const hasItems = cartCtx.items.length > 0;

	const cartItemRemoveHandler = (id) => {
		cartCtx.removeItem(id);
	};

	const cartItemAddHandler = (item) => {
		cartCtx.addItem({ ...item, amount: 1 });
	};

	const cartItems = (
		<ul className={classes["cart-items"]}>
			{cartCtx.items.map((item) => (
				<CartItem
					key={item.id}
					name={item.name}
					amount={item.amount}
					price={item.price}
					onRemove={cartItemRemoveHandler.bind(null, item.id)}
					onAdd={cartItemAddHandler.bind(null, item)}
				/>
			))}
		</ul>
	);

	const placeOrderHandler = () => {
		const finalState = {
			cartItems: cartCtx.items,
			total: parseInt(cartCtx.totalAmount),
			restaurantId: restaurantId,
		};
		sessionStorage.setItem("state", JSON.stringify(finalState));
		// console.log(JSON.stringify(finalState));
		history.push("/order");
	};

	return (
		<Modal onClose={props.onClose}>
			{cartItems}
			<div className={classes.total}>
				<span>Total Amount</span>
				<span>{totalAmount}</span>
			</div>
			<div className={classes.actions}>
				<button
					className={classes["button--alt"]}
					onClick={props.onClose}
				>
					Close
				</button>
				{hasItems && (
					<button
						className={classes.button}
						onClick={placeOrderHandler}
					>
						Order
					</button>
				)}
			</div>
		</Modal>
	);
};

export default Cart;
