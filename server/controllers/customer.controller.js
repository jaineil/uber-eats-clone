import Customer from '../models/customer.model.js'

export class CustomerController {
    createCustomer = async (req, res) => {
        console.log(req.body);
        const createCustomerReqObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: req.body.password,
            dob: req.body.dob,
            contactNumber: req.body.contactNumber,
            address: {
                street: req.body.street,
                apt: req.body.apt,
                city: req.body.city,
                zipcode: req.body.zipcode,
                state: req.body.state,
                country: req.body.country,
                type: req.body.type
            }
        }

        const newCustomer = new Customer({
            firstName: createCustomerReqObj.firstName,
            lastName: createCustomerReqObj.lastName,
            emailId: createCustomerReqObj.emailId,
            password: createCustomerReqObj.password,
            dob: createCustomerReqObj.dob,
            contactNumber: createCustomerReqObj.contactNumber,
            addresses: createCustomerReqObj.address
        })

        try {
            const response = await newCustomer.save();
            console.log(JSON.stringify(response));
            res.send(response);
        } catch (err) {
            console.error('Error => ', err);
            res.status(500).send('Could not create customer')
        }
    }
}
