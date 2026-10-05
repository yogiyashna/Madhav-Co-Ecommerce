const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/adminController");

// ==========================================
// ADMIN AUTHORIZATION
// ==========================================

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};

// ==========================================
// USER MANAGEMENT
// ==========================================

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.get(
  "/users/:id",
  protect,
  adminOnly,
  getUserById
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;