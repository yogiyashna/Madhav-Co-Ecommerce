import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  // ==========================
  // CHECK LOGIN
  // ==========================

  const user = JSON.parse(localStorage.getItem("user"));

  // ==========================
  // FETCH CART
  // ==========================

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");

      setCart(res.data.cart || []);
    } catch (error) {
      console.log(
        "Fetch Cart Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================
  // INCREASE QUANTITY
  // ==========================

  const increaseQty = async (productId, quantity) => {
    try {
      await axios.put("/cart/update", {
        productId,
        quantity: quantity + 1,
      });

      fetchCart();
    } catch (error) {
      console.log(
        "Increase Quantity Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================
  // DECREASE QUANTITY
  // ==========================

  const decreaseQty = async (productId, quantity) => {
    if (quantity === 1) return;

    try {
      await axios.put("/cart/update", {
        productId,
        quantity: quantity - 1,
      });

      fetchCart();
    } catch (error) {
      console.log(
        "Decrease Quantity Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const removeItem = async (productId) => {
    try {
      await axios.delete("/cart/remove", {
        data: {
          productId,
        },
      });

      fetchCart();
    } catch (error) {
      console.log(
        "Remove Item Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================
  // CALCULATIONS
  // ==========================

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (acc, item) =>
      acc + item.product.price * item.quantity,
    0
  );

  // ==========================
  // NOT LOGGED IN
  // ==========================

  if (!user) {
    return (
      <div
        style={{
          minHeight: "75vh",
          background: "#f7f3ed",
          padding: "60px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
            background: "#fffdf9",
            border: "1px solid #ded4c6",
            borderRadius: "20px",
            padding: "80px 30px",
            boxShadow:
              "0 10px 35px rgba(70, 50, 30, 0.06)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            🔐
          </div>

          <h1
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              color: "#2d2118",
              fontSize: "42px",
              margin: "0 0 12px",
            }}
          >
            Please Login
          </h1>

          <p
            style={{
              color: "#74695f",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            Please login to view your shopping cart.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={shopButtonStyle}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // EMPTY CART
  // ==========================

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight: "75vh",
          background: "#f7f3ed",
          padding: "60px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
            background: "#fffdf9",
            border: "1px solid #ded4c6",
            borderRadius: "20px",
            padding: "80px 30px",
            boxShadow:
              "0 10px 35px rgba(70, 50, 30, 0.06)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "15px",
            }}
          >
            🛒
          </div>

          <h1
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              color: "#2d2118",
              fontSize: "42px",
              margin: "0 0 12px",
            }}
          >
            Your Cart is Empty
          </h1>

          <p
            style={{
              color: "#74695f",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            Looks like you haven't added anything yet.
          </p>

          <button
            onClick={() => navigate("/collection")}
            style={shopButtonStyle}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // MAIN CART
  // ==========================

  return (
    <div
      style={{
        minHeight: "75vh",
        background: "#f7f3ed",
        padding: "45px 24px 70px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        {/* ==========================
            HEADER
        ========================== */}

        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <p
            style={{
              color: "#b87545",
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "2px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            Your Selection
          </p>

          <h1
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              fontSize: "48px",
              fontWeight: "600",
              color: "#2d2118",
              margin: 0,
            }}
          >
            Shopping Cart
          </h1>

          <p
            style={{
              color: "#74695f",
              fontSize: "15px",
              marginTop: "10px",
            }}
          >
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>

        {/* ==========================
            CART LAYOUT
        ========================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 350px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* ==========================
              PRODUCTS
          ========================== */}

          <div>
            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  background: "#fffdf9",
                  border: "1px solid #ded4c6",
                  borderRadius: "18px",
                  padding: "22px",
                  marginBottom: "18px",
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  boxShadow:
                    "0 6px 25px rgba(70, 50, 30, 0.05)",
                }}
              >
                {/* PRODUCT IMAGE */}

                <div
                  style={{
                    width: "170px",
                    height: "200px",
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRadius: "14px",
                    background: "#f1ebe3",
                  }}
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* PRODUCT INFO */}

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                          color: "#2d2118",
                          fontSize: "25px",
                          margin: "0 0 8px",
                          fontWeight: "600",
                        }}
                      >
                        {item.product.name}
                      </h2>

                      <p
                        style={{
                          color: "#74695f",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          margin: "0 0 12px",
                        }}
                      >
                        {item.product.description}
                      </p>
                    </div>

                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        removeItem(item.product._id)
                      }
                      title="Remove item"
                      style={{
                        border: "none",
                        background: "transparent",
                        color: "#9a6b50",
                        cursor: "pointer",
                        fontSize: "13px",
                        padding: "5px",
                        height: "30px",
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  {/* PRICE */}

                  <p
                    style={{
                      color: "#b87545",
                      fontSize: "20px",
                      fontWeight: "600",
                      margin: "12px 0 18px",
                    }}
                  >
                    ₹{" "}
                    {item.product.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {/* BOTTOM ROW */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* QUANTITY */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #d8cbbd",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() =>
                          decreaseQty(
                            item.product._id,
                            item.quantity
                          )
                        }
                        style={quantityButtonStyle}
                      >
                        −
                      </button>

                      <span
                        style={{
                          width: "42px",
                          textAlign: "center",
                          color: "#2d2118",
                          fontWeight: "600",
                          fontSize: "15px",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.product._id,
                            item.quantity
                          )
                        }
                        style={quantityButtonStyle}
                      >
                        +
                      </button>
                    </div>

                    {/* SUBTOTAL */}

                    <div
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          color: "#8a7d70",
                          fontSize: "12px",
                          marginBottom: "4px",
                        }}
                      >
                        Subtotal
                      </span>

                      <strong
                        style={{
                          color: "#2d2118",
                          fontSize: "19px",
                        }}
                      >
                        ₹{" "}
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==========================
              ORDER SUMMARY
          ========================== */}

          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #ded4c6",
              borderRadius: "18px",
              padding: "28px",
              boxShadow:
                "0 8px 30px rgba(70, 50, 30, 0.06)",
              position: "sticky",
              top: "110px",
            }}
          >
            <h2
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                color: "#2d2118",
                fontSize: "27px",
                margin: "0 0 25px",
              }}
            >
              Order Summary
            </h2>

            {/* ITEMS */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#74695f",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            {/* SUBTOTAL */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#74695f",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            >
              <span>Subtotal</span>

              <span>
                ₹ {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* SHIPPING */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#74695f",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              <span>Shipping</span>

              <span
                style={{
                  color: "#5f7b58",
                  fontWeight: "600",
                }}
              >
                FREE
              </span>
            </div>

            <div
              style={{
                height: "1px",
                background: "#ded4c6",
                margin: "20px 0",
              }}
            />

            {/* TOTAL */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <span
                style={{
                  color: "#2d2118",
                  fontSize: "17px",
                  fontWeight: "600",
                }}
              >
                Total
              </span>

              <span
                style={{
                  color: "#b87545",
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                ₹ {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* CHECKOUT */}

            <button
              onClick={() => navigate("/checkout")}
              style={checkoutButtonStyle}
            >
              Proceed to Checkout

              <span style={{ fontSize: "18px" }}>
                →
              </span>
            </button>

            {/* CONTINUE SHOPPING */}

            <button
              onClick={() => navigate("/collection")}
              style={continueButtonStyle}
            >
              Continue Shopping
            </button>

            {/* NOTE */}

            <p
              style={{
                textAlign: "center",
                color: "#8a7d70",
                fontSize: "11px",
                lineHeight: "1.5",
                marginTop: "20px",
              }}
            >
              Secure checkout · Easy returns · Quality
              products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================
// STYLES
// ==========================

const quantityButtonStyle = {
  width: "38px",
  height: "36px",
  border: "none",
  background: "#f1ebe3",
  color: "#5e554d",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const checkoutButtonStyle = {
  width: "100%",
  padding: "15px 18px",
  border: "none",
  borderRadius: "9px",
  background: "#6b3f21",
  color: "#fffdf9",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const continueButtonStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "10px",
  border: "1px solid #cdbdaa",
  borderRadius: "9px",
  background: "transparent",
  color: "#5e554d",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
};

const shopButtonStyle = {
  padding: "14px 25px",
  border: "none",
  borderRadius: "9px",
  background: "#6b3f21",
  color: "#fffdf9",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default Cart;