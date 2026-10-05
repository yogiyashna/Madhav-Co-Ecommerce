const User = require("../model/User");
const Product = require("../model/Product");
const Order = require("../model/Order");

const dashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (acc, order) =>
        acc + order.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  dashboardStats,
};