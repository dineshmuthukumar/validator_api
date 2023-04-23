const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Joi = require("joi");

const User = require('../../models/user');
const helper = require('./../../services/helper');

exports.register = async (req, res) => {
    try {
        const schema = Joi.object()
            .options({ abortEarly: false })
            .keys({
                first_name: Joi.string().required().label("First Name"),
                last_name: Joi.string().required().label("Last Name"),
                email: Joi.string().required().label("Email"),
                mobile_number: Joi.string().required().min(6).label("Mobile Number"),
                password: Joi.string().required().min(6).label("Password"),
                confirm_password: Joi.string()
                    .required()
                    .valid(Joi.ref("password"))
                    .label("Confirm Password"),
            })
            .unknown(true);

        const { error } = schema.validate(req.body);
        const errors = {};
        if (error) {
            console.log(error.details);
            for (let err of error.details) {
                errors[err.path[0]] = err.message.replace(/"/g, "");
            }
        }

        if (error)
            return res
                .status(422)
                .json(helper.response({ status: 422, error: errors }));

        // Get user input
        const { first_name, last_name, email, password, mobile_number, device_type, device_token, device_id } = req.body;

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).json(helper.response({ status: 422, error: "Email Already Exists" }));
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            mobile_number: mobile_number,
            password: encryptedPassword,
            device_id: device_id,
            device_token: device_token,
            device_type: device_type
        });

        // Create token
        let payload = _.pick(user, ["_id", "first_name", "last_name", "email", "mobile_number", "user_status"]);
        const token = user.generateAuthToken(payload);

        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err, 'catch')
        if (err[0] != undefined) {
            for (i in err.errors) {
                res.status(422).send(err.errors[i].message);
            }
        } else {
            res.status(500).send({ error: err.name });
        }
    }
}

exports.login = async (req, res) => {
    try {
        const schema = Joi.object()
            .options({ abortEarly: false })
            .keys({
                email: Joi.string().required().label("Email"),
                password: Joi.string().required().min(6).label("Password")
            })
            .unknown(true);

        const { error } = schema.validate(req.body);
        const errors = {};
        if (error) {
            for (let err of error.details) {
                errors[err.path[0]] = err.message.replace(/"/g, "");
            }
        }

        if (error)
            return res
                .status(422)
                .json(helper.response({ status: 422, error: errors }));


        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            let payload = _.pick(user, ["_id", "first_name", "last_name", "email", "mobile_number", "user_status"]);

            // Create token
            const token = user.generateAuthToken(payload);
            const refreshToken = user.generateRefreshToken(payload);

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        if (err[0] != undefined) {
            for (i in err.errors) {
                res.status(422).send(err.errors[i].error);
            }
        } else {
            res.status(500).send({ error: err.name });
        }
    }
}

exports.getProfile = async (req, res) => {
    try {
        let userData = await User.findOne({ _id: req.user._id });
        const data = userData;
        const response = helper.response({
            message: "Profile Fetched Successcully",
            data,
        });
        return res.status(response.statusCode).json(response);
    } catch (error) {
        console.log(err);
        if (err[0] != undefined) {
            for (i in err.errors) {
                return res.status(422).json(err.errors[i].message);
            }
        } else {
            return res.status(422).json(err);
        }
    }
}