const Booking = require("../../models/bookingModel/bookingModel");
const Slot = require("../../models/slotModel/slotModel");


// BOOK SLOT
exports.createBooking = async (req, res, next) => {
  try {
    const { slotId, startTime, endTime } = req.body;

    const slot = await Slot.findById(slotId);

    if (!slot || slot.isBooked) {
      return res.status(400).json({
        message: "Slot not available",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      slot: slotId,
      parking: slot.parking,
      startTime,
      endTime,
    });

    // mark slot booked
    slot.isBooked = true;
    await slot.save();

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    next(err);
  }
};


// GET LOGGED-IN USER'S BOOKINGS
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("slot")
      .populate("parking");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};


// GET SINGLE BOOKING BY ID
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("slot")
      .populate("parking");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    next(err);
  }
};


// CANCEL BOOKING
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    await Slot.findByIdAndUpdate(booking.slot, {
      isBooked: false,
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (err) {
    next(err);
  }
};