const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../model/Order");

// ==========================================
// Create Razorpay Order
// ==========================================

const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find our MongoDB order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Amount comes from our database
    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: `receipt_${order._id}`,
    };

    // Create Razorpay order
    const razorpayOrder =
      await razorpay.orders.create(options);

    // Save Razorpay Order ID in MongoDB
    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    res.status(200).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.log("Razorpay Order Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// Verify Razorpay Payment
// ==========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    // Get our MongoDB order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // IMPORTANT:
    // Use Razorpay order ID stored in our DB
    const razorpayOrderId =
      order.razorpayOrderId;

    if (!razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order ID not found",
      });
    }

    // Create signature
    const body =
      razorpayOrderId +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    // Timing-safe comparison
    const expectedBuffer =
      Buffer.from(expectedSignature);

    const receivedBuffer =
      Buffer.from(razorpay_signature);

    const isAuthentic =
      expectedBuffer.length ===
        receivedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Payment verified successfully
    order.isPaid = true;
    order.paidAt = new Date();

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    order.orderStatus = "Processing";

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.log(
      "Payment Verification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createPaymentOrder,
  verifyPayment,
};