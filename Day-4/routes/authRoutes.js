const validateUser = require("../middleware/validateRegister");
const validateLogin = require("../middleware/validateLogin");
const { registerUser, loginUser } = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/register", validateUser, registerUser);
router.post("/login", validateLogin, loginUser);

module.exports = router;
