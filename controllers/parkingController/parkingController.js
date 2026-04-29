const Parking = require("../models/parkingModel");


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
    const parking = await Parking.findById(req.params.id);

    res.json(parking);
  } catch (err) {
    next(err);
  }
};