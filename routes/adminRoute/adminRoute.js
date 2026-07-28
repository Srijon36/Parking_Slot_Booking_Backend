const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/authMiddleware/authMiddleware");
const roleMiddleware  = require("../../middlewares/roleMiddleware/roleMiddleware");

const {
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
} = require("../../controllers/admincontroller/admincontroller");

// ── Everything below requires a valid token AND role === "admin" ──
router.use(authMiddleware, roleMiddleware("admin"));

router.get("/stats",                               getDashboardStats);
router.get("/users",                               getAllUsers);
router.get("/users/verified",                      getSubscribedUsers);
router.get("/users/:userId",                        getUserById);
router.patch("/users/:userId/toggle-verified",      toggleSubscription);
router.patch("/users/:userId/toggle-active",        toggleActiveStatus);
router.delete("/users/:userId",                     deleteUser);

// ── Vendor management (direct-create, no approval flow) ──
router.post("/vendors",                          createVendor);
router.get("/vendors",                           getAllVendorsAdmin);
router.get("/vendors/:vendorId",                 getVendorByIdAdmin);
router.patch("/vendors/:vendorId/toggle-active", toggleVendorActive);
router.delete("/vendors/:vendorId",              deleteVendor);

module.exports = router;