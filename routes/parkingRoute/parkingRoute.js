const express = require("express");
const router = express.Router();

const {
  createParking,
  getAllParkings,
  getParkingById,
} = require("../../controllers/parkingController/parkingController");

const authMiddleware = require("../../middlewares/authMiddleware/authMiddleware");

// CREATE PARKING (Vendor only) - protected route
router.post("/", authMiddleware, createParking);

// GET ALL PARKINGS - public route
router.get("/", getAllParkings);

// GET SINGLE PARKING BY ID - public route
router.get("/:id", getParkingById);

module.exports = router;