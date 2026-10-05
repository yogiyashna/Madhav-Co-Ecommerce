const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");


// Create Razorpay Order
router.post(
  "/create-order",
  createPaymentOrder
);


// Verify Payment
router.post(
  "/verify",
  verifyPayment
);


module.exports = router;