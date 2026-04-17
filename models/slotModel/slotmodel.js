const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },

    slotNumber: {
      type: Number,
      required: true,
    },

    // 🚗 Slot Type (Tier System)
    slotType: {
      type: String,
      enum: ["basic", "medium", "pro"],
      default: "basic",
    },

    // 💰 Price per hour based on type
    pricePerHour: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate slot numbers in same parking
slotSchema.index({ parkingId: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);