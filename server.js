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
    origin: ["http://localhost:5173"], // React frontend
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
    console.log("❌ MongoDB Connection Failed:", err)
  );


// ======================================
// 🔹 Import Routes
// ======================================

// AUTH
const authRegisterRoutes = require("./routes/registerRoute/registerRoute");
const authLoginRoutes = require("./routes/loginRoute/loginRoute");

// SLOT
const slotRoutes = require("./routes/slotRoute/slotRoute");

// (Optional — if created later)
// const parkingRoutes = require("./routes/parkingRoute/parkingRoute");
// const bookingRoutes = require("./routes/bookingRoute/bookingRoute");


// ======================================
// 🔹 Use Routes
// ======================================

// Auth APIs
app.use("/api/auth", authRegisterRoutes);
app.use("/api/auth", authLoginRoutes);

// Slot APIs
app.use("/api/slots", slotRoutes);

// Future APIs
// app.use("/api/parking", parkingRoutes);
// app.use("/api/booking", bookingRoutes);


// ======================================
// 🔹 Health Check
// ======================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully 🚀",
  });
});


// ======================================
// 🔹 Global Error Handler
// ======================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

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