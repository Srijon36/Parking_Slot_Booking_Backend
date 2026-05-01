const crypto = require("crypto");

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// OTP Expiry (5 minutes)
const otpExpiryTime = () => {
  return Date.now() + 5 * 60 * 1000;
};

// Verify OTP
const verifyOTP = (savedOTP, enteredOTP, expiry) => {
  if (!savedOTP) return false;

  if (Date.now() > expiry) {
    return false;
  }

  return savedOTP === enteredOTP;
};

module.exports = {
  generateOTP,
  otpExpiryTime,
  verifyOTP,
};