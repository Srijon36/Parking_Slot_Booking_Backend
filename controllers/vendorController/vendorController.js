const Parking = require("../../models/parkingModel/parkingModel");
const Slot = require("../../models/slotModel/slotModel");


// ==================================================
// ✅ Create Parking (Vendor)
// ==================================================
exports.createParking = async (req, res, next) => {
  try {
    const {
      parkingName,
      address,
      latitude,
      longitude,
      totalSlots,
      pricePerHour,
    } = req.body;

    const vendorId = req.user.id;

    // Create Parking
    const parking = new Parking({
      vendor: vendorId,
      parkingName,
      address,
      latitude,
      longitude,
      totalSlots,
      pricePerHour,
    });

    await parking.save();

    // ==============================
    // AUTO CREATE SLOTS
    // ==============================
    const slots = [];

    for (let i = 1; i <= totalSlots; i++) {
      slots.push({
        parking: parking._id,
        slotNumber: `SLOT-${i}`,
      });
    }

    await Slot.insertMany(slots);

    res.status(201).json({
      success: true,
      message: "Parking created successfully",
      parking,
    });
  } catch (error) {
    next(error);
  }
};


// ==================================================
// ✅ Get Vendor Parkings
// ==================================================
exports.getVendorParkings = async (req, res, next) => {
  try {
    const vendorId = req.user.id;

    const parkings = await Parking.find({
      vendor: vendorId,
    });

    res.status(200).json({
      success: true,
      totalParkings: parkings.length,
      parkings,
    });
  } catch (error) {
    next(error);
  }
};


// ==================================================
// ✅ Vendor Dashboard Stats
// ==================================================
exports.vendorDashboard = async (req, res, next) => {
  try {
    const vendorId = req.user.id;

    const parkings = await Parking.find({
      vendor: vendorId,
    });

    const parkingIds = parkings.map(p => p._id);

    const totalSlots = await Slot.countDocuments({
      parking: { $in: parkingIds },
    });

    const bookedSlots = await Slot.countDocuments({
      parking: { $in: parkingIds },
      isBooked: true,
    });

    res.status(200).json({
      success: true,
      totalParkings: parkings.length,
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots,
    });

  } catch (error) {
    next(error);
  }
};