import Restaurant from '../models/restaurant.model.js';

export class RestaurantController {
    create = async (req, res) => {
        console.log(req.body);
        const restaurantObj = {
            name: req.body.name,
            emailId: req.body.emailId,
            password: req.body.password,
            contactNumber: req.body.contactNumber,
            street: req.body.street,
            shopNo: req.body.apt,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            country: req.body.country,
            opensAt: req.body.opensAt,
            closesAt: req.body.closesAt,
            description: req.body.description,
            cuisine: req.body.cuisine,
            profileImgUrl: req.body.img,
            deliveryOption: req.body.deliveryOption,
            pickupOption: req.body.pickupOption,
            veg: req.body.veg,
            nonVeg: req.body.nonVeg,
            vegan: req.body.vegan,
        }

        const newRestaurant = new Restaurant(restaurantObj);

        try {
            const response = await newRestaurant.save();
            console.log(JSON.stringify(response));
            res.status(200).send(response);
        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Could not create a restaurant');
        }
    }
}