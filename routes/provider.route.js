const express = require("express");
const router = express.Router();
const path = require("path");

const middleware = require("./../middleware/auth");


const authController = require("./../controllers/providers/auth.controllers");

// Register
router.post("/register", [
    middleware.uploadAs(path.join(__dirname, '../storage/provider/document/')).fields([
        { name: 'taxiImageFront', maxCount: 1 },
        { name: 'taxiImageBack', maxCount: 1 },
        { name: 'taxiImageIn', maxCount: 1 },
        { name: 'driverLicense', maxCount: 1 },
    ])
], (req, res) => {
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