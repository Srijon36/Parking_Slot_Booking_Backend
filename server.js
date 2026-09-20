const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// 🔹 CORS config
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Failed:", err.message));

// 🔹 Import Routes
const registerRoutes        = require("./routes/registerRoute/registerRoute");
const loginRoutes           = require("./routes/loginRoute/loginRoute");
const forgotPasswordRoutes  = require("./routes/forgotPasswordRoute/forgotPasswordRoute");
const adminRoutes           = require("./routes/adminRoute/adminRoute");
const vendorRoutes          = require("./routes/vendorRoute/vendorRoute");
const parkingRoutes         = require("./routes/parkingRoute/parkingRoute");
const slotRoutes            = require("./routes/slotRoute/slotRoute");
const bookingRoutes         = require("./routes/bookingRoute/bookingRoute");
const paymentRoutes         = require("./routes/paymentRoute/paymentRoute");

// 🔹 Import Middlewares
const errorHandler = require("./middlewares/errorHandler/errorHandler");

// 🔹 Use Routes
app.use("/api/auth",    registerRoutes);
app.use("/api/auth",    loginRoutes);
app.use("/api/auth",    forgotPasswordRoutes);
app.use("/api/admin",   adminRoutes);
app.use("/api/vendor",  vendorRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/slots",   slotRoutes);
app.use("/api/booking",  bookingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);

// 🔹 Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Parking Slot Booking Backend Running",
  });
});

// 🔹 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// 🔹 Global Error Handler
app.use(errorHandler);

// 🔹 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});