const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // 🔹 Common Fields
    fullName: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },

    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },

    // =========================
    // 🧑‍💼 VENDOR FIELDS
    // =========================
    parkingName: {
      type: String,
      required: function () {
        return this.role === "vendor";
      },
    },

    address: {
      type: String,
      required: function () {
        return this.role === "vendor";
      },
    },

    gstNumber: {
      type: String,
      required: function () {
        return this.role === "vendor";
      },
    },

    // =========================
    // 🔐 OTP SYSTEM
    // =========================
    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    // =========================
    // ✅ ACCOUNT STATUS
    // =========================
    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);