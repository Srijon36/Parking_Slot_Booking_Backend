const express = require("express");
const router = express.Router();

const { createRegister } = require("../../controllers/registerController/registerController");

// POST → /api/auth/register
router.post("/register", createRegister);

module.exports = router;