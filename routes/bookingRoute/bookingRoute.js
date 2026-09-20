const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require("../../controllers/bookingController/bookingController");

const authMiddleware = require("../../middlewares/authMiddleware/authMiddleware");

// CREATE BOOKING (User only) - protected route
router.post("/", authMiddleware, createBooking);
router.post("/create", authMiddleware, createBooking);

// GET LOGGED-IN USER'S BOOKINGS - protected route
router.get("/my-bookings", authMiddleware, getUserBookings);

// GET SINGLE BOOKING BY ID - protected route
router.get("/:id", authMiddleware, getBookingById);

// CANCEL BOOKING - protected route
router.patch("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;