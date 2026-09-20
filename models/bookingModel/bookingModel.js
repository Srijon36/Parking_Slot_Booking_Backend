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

    vehicleName: {
      type: String,
      trim: true,
    },
    vehicleModel: {
      type: String,
      trim: true,
    },
    plateNumber: {
      type: String,
      trim: true,
    },

    hours: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      default: 0,
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