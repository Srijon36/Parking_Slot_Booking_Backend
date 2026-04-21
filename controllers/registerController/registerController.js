const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, role, parkingName, address, gstNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (role === "vendor") {
      if (!parkingName || !address || !gstNumber) {
        return res.status(400).json({
          message: "Vendors must provide parkingName, address, and gstNumber",
        });
      }
    }

    const userData = { email, password, role: role || "user" };

    if (role !== "admin") {
      if (!fullName || !phone) {
        return res.status(400).json({ message: "fullName and phone are required" });
      }
      userData.fullName = fullName;
      userData.phone = phone;
    }

    if (role === "vendor") {
      userData.parkingName = parkingName;
      userData.address = address;
      userData.gstNumber = gstNumber;
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser };