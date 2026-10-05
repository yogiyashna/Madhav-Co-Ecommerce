const Product = require("../model/Product");

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
    });

    res.status(201).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products (Search + Filter + Pagination)
const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    const priceFilter = {};

    if (req.query.minPrice) {
      priceFilter.$gte = Number(
        req.query.minPrice
      );
    }

    if (req.query.maxPrice) {
      priceFilter.$lte = Number(
        req.query.maxPrice
      );
    }

    const price =
      Object.keys(priceFilter).length > 0
        ? { price: priceFilter }
        : {};

    const filter = {
      ...keyword,
      ...category,
      ...price,
    };

    const totalProducts =
      await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      count: products.length,
      totalProducts,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Top Selling Products
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ numReviews: -1, rating: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getTopProducts,
  updateProduct,
  deleteProduct,
};