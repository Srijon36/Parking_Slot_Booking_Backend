const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel/userModel");
const { SECRET_KEY } = require("../../utils/config");

// ---------------- REGISTER USER / VENDOR ----------------
exports.createRegister = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      confirm_password,
      phone,
      role,
      parkingName,
      address,
      gstNumber,
    } = req.body;

    // password match
    if (password !== confirm_password) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // check existing
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: uuidv4(),
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: role || "user",
      parkingName,
      address,
      gstNumber,
      isVerified: true, // enable OTP later if needed
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    next(error);
  }
};