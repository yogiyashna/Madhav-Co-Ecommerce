const express = require("express");

const router = express.Router();

const {
  dashboardStats,
} = require("../controllers/adminController");

router.get("/dashboard", dashboardStats);

module.exports = router;