const Slot = require("../../models/slotModel/slotModel");

// ================================
// CREATE SLOTS (Vendor)
// ================================
exports.createSlots = async (req, res, next) => {
  try {
    const { parkingId, totalSlots } = req.body;

    if (!parkingId || !totalSlots) {
      return res.status(400).json({
        message: "Parking ID and total slots required",
      });
    }

    let slots = [];

    for (let i = 1; i <= totalSlots; i++) {
      slots.push({
        parking: parkingId,
        slotNumber: `SLOT-${i}`,
      });
    }

    const createdSlots = await Slot.insertMany(slots);

    res.status(201).json({
      message: "Slots created successfully",
      total: createdSlots.length,
      slots: createdSlots,
    });
  } catch (error) {
    next(error);
  }
};



// ================================
// GET ALL SLOTS OF A PARKING
// ================================
exports.getSlotsByParking = async (req, res, next) => {
  try {
    const { parkingId } = req.params;

    const slots = await Slot.find({
      parking: parkingId,
    });

    res.status(200).json({
      totalSlots: slots.length,
      slots,
    });
  } catch (error) {
    next(error);
  }
};



// ================================
// GET AVAILABLE SLOTS
// ================================
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { parkingId } = req.params;

    const slots = await Slot.find({
      parking: parkingId,
      isBooked: false,
    });

    res.status(200).json({
      availableSlots: slots.length,
      slots,
    });
  } catch (error) {
    next(error);
  }
};



// ================================
// BOOK SLOT
// ================================
exports.bookSlot = async (req, res, next) => {
  try {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    slot.isBooked = true;
    await slot.save();

    res.status(200).json({
      message: "Slot booked successfully",
      slot,
    });
  } catch (error) {
    next(error);
  }
};



// ================================
// RELEASE SLOT (Checkout)
// ================================
exports.releaseSlot = async (req, res, next) => {
  try {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    slot.isBooked = false;
    await slot.save();

    res.status(200).json({
      message: "Slot released successfully",
      slot,
    });
  } catch (error) {
    next(error);
  }
};