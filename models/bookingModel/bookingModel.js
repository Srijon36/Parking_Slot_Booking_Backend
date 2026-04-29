const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
    },

    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
    },

    startTime: Date,
    endTime: Date,

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);