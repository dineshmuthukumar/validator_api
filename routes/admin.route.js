const express = require("express");
const router = express.Router();
const middleware = require("./../middleware/auth");

const authController = require("./../controllers/admin/auth.controllers");
const providerController = require("./../controllers/admin/provider.controllers");
const userController = require("./../controllers/admin/user.controllers");

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


// Get Provider list
router.get("/providers", middleware.user, (req, res) => {
    providerController.getProviders(req, res);
});

// Get User list
router.get("/users", middleware.user, (req, res) => {
    userController.getUsers(req, res);
});

module.exports = router;