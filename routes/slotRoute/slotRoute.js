const express = require("express");
const router = express.Router();

const {
  createSlots,
  getSlotsByParking,
  getAvailableSlots,
  bookSlot,
  releaseSlot,
} = require("../../controllers/slotController/slotController");

// Vendor create slots
router.post("/create", createSlots);

// All slots of parking
router.get("/:parkingId", getSlotsByParking);

// Available slots
router.get("/available/:parkingId", getAvailableSlots);

// Book slot
router.put("/book/:slotId", bookSlot);

// Release slot
router.put("/release/:slotId", releaseSlot);

module.exports = router;