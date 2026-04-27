const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },

    slotNumber: {
      type: String,
      required: true,
    },

    vehicleType: {
      type: String,
      enum: ["car", "bike", "ev"],
      default: "car",
    },

    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);