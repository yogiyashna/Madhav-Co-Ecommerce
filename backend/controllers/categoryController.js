const Category = require("../model/Category");

// ==========================================
// CREATE CATEGORY
// ==========================================

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();

    // Case-insensitive duplicate check
    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${trimmedName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: trimmedName,
      description: description?.trim() || "",
      image: image?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    // Duplicate key protection
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL CATEGORIES
// ==========================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};


// ==========================================
// GET SINGLE CATEGORY
// ==========================================

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};


// ==========================================
// UPDATE CATEGORY
// ==========================================

const updateCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();

    // Check whether category exists
    const existingCategory = await Category.findById(
      req.params.id
    );

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check duplicate name excluding current category
    const duplicateCategory = await Category.findOne({
      _id: { $ne: req.params.id },
      name: {
        $regex: `^${trimmedName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        )}$`,
        $options: "i",
      },
    });

    if (duplicateCategory) {
      return res.status(400).json({
        success: false,
        message: "Another category with this name already exists",
      });
    }

    existingCategory.name = trimmedName;

    existingCategory.description =
      description?.trim() || "";

    existingCategory.image =
      image?.trim() || "";

    await existingCategory.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: existingCategory,
    });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// DELETE CATEGORY
// ==========================================

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};