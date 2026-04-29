const Slot = require("../models/slotModel");


// CREATE SLOT (Vendor)
exports.createSlot = async (req, res, next) => {
  try {
    const slot = await Slot.create(req.body);

    res.status(201).json({
      message: "Slot created",
      slot,
    });
  } catch (err) {
    next(err);
  }
};


// GET SLOTS BY PARKING
exports.getSlotsByParking = async (req, res, next) => {
  try {
    const slots = await Slot.find({
      parking: req.params.parkingId,
    });

    res.json(slots);
  } catch (err) {
    next(err);
  }
};