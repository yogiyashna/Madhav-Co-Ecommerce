const express = require("express");
const router = express.Router();

const {
  addReview,
  getReviews,
  getAllReviewsForAdmin,
} = require("../controllers/reviewController");

// ============================================
// CUSTOMER REVIEW
// ============================================

router.post("/", addReview);

// ============================================
// ADMIN - VIEW ALL REVIEWS
// IMPORTANT: Keep this BEFORE /:productId
// ============================================

router.get(
  "/admin/all",
  getAllReviewsForAdmin
);

// ============================================
// GET REVIEWS FOR ONE PRODUCT
// ============================================

router.get(
  "/:productId",
  getReviews
);

module.exports = router;