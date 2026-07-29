const express = require("express");
const router = express.Router();

const {
  createPayment,
  getUserPayments,
  getPaymentById,
} = require("../../controllers/paymentController/paymentController");

const authMiddleware = require("../../middlewares/authMiddleware/authMiddleware");

// CREATE PAYMENT - protected route
router.post("/", authMiddleware, createPayment);

// GET LOGGED-IN USER'S PAYMENTS - protected route
router.get("/my-payments", authMiddleware, getUserPayments);

// GET SINGLE PAYMENT BY ID - protected route
router.get("/:id", authMiddleware, getPaymentById);

module.exports = router;