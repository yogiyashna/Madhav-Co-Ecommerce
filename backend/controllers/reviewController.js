const Product = require("../model/Product");

// Add Review
const addReview = async (req, res) => {
  try {
    const {
      productId,
      userId,
      name,
      rating,
      comment,
    } = req.body;

    const product =
      await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (review) =>
          review.user.toString() === userId
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this product",
      });
    }

    const review = {
      user: userId,
      name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) => item.rating + acc,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reviews
const getReviews = async (req, res) => {
  try {
    const product =
      await Product.findById(
        req.params.productId
      );

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getReviews,
};