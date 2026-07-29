const Payment = require("../../models/paymentModel/paymentModel");
const Booking = require("../../models/bookingModel/bookingModel");

// CREATE PAYMENT (for a booking)
exports.createPayment = async (req, res, next) => {
  try {
    const { bookingId, amount, method } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId,
      amount,
      method,
      status: "success",
    });

    res.status(201).json({
      success: true,
      message: "Payment successful",
      payment,
    });
  } catch (err) {
    next(err);
  }
};

// GET LOGGED-IN USER'S PAYMENTS
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id }).populate("booking");

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE PAYMENT BY ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (err) {
    next(err);
  }
};