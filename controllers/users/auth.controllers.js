const _ = require("lodash");
const Joi = require("joi");

const { User } = require("../../models/user");
const helper = require("./../../services/helper");
const db = require("../../services/model.js");

exports.save = async (req, res) => {
  try {
    const schema = Joi.object()
      .options({ abortEarly: false })
      .keys({
        input: Joi.string().required().label("input"),
        result: Joi.number().required().label("result"),
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
    const { input, result } = req.body;

    const user = await User.create({
      input: input, // sanitize: convert email to lowercase
      result: result,
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err, "catch");
    if (err[0] != undefined) {
      for (i in err.errors) {
        res.status(422).send(err.errors[i].message);
      }
    } else {
      res.status(500).send({ error: err.name });
    }
  }
};

exports.getdata = async (req, res) => {
  try {
    if (!req.query.length) req.query.length = 10;
    else req.query.length = parseInt(req.query.length);
    if (!req.query.page) req.query.page = 1;
    else req.query.page = parseInt(req.query.page);
    let skip = req.query.page * req.query.length - req.query.length;
    let result = await db._get(User, null, null, {
      limit: req.query.length,
      skip: skip,
    });
    let count = await db._count(result);

    const response = helper.response({
      data: helper.paginate(req, result, count),
    });
    return res.status(response.statusCode).json(response);
  } catch (err) {
    console.log(err);
  }
};
