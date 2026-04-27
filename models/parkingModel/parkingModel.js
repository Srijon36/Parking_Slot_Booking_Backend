const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parkingName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: String,
    state: String,

    latitude: Number,
    longitude: Number,

    totalSlots: {
      type: Number,
      required: true,
    },

    availableSlots: {
      type: Number,
      required: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    images: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);