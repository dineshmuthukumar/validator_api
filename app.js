require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");
const path = require("path");
var createError = require('http-errors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const admin = require("./routes/admin.route");
const user = require("./routes/user.route");
const provider = require("./routes/provider.route");
var helper = require('./services/helper.js');

const app = express();

app.use(cors());


// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100kb' }));

app.use('/storage', express.static(path.join(__dirname, 'storage')))

// Limit requests from same API
const limiter = rateLimit({
    max: 100000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// 3) ROUTES
app.use("/api/admin", admin);
app.use("/api/user", user);
app.use("/api/provider", provider);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    let code = err.status || 500;
    if (err.code == "LIMIT_FILE_SIZE") {
        code = 422;
    }
    res.status(code);

    if (404 === err.status) {
        res.format({
            'text/json': () => {
                res.status(code).json(helper.response({ status: code, error: err, message: err.message }));
            },
            'text/html': () => {
                res.render('404');
            },
            'application/json': () => {
                res.status(code).json(helper.response({ status: code, error: err, message: err.message }));
            },
            'default': () => {
                res.status(code).json(helper.response({ status: code, error: err, message: err.message }));
            }
        })
    } else {
        res.status(code).json(helper.response({ status: code, error: err, message: err.message }));
    }

});

module.exports = app;
