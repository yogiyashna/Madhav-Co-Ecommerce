const User = require("../model/User");
const Product = require("../model/Product");

// ==========================================
// ADD TO CART
// ==========================================
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const qty = Number(quantity) || 1;

    const itemExists = user.cart.find(
      (item) =>
        item.product.toString() === productId
    );

    if (itemExists) {
      itemExists.quantity += qty;
    } else {
      user.cart.push({
        product: productId,
        quantity: qty,
      });
    }

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cart.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedUser.cart,
    });

  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET CART
// ==========================================
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("cart.product");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });

  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CART QUANTITY
// ==========================================
const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      productId,
      quantity,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const item = user.cart.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const newQuantity = Number(quantity);

    if (newQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    item.quantity = newQuantity;

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate("cart.product");

    res.status(200).json({
      success: true,
      cart: updatedUser.cart,
    });

  } catch (error) {
    console.error(
      "Update Cart Quantity Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// REMOVE FROM CART
// ==========================================
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cart = user.cart.filter(
      (item) =>
        item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart,
    });

  } catch (error) {
    console.error("Remove Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// CLEAR CART
// ==========================================
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cart = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {
    console.error("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};