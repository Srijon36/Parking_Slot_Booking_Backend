const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parkingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
      required: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },

    // 🚗 Vehicle Info
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      enum: ["car", "bike"],
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },

    // 💰 Optional pricing
    totalPrice: {
      type: Number,
      default: 0,
    },

    // 🔳 Optional QR Code (for entry)
    qrCode: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔥 Index for faster query (important for overlap check)
bookingSchema.index({ slotId: 1, startTime: 1, endTime: 1 });

// ❗ Validate time (basic check)
bookingSchema.pre("save", function (next) {
  if (this.startTime >= this.endTime) {
    return next(new Error("End time must be greater than start time"));
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);