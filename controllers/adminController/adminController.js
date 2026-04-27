const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel/userModel");
const { SECRET_KEY } = require("../../utils/config");

// ---------------- CREATE DEFAULT ADMIN ----------------
exports.createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@parkingslot.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const admin = new User({
        fullName: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        phone: "0000000000",
        isVerified: true,
        isActive: true,
      });

      await admin.save();

      const token = jwt.sign(
        {
          id: admin._id,
          role: admin.role,
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      console.log("------------------------------------------------");
      console.log("✅ Default Admin Created");
      console.log("Email:", adminEmail);
      console.log("Password: Admin@123");
      console.log("Token:", token);
      console.log("------------------------------------------------");

    } else {
      console.log("ℹ️ Admin already exists");
    }

  } catch (error) {
    console.error("❌ Admin creation failed:", error);
  }
};