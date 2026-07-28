// ─────────────────────────────────────────────────────────────
// Global Error Handling Middleware
// Catches errors passed via next(err) or thrown in async routes
// ─────────────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    err = {
      status: 400,
      message: `Invalid ${err.path}: ${err.value}`,
    };
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    err = {
      status: 400,
      message: messages.join(", "),
    };
  }

  // Handle duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = {
      status: 400,
      message: `${field} already exists.`,
    };
  }

  // Handle invalid JWT
  if (err.name === "JsonWebTokenError") {
    err = {
      status: 401,
      message: "Invalid token. Please log in again.",
    };
  }

  // Handle expired JWT
  if (err.name === "TokenExpiredError") {
    err = {
      status: 401,
      message: "Session expired. Please log in again.",
    };
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;