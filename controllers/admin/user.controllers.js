const { User } = require('../../models/user');
const helper = require("./../../services/helper");
const db = require('../../services/model.js');

exports.getUsers = async (req, res) => {
  try {
    if (!req.query.length) req.query.length = 10;
    else req.query.length = parseInt(req.query.length);
    if (!req.query.page) req.query.page = 1;
    else req.query.page = parseInt(req.query.page);

    let skip = (req.query.page * req.query.length) - req.query.length;
    let users = await db._get(User, null, null, { limit: req.query.length, skip: skip });
    let count = await db._count(User);

    const response = helper.response({ data: helper.paginate(req, users, count) });
    return res.status(response.statusCode).json(response);

  } catch (err) {
    console.log(err);
  }
}
