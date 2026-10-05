import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // =====================================================
  // GET USER
  // =====================================================

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );

      return null;
    }
  };

  const user = getUser();

  const userId =
    user?.id ||
    user?._id ||
    user?.userId;

  // =====================================================
  // FETCH WISHLIST
  // =====================================================

  useEffect(() => {
    if (!userId) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      console.log(
        "Fetching wishlist for:",
        userId
      );

      const res = await axios.get(
        `/wishlist/${userId}`
      );

      console.log(
        "WISHLIST RESPONSE:",
        res.data
      );

      setWishlist(
        res.data?.wishlist || []
      );
    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to load wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist = async (
    productId
  ) => {
    try {
      setRemovingId(productId);

      console.log(
        "Removing product:",
        productId
      );

      const res =
        await axios.delete(
          "/wishlist/remove",
          {
            data: {
              userId,
              productId,
            },
          }
        );

      console.log(
        "REMOVE WISHLIST RESPONSE:",
        res.data
      );

      if (res.data?.success) {
        setWishlist((prev) =>
          prev.filter(
            (product) =>
              product._id !== productId
          )
        );
      } else {
        alert(
          res.data?.message ||
            "Failed to remove product"
        );
      }
    } catch (error) {
      console.error(
        "REMOVE WISHLIST ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove product"
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (
    productId
  ) => {
    try {
      console.log(
        "Adding wishlist product to cart:",
        productId
      );

      const res =
        await axios.post(
          "/cart/add",
          {
            userId,
            productId,
            quantity: 1,
          }
        );

      console.log(
        "ADD TO CART RESPONSE:",
        res.data
      );

      if (res.data?.success) {
        alert(
          "Product added to cart 🛒"
        );
      } else {
        alert(
          res.data?.message ||
            "Failed to add product to cart"
        );
      }
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingIcon}>
            ♡
          </div>

          <p style={styles.loadingText}>
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY WISHLIST
  // =====================================================

  if (wishlist.length === 0) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>
            YOUR COLLECTION
          </p>

          <h1 style={styles.title}>
            Wishlist
          </h1>

          <p style={styles.subtitle}>
            Save the pieces you love
            for later.
          </p>
        </div>

        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>
            ♡
          </div>

          <h2 style={styles.emptyTitle}>
            Your wishlist is empty
          </h2>

          <p style={styles.emptyText}>
            You haven't saved any products
            yet. Explore our collection and
            add your favorites here.
          </p>

          <button
            onClick={() =>
              navigate("/collection")
            }
            style={styles.primaryButton}
          >
            Explore Collection
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div style={styles.page}>
      {/* HEADER */}

      <div style={styles.header}>
        <p style={styles.eyebrow}>
          YOUR COLLECTION
        </p>

        <h1 style={styles.title}>
          Wishlist
        </h1>

        <p style={styles.subtitle}>
          Your favorite pieces, saved
          for later.
        </p>
      </div>

      {/* WISHLIST COUNT */}

      <div style={styles.countContainer}>
        <span>
          {wishlist.length}{" "}
          {wishlist.length === 1
            ? "item"
            : "items"}
        </span>
      </div>

      {/* PRODUCTS */}

      <div style={styles.grid}>
        {wishlist.map((product) => (
          <div
            key={product._id}
            style={styles.productCard}
          >
            {/* IMAGE */}

            <div
              style={styles.imageContainer}
            >
              <img
                src={
                  product.images?.[0]
                }
                alt={
                  product.name ||
                  "Product"
                }
                style={styles.image}
              />

              {/* REMOVE */}

              <button
                onClick={() =>
                  removeFromWishlist(
                    product._id
                  )
                }
                disabled={
                  removingId ===
                  product._id
                }
                style={
                  styles.removeButton
                }
                title="Remove from wishlist"
              >
                {removingId ===
                product._id
                  ? "..."
                  : "♡"}
              </button>
            </div>

            {/* PRODUCT INFO */}

            <div
              style={styles.productInfo}
            >
              <h2
                style={
                  styles.productName
                }
              >
                {product.name}
              </h2>

              <p
                style={
                  styles.productPrice
                }
              >
                ₹{" "}
                {Number(
                  product.price || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </p>

              {/* ACTIONS */}

              <div
                style={
                  styles.actions
                }
              >
                <button
                  onClick={() =>
                    addToCart(
                      product._id
                    )
                  }
                  style={
                    styles.cartButton
                  }
                >
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    removeFromWishlist(
                      product._id
                    )
                  }
                  disabled={
                    removingId ===
                    product._id
                  }
                  style={
                    styles.deleteButton
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    minHeight:
      "calc(100vh - 120px)",

    background:
      "#f7f3ed",

    padding:
      "55px 6%",

    color:
      "#2d2118",

    boxSizing:
      "border-box",
  },

  header: {
    textAlign:
      "center",

    marginBottom:
      "35px",
  },

  eyebrow: {
    fontSize:
      "13px",

    letterSpacing:
      "3px",

    color:
      "#b86f3d",

    fontWeight:
      "600",

    margin:
      "0 0 8px",
  },

  title: {
    fontFamily:
      "Georgia, 'Times New Roman', serif",

    fontSize:
      "52px",

    margin:
      "0",

    fontWeight:
      "600",

    color:
      "#2d2118",
  },

  subtitle: {
    color:
      "#77685c",

    fontSize:
      "16px",

    marginTop:
      "10px",
  },

  countContainer: {
    maxWidth:
      "1200px",

    margin:
      "0 auto 20px",

    color:
      "#806f60",

    fontSize:
      "14px",
  },

  grid: {
    maxWidth:
      "1200px",

    margin:
      "0 auto",

    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fill, minmax(250px, 1fr))",

    gap:
      "25px",
  },

  productCard: {
    background:
      "#fffdf9",

    border:
      "1px solid #e2d8cb",

    borderRadius:
      "18px",

    overflow:
      "hidden",

    boxShadow:
      "0 10px 30px rgba(65, 43, 25, 0.06)",
  },

  imageContainer: {
    position:
      "relative",

    height:
      "320px",

    background:
      "#eee6dc",

    overflow:
      "hidden",
  },

  image: {
    width:
      "100%",

    height:
      "100%",

    objectFit:
      "cover",

    display:
      "block",
  },

  removeButton: {
    position:
      "absolute",

    top:
      "15px",

    right:
      "15px",

    width:
      "42px",

    height:
      "42px",

    border:
      "none",

    borderRadius:
      "50%",

    background:
      "rgba(255,255,255,0.92)",

    color:
      "#7a4726",

    fontSize:
      "24px",

    cursor:
      "pointer",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    boxShadow:
      "0 3px 12px rgba(0,0,0,0.1)",
  },

  productInfo: {
    padding:
      "20px",
  },

  productName: {
    fontFamily:
      "Georgia, 'Times New Roman', serif",

    fontSize:
      "20px",

    margin:
      "0 0 8px",

    color:
      "#332319",
  },

  productPrice: {
    margin:
      "0 0 18px",

    fontSize:
      "16px",

    fontWeight:
      "700",

    color:
      "#a96335",
  },

  actions: {
    display:
      "flex",

    gap:
      "10px",
  },

  cartButton: {
    flex:
      "1",

    padding:
      "12px 10px",

    border:
      "none",

    borderRadius:
      "9px",

    background:
      "#713f21",

    color:
      "#fff",

    fontSize:
      "13px",

    fontWeight:
      "700",

    cursor:
      "pointer",
  },

  deleteButton: {
    padding:
      "12px 14px",

    border:
      "1px solid #d9cbbb",

    borderRadius:
      "9px",

    background:
      "#fffdf9",

    color:
      "#745f50",

    fontSize:
      "13px",

    cursor:
      "pointer",
  },

  emptyCard: {
    maxWidth:
      "550px",

    margin:
      "50px auto",

    background:
      "#fffdf9",

    border:
      "1px solid #e2d8cb",

    borderRadius:
      "22px",

    padding:
      "55px 35px",

    textAlign:
      "center",

    boxShadow:
      "0 12px 35px rgba(65, 43, 25, 0.06)",
  },

  emptyIcon: {
    fontSize:
      "60px",

    color:
      "#b86f3d",

    marginBottom:
      "15px",
  },

  emptyTitle: {
    fontFamily:
      "Georgia, 'Times New Roman', serif",

    fontSize:
      "30px",

    margin:
      "0 0 12px",
  },

  emptyText: {
    color:
      "#796b5f",

    lineHeight:
      "1.7",

    marginBottom:
      "25px",
  },

  primaryButton: {
    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "space-between",

    gap:
      "15px",

    padding:
      "15px 20px",

    border:
      "none",

    borderRadius:
      "11px",

    background:
      "#713f21",

    color:
      "#fff",

    fontSize:
      "15px",

    fontWeight:
      "700",

    cursor:
      "pointer",

    width:
      "100%",
  },

  loadingContainer: {
    minHeight:
      "500px",

    display:
      "flex",

    flexDirection:
      "column",

    alignItems:
      "center",

    justifyContent:
      "center",
  },

  loadingIcon: {
    fontSize:
      "45px",

    color:
      "#b86f3d",

    marginBottom:
      "15px",
  },

  loadingText: {
    color:
      "#796b5f",

    fontSize:
      "15px",
  },
};

export default Wishlist;