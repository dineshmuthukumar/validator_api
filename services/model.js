const mongoose = require('mongoose');

exports._get = async (model, projection = {}, selection = {}, options = {}) => {

    try {
        const query = model.find(projection);

        if (options.populate) query.populate(options.populate);

        // if (options.aggregate) query.aggregate(options.aggregate);

        if (options.sort) query.sort(options.sort)

        if (options.skip) query.skip(options.skip);

        if (options.limit) query.limit(options.limit);

        query.select(selection);

        const response = await query;

        return response;

    } catch (err) {
        console.log(err)
    }
}


exports._store = async (model, document, options = {}) => {

    try {

        const query = new model(document);

        const response = await query.save();
        return response;

    } catch (err) {
        console.log(err)
        throw err;
    }

}


exports._find = async (model, projection = {}, selection = {}, options = {}) => {

    try {
        let query = model.findOne(projection);

        if (options.populate) query.populate(options.populate);

        query.select(selection);

        const response = await query;

        return response;

    } catch (err) {
        console.log(err)
    }
}


exports._update = async (model, condition = {}, document, options = {}) => {
    try {
        const query = await model.findOneAndUpdate(condition, document, { upsert: true, new: true, setDefaultsOnInsert: true });
        return query;

    } catch (err) {
        console.log(err)
    }

}

exports._updateMany = async (model, condition = {}, data, options = {}) => {
    try {

        const query = await model.updateMany(condition, data, { new: true });
        return true;

    } catch (err) {
        console.log(err)
    }

}


exports._delete = async (model, condition = {}, options = {}) => {

    try {

        const query = await model.findOneAndDelete(condition);

        return query;
    } catch (err) {
        console.log(err)
    }

}


exports._deleteAll = async (model, condition = {}, options = {}) => {
    try {
        const query = await model.deleteMany(condition);

        return true;
    } catch (err) {
        console.log(err)
    }
}


exports._count = async (model, condition = {}, options = {}) => {
    try {
        const query = await model.countDocuments(condition);

        return query;
    } catch (err) {
        console.log(err)
    }
}