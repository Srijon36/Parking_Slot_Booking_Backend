const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  resetPassword,
} = require("../../controllers/forgotPasswordController/forgotPasswordController");

// POST /api/auth/send-otp
router.post("/send-otp", sendOtp);

// POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

module.exports = router;