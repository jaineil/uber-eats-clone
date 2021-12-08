import { gql } from "apollo-boost";

export const login = gql`
	mutation ($email: String, $password: String) {
		login(email: $email, password: $password) {
			token
		}
	}
`;

export const updateOrder = gql`
	mutation ($orderId: ID, $status: String, $filter: String) {
		updateOrder(orderId: $orderId, status: $status, filter: $filter) {
			message
		}
	}
`;

export const editDish = gql`
	mutation ($restaurantId: ID, $dish: Object) {
		editDish(restaurantId: $restaurantId, dish: $dish) {
			dish
		}
	}
`;

export const addDish = gql`
	mutation ($restaurantId: ID, $dish: Object) {
		addDish(restaurantId: $restaurantId, dish: $dish) {
			message
		}
	}
`;

export const customerUpdate = gql`
	mutation ($customerId: ID, $toUpdate: Object) {
		customerUpdate(customerId: $customerId, toUpdate: $toUpdate) {
			message
		}
	}
`;

export const restaurantUpdate = gql`
	mutation ($restaurantId: ID, $toUpdate: Object) {
		restaurantUpdate(restaurantId: $restaurantId, toUpdate: $toUpdate) {
			message
		}
	}
`;
