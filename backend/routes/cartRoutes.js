const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");


// ADD TO CART
router.post(
  "/add",
  authMiddleware,
  addToCart
);


// GET CART
router.get(
  "/",
  authMiddleware,
  getCart
);


// UPDATE QUANTITY
router.put(
  "/update",
  authMiddleware,
  updateCartQuantity
);


// REMOVE ITEM
router.delete(
  "/remove",
  authMiddleware,
  removeFromCart
);


// CLEAR CART
router.delete(
  "/clear",
  authMiddleware,
  clearCart
);


module.exports = router;