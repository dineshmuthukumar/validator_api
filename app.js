require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");
var createError = require("http-errors");
var helper = require("./services/helper.js");

const user = require("./routes/user.route");

const app = express();

app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "100kb" }));

// 3) ROUTES
app.use("/api/user", user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  let code = err.status || 500;
  if (err.code == "LIMIT_FILE_SIZE") {
    code = 422;
  }
  res.status(code);

  if (404 === err.status) {
    res.format({
      "text/json": () => {
        res
          .status(code)
          .json(
            helper.response({ status: code, error: err, message: err.message })
          );
      },
      "text/html": () => {
        res.render("404");
      },
      "application/json": () => {
        res
          .status(code)
          .json(
            helper.response({ status: code, error: err, message: err.message })
          );
      },
      default: () => {
        res
          .status(code)
          .json(
            helper.response({ status: code, error: err, message: err.message })
          );
      },
    });
  } else {
    res
      .status(code)
      .json(
        helper.response({ status: code, error: err, message: err.message })
      );
  }
});

module.exports = app;
