import { gql } from "apollo-boost";

export const findAllRestaurants = gql`
	query ($city: String) {
		findAllRestaurants(city: $city) {
			_id
			name
			phoneno
			about
			image
			street
			city
			state
			country
			zipcode
			opentime
			closeTime
			isDelivery
			isPickup
			dishes
		}
	}
`;

export const findOneRestaurant = gql`
	query ($restaurantId: ID) {
		findOneRestaurant(restaurantId: $restaurantId) {
			_id
			name
			phoneno
			about
			image
			street
			city
			state
			country
			zipcode
			opentime
			closeTime
			isDelivery
			isPickup
			dishes
		}
	}
`;

export const getDishesbyRest = gql`
	query ($restId: ID) {
		getDishesbyRest(restaurantId: $restaurantId) {
			_id
			name
			ingredient
			price
			quantity
			type
			category
			image
			description
		}
	}
`;

export const getAddresses = gql`
query{
    getAddresses(){
        _id,
        name,
        street,
        city,
        country,
        zipcode
    }
}`;

export const findAllCustomers = gql`
query{
    findAllCustomers(){
        _id,
        name,
        about,
        dob,
        nickname,
        phoneno,
        profilePic,
        addresses,
    }
}`;

export const findOneCustomers = gql`
	query {
		findOneCustomers(id: $id) {
			_id
			name
			about
			dob
			nickname
			phoneno
			profilePic
			addresses
		}
	}
`;

export const getRestaurantsOrders = gql`
	query ($restaurantId: ID, $pageLimit: Int) {
		getRestaurantsOrders(
			restaurantId: $restaurantId
			pageLimit: $pageLimit
		) {
			_id
			restaurantId
			restName
			customer
			orderTime
			orderStatus
			orderFilter
			orderMode
			total
			orderItems
			orderNote
		}
	}
`;

export const getCustomersOrders = gql`
	query ($customerId: ID, $pageLimit: Int, $pageNumber: Int) {
		getCustomersOrders(
			customerId: $customerId
			pageLimit: $pageLimit
			pageNumber: $pageNumber
		) {
			_id
			restaurantId
			restName
			customer
			orderTime
			orderStatus
			orderFilter
			orderMode
			total
			orderItems
			orderNote
		}
	}
`;
