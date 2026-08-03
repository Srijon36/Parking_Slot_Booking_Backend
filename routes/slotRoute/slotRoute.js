const express = require("express");
const router = express.Router();

const {
  createSlots,
  getSlotsByParking,
  getAvailableSlots,
  bookSlot,
  releaseSlot,
} = require("../../controllers/slotController/slotController");

const authMiddleware = require("../../middlewares/authMiddleware/authMiddleware");

// Vendor create slots - protected route
router.post("/create", authMiddleware, createSlots);

// All slots of parking - public
router.get("/:parkingId", getSlotsByParking);

// Available slots - public
router.get("/available/:parkingId", getAvailableSlots);

// Book slot - protected route (user must be logged in)
router.put("/book/:slotId", authMiddleware, bookSlot);

// Release slot - protected route
router.put("/release/:slotId", authMiddleware, releaseSlot);

module.exports = router;