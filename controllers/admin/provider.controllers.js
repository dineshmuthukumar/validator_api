const { Provider } = require('../../models/provider');
const helper = require("./../../services/helper");
const db = require('../../services/model.js');

exports.getProviders = async (req, res) => {
  try {

    if (!req.query.length) req.query.length = 10;
    else req.query.length = parseInt(req.query.length);
    if (!req.query.page) req.query.page = 1;
    else req.query.page = parseInt(req.query.page);

    let skip = (req.query.page * req.query.length) - req.query.length;
    let providers = await db._get(Provider, null, null, { limit: req.query.length, skip: skip });
    let count = await db._count(Provider);

    const response = helper.response({ data: helper.paginate(req, providers, count) });
    return res.status(response.statusCode).json(response);

  } catch (err) {
    console.log(err);
  }

}
