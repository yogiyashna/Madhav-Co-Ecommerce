import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

import "./AdminCategories.css";

const AdminCategories = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  // ============================
  // STATE
  // ============================

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ============================
  // ACCESS CONTROL
  // ============================

  if (!user || user.role !== "admin") {
    return (
      <div className="category-access-denied">
        <div className="category-access-card">
          <div className="category-access-icon">🔒</div>

          <p className="category-admin-label">
            MADHAV & CO.
          </p>

          <h1>Access Denied</h1>

          <p>
            Only administrators can manage categories.
          </p>

          <button
            onClick={() => navigate("/")}
            className="category-primary-btn"
          >
            Back To Store
          </button>
        </div>
      </div>
    );
  }

  // ============================
  // FETCH CATEGORIES
  // ============================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/categories");

      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("FETCH CATEGORIES ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // HANDLE INPUT
  // ============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // HANDLE IMAGE
  // ============================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    // Optional 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5 MB.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // ============================
  // OPEN ADD FORM
  // ============================

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      image: "",
    });

    setImageFile(null);
    setImagePreview("");

    setShowForm(true);
  };

  // ============================
  // OPEN EDIT FORM
  // ============================

  const openEditForm = (category) => {
    setEditingId(category._id);

    setFormData({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });

    setImageFile(null);
    setImagePreview(category.image || "");

    setShowForm(true);
  };

  // ============================
  // CLOSE FORM
  // ============================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      image: "",
    });

    setImageFile(null);
    setImagePreview("");
    setUploading(false);
  };

  // ============================
  // UPLOAD IMAGE
  // ============================

  const uploadImage = async () => {
    if (!imageFile) {
      return formData.image || "";
    }

    try {
      setUploading(true);

      const uploadData = new FormData();

      uploadData.append("image", imageFile);

      const response = await axios.post(
        "/upload",
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.imageUrl;

      if (!imageUrl) {
        throw new Error("Image URL was not returned.");
      }

      return imageUrl;
    } finally {
      setUploading(false);
    }
  };

  // ============================
  // CREATE / UPDATE CATEGORY
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter category name.");
      return;
    }

    try {
      setSaving(true);

      // Upload selected image first
      const imageUrl = await uploadImage();

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imageUrl,
      };

      if (editingId) {
        await axios.put(
          `/categories/${editingId}`,
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Category updated successfully.");
      } else {
        await axios.post(
          "/categories",
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Category created successfully.");
      }

      closeForm();

      await fetchCategories();
    } catch (error) {
      console.error(
        "SAVE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  // ============================
  // DELETE CATEGORY
  // ============================

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category deleted successfully.");

      await fetchCategories();
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  // ============================
  // SEARCH
  // ============================

  const searchText = search.toLowerCase().trim();

  const filteredCategories = categories.filter(
    (category) => {
      if (!searchText) return true;

      const name =
        category.name?.toLowerCase().trim() || "";

      const description =
        category.description?.toLowerCase().trim() || "";

      /*
        startsWith() prevents:

        "men" -> "women"

        because:

        "women".startsWith("men") === false

        while:

        "men".startsWith("men") === true
      */

      return (
        name.startsWith(searchText) ||
        description.includes(searchText)
      );
    }
  );

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="categories-spinner"></div>

        <p>Loading categories...</p>
      </div>
    );
  }

  // ============================
  // PAGE
  // ============================

  return (
    <div className="admin-categories-page">

      {/* =========================
          MAIN
      ========================= */}

      <main className="categories-main">

        {/* =========================
            TOP BAR
        ========================= */}

        <header className="categories-topbar">

          <div>
            <p className="categories-top-label">
              ADMINISTRATION
            </p>

            <h1>Categories</h1>
          </div>

          {/* DASHBOARD BUTTON */}

          <button
            className="categories-dashboard-btn"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Dashboard
          </button>

        </header>

        {/* =========================
            INTRO
        ========================= */}

        <section className="categories-intro">

          <div>
            <p>CATEGORY MANAGEMENT</p>

            <h2>
              Organize Your Store
            </h2>

            <span>
              Create and manage product
              categories for your store.
            </span>
          </div>

          <button
            className="add-category-btn"
            onClick={openAddForm}
          >
            ＋ Add Category
          </button>

        </section>

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="category-stats">

          <div className="category-stat-card">

            <div className="category-stat-icon">
              ◇
            </div>

            <div>
              <span>
                Total Categories
              </span>

              <strong>
                {categories.length}
              </strong>

              <small>
                Categories in store
              </small>
            </div>

          </div>

          <div className="category-stat-card">

            <div className="category-stat-icon">
              ✓
            </div>

            <div>
              <span>
                Active Categories
              </span>

              <strong>
                {categories.length}
              </strong>

              <small>
                Currently available
              </small>
            </div>

          </div>

        </section>

        {/* =========================
            CATEGORY LIST
        ========================= */}

        <section className="categories-section">

          <div className="categories-section-header">

            <div>
              <p>CATEGORY LIST</p>

              <h2>
                All Categories
              </h2>
            </div>

            {/* SEARCH */}

            <div className="category-search-wrapper">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

          </div>

          {/* SEARCH RESULT INFO */}

          {search && (
            <p className="category-search-result">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1
                ? "category"
                : "categories"}{" "}
              found for "{search}"
            </p>
          )}

          {/* =========================
              EMPTY
          ========================= */}

          {filteredCategories.length === 0 ? (

            <div className="categories-empty">

              <div className="empty-icon">
                ◇
              </div>

              <h3>
                No categories found
              </h3>

              <p>
                {search
                  ? `No category matches "${search}".`
                  : "Create your first category."}
              </p>

              {!search && (
                <button
                  onClick={openAddForm}
                  className="empty-add-btn"
                >
                  ＋ Add Category
                </button>
              )}

            </div>

          ) : (

            <div className="categories-grid">

              {filteredCategories.map(
                (category) => (

                  <div
                    className="category-card"
                    key={category._id}
                  >

                    {/* IMAGE */}

                    <div className="category-image">

                      {category.image ? (

                        <img
                          src={category.image}
                          alt={category.name}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";

                            const placeholder =
                              e.currentTarget
                                .nextElementSibling;

                            if (placeholder) {
                              placeholder.style.display =
                                "flex";
                            }
                          }}
                        />

                      ) : null}

                      <div
                        className="category-image-placeholder"
                        style={{
                          display:
                            category.image
                              ? "none"
                              : "flex",
                        }}
                      >
                        ◇
                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="category-card-content">

                      <div className="category-card-title-row">

                        <h3>
                          {category.name}
                        </h3>

                        <span className="category-status">
                          Active
                        </span>

                      </div>

                      <p>
                        {category.description ||
                          "No description added."}
                      </p>

                      <small>
                        Created{" "}
                        {category.createdAt
                          ? new Date(
                              category.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </small>

                    </div>

                    {/* ACTIONS */}

                    <div className="category-actions">

                      <button
                        className="edit-category-btn"
                        onClick={() =>
                          openEditForm(category)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-category-btn"
                        onClick={() =>
                          deleteCategory(
                            category._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (

        <div
          className="category-modal-overlay"
          onClick={closeForm}
        >

          <div
            className="category-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="category-modal-header">

              <div>

                <p>
                  {editingId
                    ? "EDIT CATEGORY"
                    : "NEW CATEGORY"}
                </p>

                <h2>
                  {editingId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

              </div>

              <button
                className="modal-close-btn"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="category-form"
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Men"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />

              </div>

              {/* IMAGE UPLOAD */}

              <div className="form-group">

                <label>
                  Category Image
                </label>

                <label
                  htmlFor="category-image"
                  className="category-upload-box"
                >

                  <div className="category-upload-icon">
                    📷
                  </div>

                  <strong>
                    {imageFile
                      ? imageFile.name
                      : "Choose Category Image"}
                  </strong>

                  <span>
                    Click here to browse from your computer
                  </span>

                  <small>
                    JPG, JPEG, PNG or WEBP • Max 5 MB
                  </small>

                </label>

                <input
                  id="category-image"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="category-file-input"
                />

              </div>

              {/* IMAGE PREVIEW */}

              {imagePreview && (

                <div className="category-preview">

                  <p>IMAGE PREVIEW</p>

                  <div className="category-preview-image">

                    <img
                      src={imagePreview}
                      alt="Category preview"
                    />

                  </div>

                </div>

              )}

              {/* ACTIONS */}

              <div className="category-form-actions">

                <button
                  type="button"
                  className="cancel-category-btn"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-category-btn"
                  disabled={saving}
                >
                  {uploading
                    ? "Uploading Image..."
                    : saving
                    ? "Saving..."
                    : editingId
                    ? "Update Category"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminCategories;