const User = require("../../models/userModel/userModel");
const Parking = require("../../models/parkingModel/parkingModel");

// --- Dashboard Stats ----------------------------------------
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments({ role: "user" });
    const activeUsers   = await User.countDocuments({ role: "user", isActive: true });
    const totalVendors  = await User.countDocuments({ role: "vendor" });
    const activeVendors = await User.countDocuments({ role: "vendor", isActive: true });
    const verifiedVendors = await User.countDocuments({ role: "vendor", isVerified: true });
    const totalParkings = await Parking.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalVendors,
        activeVendors,
        verifiedVendors,
        totalParkings,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
      error: error.message,
    });
  }
};

// --- Get All Users (role: user) ------------------------------
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password -__v -otp -otpExpiry");

    return res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

// --- Get Verified Users (kept for route compatibility) --------
// NOTE: Your userModel has no `isSubscribed` field, so this returns
// verified users instead. Rename freely once you decide what this
// endpoint should really represent for a parking app.
const getSubscribedUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user", isVerified: true })
      .select("-password -__v -otp -otpExpiry");

    return res.status(200).json({
      success: true,
      totalVerified: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verified users.",
      error: error.message,
    });
  }
};

// --- Get Single User ------------------------------------------
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -__v -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
      error: error.message,
    });
  }
};

// --- Toggle Verified Status (route was "toggle-subscription") ---
const toggleSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isVerified ? "verified" : "unverified"} successfully.`,
      isVerified: user.isVerified,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle verification.",
      error: error.message,
    });
  }
};

// --- Toggle Active Status --------------------------------------
const toggleActiveStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully.`,
      isActive: user.isActive,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle active status.",
      error: error.message,
    });
  }
};

// --- Delete User -------------------------------------------------
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};

// --- Admin: Create Vendor (direct create, no approval flow) -----
const createVendor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      parkingName,
      address,
      gstNumber,
    } = req.body;

    if (!fullName || !email || !phone || !password || !parkingName || !address || !gstNumber) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, phone, password, parkingName, address and gstNumber are required.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // No manual hashing — userModel's pre("save") hook hashes this automatically.
    const vendor = await User.create({
      fullName,
      email,
      phone,
      password,
      role: "vendor",
      parkingName,
      address,
      gstNumber,
      isVerified: true,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully.",
      vendor: {
        _id: vendor._id,
        fullName: vendor.fullName,
        email: vendor.email,
        phone: vendor.phone,
        parkingName: vendor.parkingName,
        address: vendor.address,
        gstNumber: vendor.gstNumber,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add vendor.",
      error: error.message,
    });
  }
};

// --- Admin: Get All Vendors --------------------------------------
const getAllVendorsAdmin = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" })
      .select("-password -__v -otp -otpExpiry")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalVendors: vendors.length,
      vendors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors.",
      error: error.message,
    });
  }
};

// --- Admin: Get Single Vendor -------------------------------------
const getVendorByIdAdmin = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" })
      .select("-password -__v -otp -otpExpiry");

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // Bonus: also return this vendor's parking listings
    const parkings = await Parking.find({ vendor: vendorId });

    return res.status(200).json({ success: true, vendor, parkings });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor.",
      error: error.message,
    });
  }
};

// --- Admin: Toggle Vendor Active Status ----------------------------
const toggleVendorActive = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findOne({ _id: vendorId, role: "vendor" });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: `Vendor ${vendor.isActive ? "activated" : "deactivated"} successfully.`,
      isActive: vendor.isActive,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle vendor status.",
      error: error.message,
    });
  }
};

// --- Admin: Delete Vendor ---------------------------------------------
const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await User.findOneAndDelete({ _id: vendorId, role: "vendor" });

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }

    // Also remove this vendor's parking listings
    await Parking.deleteMany({ vendor: vendorId });

    return res.status(200).json({ success: true, message: "Vendor and their parkings deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getSubscribedUsers,
  getUserById,
  toggleSubscription,
  toggleActiveStatus,
  deleteUser,
  createVendor,
  getAllVendorsAdmin,
  getVendorByIdAdmin,
  toggleVendorActive,
  deleteVendor,
};