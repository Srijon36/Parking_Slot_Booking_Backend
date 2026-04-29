const express = require("express");
const router = express.Router();

const { createLogin} = require("../../controllers/loginController/loginController");

// POST → /api/auth/login
router.post("/login", createLogin);

module.exports = router;