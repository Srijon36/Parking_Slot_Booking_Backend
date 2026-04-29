const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parkingName: String,
    address: String,

    latitude: Number,
    longitude: Number,

    totalSlots: Number,

    pricePerHour: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);