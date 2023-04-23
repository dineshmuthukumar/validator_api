const express = require("express");
const router = express.Router();
const middleware = require("./../middleware/auth");

const authController = require("./../controllers/admin/auth.controllers");

// Register
router.post("/register", (req, res) => {
    authController.register(req, res);
});

// Login
router.post("/login", (req, res) => {
    authController.login(req, res);
});

// Get Profile
router.get("/profile", middleware.user, (req, res) => {
    authController.getProfile(req, res);
});

module.exports = router;