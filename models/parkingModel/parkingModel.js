const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    totalSlots: {
      type: Number,
      required: true,
    },
    pricePerHour: {
        type: Number,
        default: 20
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parking", parkingSchema);