const querystring = require('node:querystring'); 

exports.paginate = (req, data, count) => {

    let query = querystring.parse(req.originalUrl);

    if (!req.query.page) req.query.page = 1;
    else req.query.page = parseInt(req.query.page);
    if (!req.query.length) req.query.length = 10;
    else req.query.length = parseInt(req.query.length);

    let response = {};
    response.data = data;
    response.current_page = req.query.page;
    response.from = (req.query.page * req.query.length) - req.query.length + 1;
    response.to = req.query.length;
    response.last_page = Math.ceil(count / req.query.length);
    response.first_page_url = req.protocol + '://' + req.get('host') + query.url + "?page=1";
    response.last_page_url = req.protocol + '://' + req.get('host') + query.url + "?page=" + response.last_page;
    response.prev_page_url = req.query.page == 1 ? null : req.protocol + '://' + req.get('host') + query.url + "?page=" + (response.current_page - 1);
    response.next_page_url = response.last_page == req.query.page ? null : req.protocol + '://' + req.get('host') + query.url + "?page=" + (response.current_page + 1);
    response.per_page = req.query.length;
    response.total = count;
    return response;
}


exports.response = (data) => {
    let status = data.status ? data.status : 200;
    let title = data.title ? data.title : this.status(status);
    let message = data.message ? data.message : "";
    let responseData = data.data ? data.data : {};
    let error = data.error ? data.error : {};

    return {
        statusCode: status,
        title: title,
        message: message,
        responseData: responseData,
        error: error,
    };
};

exports.status = (code) => {
    switch (code) {
        case 200:
            return "OK";
            break;

        case 201:
            return "Created";
            break;

        case 204:
            return "No Content";
            break;

        case 301:
            return "Moved Permanently";
            break;

        case 400:
            return "Bad Request";
            break;

        case 401:
            return "Unauthorised";
            break;

        case 403:
            return "Forbidden";
            break;

        case 404:
            return "Not Found";
            break;

        case 405:
            return "Method Not Allowed";
            break;

        case 422:
            return "Unprocessable Entity";
            break;

        case 500:
            return "Internal Server Error";
            break;

        case 502:
            return "Bad Gateway";
            break;

        case 503:
            return "Service Unavailable";
            break;
    }
};
