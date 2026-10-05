import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Handle Image
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    setImage(file);

    const imagePreview = URL.createObjectURL(file);
    setPreview(imagePreview);
  };

  // =========================
  // Add Product
  // =========================

  const addProduct = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select a product image");
      return;
    }

    try {
      setUploading(true);

      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("image", image);

      const uploadRes = await axios.post(
        "/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadRes.data.imageUrl;

      console.log("Cloudinary Image URL:", imageUrl);

      setUploading(false);
      setAdding(true);

      // Create product
      await axios.post(
        "/products",
        {
          name: product.name,
          description: product.description,
          price: Number(product.price),
          category: product.category,
          brand: product.brand,
          stock: Number(product.stock),
          images: [imageUrl],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Added Successfully 🎉");

      navigate("/admin/products");
    } catch (error) {
      console.log("ADD PRODUCT ERROR:", error);

      setUploading(false);
      setAdding(false);

      alert(
        error.response?.data?.message ||
          "Failed To Add Product"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f5f0",
        padding: "55px 7%",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 35px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "20px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#b56d3c",
              fontSize: "13px",
              letterSpacing: "5px",
              fontWeight: "bold",
            }}
          >
            ADMIN PANEL
          </p>

          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: "52px",
              color: "#2d1f18",
              fontWeight: "700",
            }}
          >
            Add Product
          </h1>

          <p
            style={{
              margin: 0,
              color: "#786b63",
              fontSize: "18px",
            }}
          >
            Create and publish a new product to your store.
          </p>
        </div>

        {/* HEADER NAVIGATION */}

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/admin")}
            style={secondaryButtonStyle}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            style={secondaryButtonStyle}
          >
            ← Products
          </button>
        </div>
      </div>

      {/* ================= FORM CARD ================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fffdf9",
          border: "1px solid #eadbca",
          borderRadius: "24px",
          padding: "45px",
          boxShadow:
            "0 15px 40px rgba(70, 45, 30, 0.06)",
        }}
      >
        <form onSubmit={addProduct}>
          {/* ================= SECTION TITLE ================= */}

          <div style={{ marginBottom: "32px" }}>
            <p style={sectionLabelStyle}>
              PRODUCT INFORMATION
            </p>

            <h2 style={sectionTitleStyle}>
              Product Details
            </h2>
          </div>

          {/* ================= NAME ================= */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Product Name
            </label>

            <input
              name="name"
              placeholder="Enter product name"
              value={product.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* ================= DESCRIPTION ================= */}

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe your product..."
              value={product.description}
              onChange={handleChange}
              required
              rows="5"
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "130px",
              }}
            />
          </div>

          {/* ================= PRICE + STOCK ================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "25px",
              marginBottom: "25px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Price
              </label>

              <div style={inputWrapperStyle}>
                <span style={prefixStyle}>₹</span>

                <input
                  name="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={product.price}
                  onChange={handleChange}
                  required
                  style={numberInputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                Stock
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Available quantity"
                value={product.stock}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* ================= CATEGORY + BRAND ================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",
              gap: "25px",
              marginBottom: "35px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Category
              </label>

              <input
                name="category"
                placeholder="e.g. Toys"
                value={product.category}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Brand
              </label>

              <input
                name="brand"
                placeholder="e.g. Gucci"
                value={product.brand}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* ================= IMAGE SECTION ================= */}

          <div
            style={{
              borderTop: "1px solid #eadbca",
              paddingTop: "35px",
            }}
          >
            <p style={sectionLabelStyle}>
              PRODUCT MEDIA
            </p>

            <h2 style={sectionTitleStyle}>
              Product Image
            </h2>

            <p
              style={{
                color: "#85766c",
                marginBottom: "22px",
              }}
            >
              Upload a clear image of your product.
            </p>

            {/* Upload Box */}

            <label
              htmlFor="product-image"
              style={{
                display: "block",
                border: "2px dashed #d9c0aa",
                borderRadius: "18px",
                padding: "38px 25px",
                textAlign: "center",
                background: "#fcf8f3",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "65px",
                  height: "65px",
                  borderRadius: "50%",
                  background: "#f1dfcd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 15px",
                  fontSize: "28px",
                }}
              >
                📷
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#3a2920",
                  fontSize: "20px",
                }}
              >
                {image
                  ? image.name
                  : "Choose Product Image"}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#8b7b70",
                  fontSize: "14px",
                }}
              >
                Click here to browse from your computer
              </p>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#b56d3c",
                  fontSize: "13px",
                }}
              >
                JPG, JPEG, PNG or WEBP
              </p>

              <input
                id="product-image"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                style={{
                  display: "none",
                }}
              />
            </label>

            {/* ================= PREVIEW ================= */}

            {preview && (
              <div
                style={{
                  marginTop: "30px",
                }}
              >
                <p
                  style={{
                    marginBottom: "12px",
                    color: "#6f625a",
                    fontSize: "14px",
                    letterSpacing: "1px",
                  }}
                >
                  IMAGE PREVIEW
                </p>

                <div
                  style={{
                    position: "relative",
                    width: "220px",
                    height: "220px",
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid #e4d4c5",
                    background: "#f5eee7",
                  }}
                >
                  <img
                    src={preview}
                    alt="Product Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================= ACTIONS ================= */}

          <div
            style={{
              marginTop: "40px",
              paddingTop: "30px",
              borderTop: "1px solid #eadbca",
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              disabled={uploading || adding}
              style={secondaryButtonStyle}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading || adding}
              style={{
                padding: "14px 32px",
                border: "none",
                borderRadius: "10px",
                background:
                  uploading || adding
                    ? "#9b7356"
                    : "#7c421f",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                cursor:
                  uploading || adding
                    ? "not-allowed"
                    : "pointer",
                minWidth: "180px",
              }}
            >
              {uploading
                ? "Uploading Image..."
                : adding
                ? "Adding Product..."
                : "Add Product →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   Reusable Styles
========================= */

const sectionLabelStyle = {
  margin: 0,
  color: "#b56d3c",
  fontSize: "12px",
  letterSpacing: "3px",
  fontWeight: "bold",
};

const sectionTitleStyle = {
  margin: "8px 0 0",
  color: "#2d1f18",
  fontSize: "28px",
};

const fieldStyle = {
  marginBottom: "25px",
};

const labelStyle = {
  display: "block",
  marginBottom: "9px",
  color: "#3b2a21",
  fontSize: "16px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  border: "1px solid #dfcfc0",
  borderRadius: "10px",
  background: "#fffdf9",
  color: "#30231d",
  fontSize: "16px",
  fontFamily: "Georgia, serif",
  outline: "none",
};

const inputWrapperStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #dfcfc0",
  borderRadius: "10px",
  background: "#fffdf9",
  overflow: "hidden",
};

const prefixStyle = {
  paddingLeft: "16px",
  color: "#8b5e3c",
  fontSize: "17px",
};

const numberInputStyle = {
  flex: 1,
  minWidth: 0,
  padding: "14px 12px",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#30231d",
  fontSize: "16px",
  fontFamily: "Georgia, serif",
};

const secondaryButtonStyle = {
  padding: "13px 25px",
  border: "1px solid #d9c6b4",
  borderRadius: "10px",
  background: "#fffdf9",
  color: "#75401f",
  fontSize: "16px",
  fontFamily: "Georgia, serif",
  cursor: "pointer",
};

export default AddProduct;