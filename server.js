const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();


// ======================================
// 🔹 Middleware
// ======================================
app.use(
  cors({
    origin: ["http://localhost:5173"], // React Frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ======================================
// 🔹 MongoDB Connection
// ======================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) =>
    console.log("❌ MongoDB Connection Failed:", err.message)
  );


// ======================================
// 🔹 Import Routes
// ======================================

// AUTH ROUTES
const registerRoutes = require("./routes/registerRoute/registerRoute");
const loginRoutes = require("./routes/loginRoute/loginRoute");
const forgotPasswordRoutes = require(
  "./routes/forgotPasswordRoute/forgotPasswordRoute"
);

// ADMIN ROUTES
const adminRoutes = require("./routes/adminRoute/adminRoute");

// VENDOR ROUTES
const vendorRoutes = require("./routes/vendorRoute/vendorRoute");

// PARKING ROUTES
const parkingRoutes = require("./routes/parkingRoute/parkingRoute");

// SLOT ROUTES
const slotRoutes = require("./routes/slotRoute/slotRoute");

// BOOKING ROUTES
const bookingRoutes = require("./routes/bookingRoute/bookingRoute");

// PAYMENT ROUTES
const paymentRoutes = require("./routes/paymentRoute/paymentRoute");


// ======================================
// 🔹 Use Routes
// ======================================

// AUTH APIs
app.use("/api/auth", registerRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/auth", forgotPasswordRoutes);

// ADMIN APIs
app.use("/api/admin", adminRoutes);

// VENDOR APIs
app.use("/api/vendor", vendorRoutes);

// PARKING APIs
app.use("/api/parking", parkingRoutes);

// SLOT APIs
app.use("/api/slots", slotRoutes);

// BOOKING APIs
app.use("/api/bookings", bookingRoutes);

// PAYMENT APIs
app.use("/api/payment", paymentRoutes);


// ======================================
// 🔹 Health Check Route
// ======================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Parking Slot Booking Backend Running",
  });
});


// ======================================
// 🔹 404 Route Handler
// ======================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});


// ======================================
// 🔹 Global Error Handler
// ======================================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// ======================================
// 🔹 Server Start
// ======================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});