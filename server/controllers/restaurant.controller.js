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
        };

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

    validateRestaurantSignin = async (req, res) => {
        console.log(req.body);

        const emailId = req.body.emailId;
        const password = req.body.password;

        try {
            const response = await Restaurant.findOne({ $and: [{ emailId: emailId }, { password: password }] });
            console.log(JSON.stringify(response));
            
            if (response) {

                const restaurantId = response.id;
                console.log(restaurantId);
    
                res.cookie("restaurantId", restaurantId, {
                    maxAge: 3600000,
                    httpOnly: false,
                    path: "/"
                });
                req.session.user = restaurantId;

                res.status(200).send({
                    validCredentials: true
                });

                res.status(200).send({
                    validCredentials: true
                });
        
            } else {
                console.log('User mismatch');
                res.status(400).send({ validCredentials: false });
            }

        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Could not validate restaurant');
        }
    }

    updateRestaurantMeta = async (req, res) => {
        console.log(req.body);

        const restaurantId = req.body.restaurantId;

        const updatedRestaurantObj = {
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
        };

        try {
            const response = await Restaurant.updateOne(
                { _id: restaurantId },
                {
                    $set: {
                        name: updatedRestaurantObj.name,
                        emailId: updatedRestaurantObj.emailId,
                        password: updatedRestaurantObj.password,
                        contactNumber: updatedRestaurantObj.contactNumber,
                        street: updatedRestaurantObj.street,
                        shopNo: updatedRestaurantObj.shopNo,
                        city: updatedRestaurantObj.city,
                        state: updatedRestaurantObj.state,
                        zipcode: updatedRestaurantObj.zipcode,
                        country: updatedRestaurantObj.country,
                        opensAt: updatedRestaurantObj.opensAt,
                        closesAt: updatedRestaurantObj.closesAt,
                        description: updatedRestaurantObj.description,
                        cuisine: updatedRestaurantObj.cuisine,
                        profileImgUrl: updatedRestaurantObj.profileImgUrl,
                        deliveryOption: updatedRestaurantObj.deliveryOption,
                        pickupOption: updatedRestaurantObj.pickupOption,
                        veg: updatedRestaurantObj.veg,
                        nonVeg: updatedRestaurantObj.nonVeg,
                        vegan: updatedRestaurantObj.vegan,
                    }
                }
            );

            console.log(JSON.stringify(response));
            res.status(200).send('Updated');

        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Could not update restaurant meta');
        }
    }
}