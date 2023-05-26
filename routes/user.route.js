const express = require("express");
const router = express.Router();

const authController = require("./../controllers/users/auth.controllers");

// Register
router.post("/save", (req, res) => {
  authController.save(req, res);
});

// Login
router.get("/getdata", (req, res) => {
  authController.getdata(req, res);
});

module.exports = router;
