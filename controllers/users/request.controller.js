const Joi = require('joi');
const { User } = require('../../models/user');
const { Setting } = require('../../models/setting');
const helper = require('../../services/helper');
const db = require('../../services/model');

exports.getFare = async (req, res) => {
    try {
        const schema = Joi.object().options({ abortEarly: false }).keys({
            currentLatitude: Joi.string().required().label("currentLatitude"),
            currentLongitude: Joi.string().required().label("currentLongitude"),
            requestLatitude: Joi.string().required().label("requestLatitude"),
            requestLongitude: Joi.string().required().label("requestLongitude"),
            vehicleType: Joi.string().required().label("vehicleType")
        });

        const { error } = schema.validate(req.body);
        const errors = {};
        if (error) {
            for (let err of error.details) {
                errors[err.path[0]] = (err.message).replace(/"/g, "");
            }
        }

        if (error) res.status(422).json(helper.response({ status: 422, error: errors }));

        let settings = await db._get(Setting, {}, {}, {});
        let vehicle = settings[0].fareDetails.filter((vehicle) => vehicle.vehicleType === req.body.vehicleType)
        if (vehicle.length == 0) {
            return res.status(422).json(helper.response({ status: 422, error: 'No Vehicle Found' }));
        }

        const lat1 = req.body.currentLatitude
        const lon1 = req.body.currentLongitude

        const lat2 = req.body.requestLatitude;
        const lon2 = req.body.requestLongitude

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres

        const finalKm = d / 1000;

        const data = {
            totalKm: Math.round(finalKm),
            baseFare: parseFloat(vehicle[0].baseFare),
            perKm: parseFloat(vehicle[0].perKm),
            totalFare: (Math.round(finalKm) * vehicle[0].perKm) + parseFloat(vehicle[0].baseFare)
        }
        const response = helper.response({
            message: "Fare Details Fetched Successfully",
            data: data,
        });
        return res.status(response.statusCode).json(response);
    } catch (err) {
        console.log(err);
        if (err[0] != undefined) {
            for (i in err.errors) {
                res.status(422).send(err.errors[i].message);
            }
        } else {
            res.status(500).send({ error: err.name });
        }

    }
}