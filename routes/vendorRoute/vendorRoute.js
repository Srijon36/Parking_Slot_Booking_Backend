const express = require("express");
const router = express.Router();

const {
  createParking,
  getVendorParkings,
  vendorDashboard,
} = require("../../controllers/vendorController/vendorController");

const authMiddleware = require("../../middleware/authMiddleware");

router.post("/create-parking", authMiddleware, createParking);
router.get("/my-parkings", authMiddleware, getVendorParkings);
router.get("/dashboard", authMiddleware, vendorDashboard);

module.exports = router;