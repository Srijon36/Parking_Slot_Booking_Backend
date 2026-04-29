const Booking = require("../models/bookingModel");
const Slot = require("../models/slotModel");


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


// CANCEL BOOKING
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    booking.status = "cancelled";
    await booking.save();

    await Slot.findByIdAndUpdate(booking.slot, {
      isBooked: false,
    });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    next(err);
  }
};