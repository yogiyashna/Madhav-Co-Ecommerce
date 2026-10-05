import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Products
  // =========================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "/products?limit=100"
      );

      setProducts(res.data.products || []);
    } catch (error) {
      console.log("FETCH PRODUCTS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete Product
  // =========================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product Deleted Successfully");

      fetchProducts();
    } catch (error) {
      console.log(
        "DELETE PRODUCT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  // =========================
  // Navigate to Add Product
  // =========================

  const goToAddProduct = () => {
    navigate("/admin/add-product");
  };

  // =========================
  // Navigate to Edit Product
  // =========================

  const goToEditProduct = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f5f0",
        padding: "55px 3%",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "20px",
          }}
        >
          {/* LEFT SIDE */}

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
              Products
            </h1>

            <p
              style={{
                margin: 0,
                color: "#786b63",
                fontSize: "18px",
              }}
            >
              Manage your store products.
            </p>
          </div>

          {/* RIGHT SIDE BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            {/* DASHBOARD BUTTON */}

            <button
              type="button"
              onClick={() => navigate("/admin")}
              style={{
                padding: "14px 25px",
                border: "1px solid #d9c6b4",
                borderRadius: "10px",
                background: "#fffdf9",
                color: "#75401f",
                fontSize: "16px",
                fontWeight: "500",
                fontFamily: "Georgia, serif",
                cursor: "pointer",
              }}
            >
              ← Dashboard
            </button>

            {/* ADD PRODUCT BUTTON */}

            <button
              type="button"
              onClick={goToAddProduct}
              style={{
                padding: "15px 27px",
                border: "none",
                borderRadius: "10px",
                background: "#7c421f",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "bold",
                fontFamily: "Georgia, serif",
                cursor: "pointer",
              }}
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* ================= PRODUCT COUNT ================= */}

        <div
          style={{
            marginTop: "55px",
            marginBottom: "30px",
            padding: "22px 30px",
            background: "#edd4b9",
            borderRadius: "18px",
            color: "#2d1f18",
            fontSize: "17px",
          }}
        >
          <strong>{products.length}</strong>{" "}
          {products.length === 1
            ? "product"
            : "products"}{" "}
          in your store
        </div>

        {/* ================= PRODUCTS TABLE ================= */}

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow:
              "0 12px 35px rgba(70, 45, 30, 0.06)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            {/* TABLE HEADER */}

            <thead>
              <tr
                style={{
                  background: "#f2e4d3",
                  color: "#3b2a21",
                }}
              >
                <th style={thStyle}>
                  Image
                </th>

                <th style={thStyle}>
                  Product
                </th>

                <th style={thStyle}>
                  Category
                </th>

                <th style={thStyle}>
                  Price
                </th>

                <th style={thStyle}>
                  Stock
                </th>

                <th style={thStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color: "#786b63",
                      fontSize: "17px",
                    }}
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color: "#786b63",
                      fontSize: "17px",
                    }}
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    style={{
                      borderTop:
                        "1px solid #eee3d8",
                    }}
                  >
                    {/* IMAGE */}

                    <td style={tdStyle}>
                      <img
                        src={
                          product.images?.[0]
                        }
                        alt={product.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          border:
                            "1px solid #e3d3c3",
                        }}
                      />
                    </td>

                    {/* PRODUCT */}

                    <td style={tdStyle}>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#2d1f18",
                          marginBottom: "5px",
                        }}
                      >
                        {product.name}
                      </div>

                      <div
                        style={{
                          color: "#786b63",
                          fontSize: "15px",
                        }}
                      >
                        {product.brand}
                      </div>
                    </td>

                    {/* CATEGORY */}

                    <td style={tdStyle}>
                      <span
                        style={{
                          color: "#3b2a21",
                          fontSize: "16px",
                        }}
                      >
                        {typeof product.category ===
                        "object"
                          ? product.category?.name
                          : product.category}
                      </span>
                    </td>

                    {/* PRICE */}

                    <td style={tdStyle}>
                      <strong
                        style={{
                          fontSize: "18px",
                          color: "#2d1f18",
                        }}
                      >
                        ₹{" "}
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* STOCK */}

                    <td style={tdStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "9px 15px",
                          borderRadius: "20px",
                          background:
                            product.stock > 0
                              ? "#e5f4ea"
                              : "#fbe4e4",
                          color:
                            product.stock > 0
                              ? "#277344"
                              : "#b33a3a",
                          fontWeight: "bold",
                        }}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            goToEditProduct(
                              product._id
                            )
                          }
                          style={{
                            padding:
                              "10px 22px",
                            border:
                              "1px solid #d7a879",
                            borderRadius:
                              "9px",
                            background:
                              "#fffdf9",
                            color:
                              "#75401f",
                            fontSize:
                              "16px",
                            fontWeight:
                              "bold",
                            fontFamily:
                              "Georgia, serif",
                            cursor:
                              "pointer",
                          }}
                        >
                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(
                              product._id
                            )
                          }
                          style={{
                            padding:
                              "10px 22px",
                            border:
                              "1px solid #e6a4a4",
                            borderRadius:
                              "9px",
                            background:
                              "#fffdf9",
                            color:
                              "#b52e2e",
                            fontSize:
                              "16px",
                            fontFamily:
                              "Georgia, serif",
                            cursor:
                              "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================
// Table Styles
// =========================

const thStyle = {
  padding: "20px 18px",
  textAlign: "left",
  fontSize: "16px",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "18px",
  verticalAlign: "middle",
};

export default AdminProducts;