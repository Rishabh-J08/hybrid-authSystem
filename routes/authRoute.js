const express = require("express");
const {signup, login , logout, optLogin, verifyOtp, fingerpirntSignup} = require("../controllers/authController")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/login-otp", optLogin);
router.post("/verify-otp", verifyOtp);
router.post("/figerprint-register", fingerpirntSignup)


module.exports = router;