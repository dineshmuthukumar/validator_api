require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const cors = require("cors");

const admin = require("./routes/admin.route");
const user = require("./routes/user.route");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/admin", admin);
app.use("/api/user", user);

module.exports = app;
