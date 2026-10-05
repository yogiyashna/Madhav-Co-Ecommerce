const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// GET LOGGED-IN USER'S ORDERS
// ==========================================
router.get(
  "/my-orders",
  authMiddleware,
  getUserOrders
);

// ==========================================
// CREATE ORDER
// ==========================================
router.post(
  "/",
  authMiddleware,
  createOrder
);

// ==========================================
// ADMIN: GET ALL ORDERS
// ==========================================
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// ==========================================
// ADMIN: GET SINGLE ORDER
// ==========================================
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getOrderById
);

// ==========================================
// ADMIN: UPDATE ORDER STATUS
// ==========================================
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// ==========================================
// ADMIN: DELETE ORDER
// ==========================================
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrder
);

module.exports = router;