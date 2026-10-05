const Product = require("../model/Product");

// ============================================
// ADD REVIEW
// ============================================

const addReview = async (req, res) => {
  try {
    const {
      productId,
      userId,
      name,
      rating,
      comment,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed = product.reviews.find(
      (review) =>
        review.user.toString() === userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    const review = {
      user: userId,
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added",
    });
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET REVIEWS FOR ONE PRODUCT
// ============================================

const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET ALL REVIEWS FOR ADMIN
// READ ONLY
// ============================================

const getAllReviewsForAdmin = async (req, res) => {
  try {
    const products = await Product.find(
      {
        "reviews.0": { $exists: true },
      },
      {
        name: 1,
        reviews: 1,
      }
    ).sort({ "reviews.createdAt": -1 });

    const reviews = [];

    products.forEach((product) => {
      product.reviews.forEach((review) => {
        reviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          userId: review.user,
          customerName: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    // Newest reviews first
    reviews.sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "GET ALL ADMIN REVIEWS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getReviews,
  getAllReviewsForAdmin,
};