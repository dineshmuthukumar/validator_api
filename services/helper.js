exports.response = (data) => {
    let status = data.status ? data.status : 200;
    let title = data.title ? data.title : this.status(status);
    let message = data.message ? data.message : '';
    let responseData = data.data ? data.data : {};
    let error = data.error ? data.error : {};
    return { statusCode: status, title: title, message: message, responseData: responseData, error: error };
}

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

}