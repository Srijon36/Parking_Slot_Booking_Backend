const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};