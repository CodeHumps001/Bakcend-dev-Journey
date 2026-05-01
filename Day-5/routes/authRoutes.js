const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { register, login, getMe } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe); // ← new route

module.exports = router;
