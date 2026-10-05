const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");


// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all categories
router.get("/", getCategories);

// Get single category
router.get("/:id", getCategoryById);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Create category
router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

// Update category
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);


module.exports = router;