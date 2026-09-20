const mongoose = require("mongoose");
const Parking = require('../../models/parkingModel/parkingModel');

// CREATE PARKING (Vendor only)
exports.createParking = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.role !== "vendor") {
      return res.status(403).json({
        message: "Only vendors can create parking",
      });
    }

    const parking = await Parking.create({
      ...req.body,
      vendor: user.id,
    });

    res.status(201).json({
      message: "Parking created successfully",
      parking,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL PARKINGS
exports.getAllParkings = async (req, res, next) => {
  try {
    const parkings = await Parking.find().populate(
      "vendor",
      "fullName email"
    );

    res.json(parkings);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE PARKING
exports.getParkingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let parking = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      parking = await Parking.findById(id).populate(
        "vendor",
        "fullName email"
      );
    } else {
      // Support name / slug lookup (e.g. "downtown-central" -> "Downtown Central")
      const nameQuery = id.replace(/[-_]/g, " ");
      parking = await Parking.findOne({
        parkingName: { $regex: new RegExp(`^${nameQuery}$`, "i") },
      }).populate("vendor", "fullName email");
    }

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking not found",
      });
    }

    res.json(parking);
  } catch (err) {
    next(err);
  }
};