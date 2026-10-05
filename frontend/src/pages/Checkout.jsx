import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  const user = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch (error) {
      console.error(
        "Invalid user data in localStorage:",
        error
      );

      return null;
    }
  })();

  // Support different user object formats
  const userId =
    user?.id ||
    user?._id ||
    user?.userId;

  // =====================================================
  // FETCH CART
  // =====================================================

  useEffect(() => {
    if (!userId) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      console.log(
        "===================================="
      );
      console.log(
        "       CHECKOUT CART DEBUG"
      );
      console.log(
        "===================================="
      );

      console.log("Logged in user:", user);
      console.log("User ID:", userId);
      console.log(
        "Request:",
        `/cart/${userId}`
      );

      const res = await axios.get("/cart");

      console.log(
        "Cart Status:",
        res.status
      );

      console.log(
        "Cart Response:",
        res.data
      );

      console.log(
        "Cart Items:",
        res.data?.cart
      );

      setCart(res.data?.cart || []);
    } catch (error) {
      console.error(
        "===================================="
      );

      console.error(
        "          CART ERROR"
      );

      console.error(
        "===================================="
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "URL:",
        error.config?.url
      );

      console.error(
        "Full Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to load cart (${
            error.response?.status ||
            "Network Error"
          })`
      );
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // CALCULATIONS
  // =====================================================

  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => {
      const price = Number(
        item.product?.price || 0
      );

      const quantity = Number(
        item.quantity || 0
      );

      return total + price * quantity;
    },
    0
  );

  const shipping = 0;

  const finalTotal =
    totalPrice + shipping;

  // =====================================================
  // LOAD RAZORPAY
  // =====================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =====================================================
  // CREATE ORDER
  // =====================================================

  const createOrder = async () => {
    try {
      if (!cart.length) {
        throw new Error(
          "Cart is empty"
        );
      }

      const orderItems = cart.map(
        (item) => ({
          product:
            item.product?._id,

          quantity:
            Number(item.quantity),

          price:
            Number(
              item.product?.price || 0
            ),
        })
      );

      const orderData = {
        user: userId,

        orderItems,

        shippingAddress: {
          fullName:
            formData.fullName,

          phone:
            formData.phone,

          street:
            formData.street,

          city:
            formData.city,

          state:
            formData.state,

          pincode:
            formData.pincode,

          country:
            formData.country,
        },

        paymentMethod,

        totalPrice:
          finalTotal,

        orderStatus:
          "Pending",

        isPaid:
          paymentMethod ===
          "COD",
      };

      console.log(
        "===================================="
      );

      console.log(
        "        CREATING ORDER"
      );

      console.log(
        "===================================="
      );

      console.log(
        "Order Data:",
        orderData
      );

      const res =
        await axios.post(
          "/orders",
          orderData
        );

      console.log(
        "ORDER RESPONSE:",
        res.data
      );

      if (!res.data?.order) {
        throw new Error(
          res.data?.message ||
            "Order was not created"
        );
      }

      return res.data.order;
    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    try {
      console.log(
        "Clearing cart for:",
        userId
      );

      const res =
        await axios.delete("/cart/clear");

      console.log(
        "CLEAR CART RESPONSE:",
        res.data
      );

      setCart([]);

      return true;
    } catch (error) {
      console.error(
        "CLEAR CART ERROR:",
        error.response?.data ||
          error.message
      );

      return false;
    }
  };

  // =====================================================
  // COD
  // =====================================================

  const handleCOD = async () => {
    const order =
      await createOrder();

    if (!order) {
      throw new Error(
        "Order creation failed"
      );
    }

    await clearCart();

    alert(
      "Order Placed Successfully 🎉"
    );

    navigate("/orders");
  };

  // =====================================================
  // RAZORPAY
  // =====================================================

  const handleRazorpay = async () => {
    const isLoaded =
      await loadRazorpayScript();

    if (!isLoaded) {
      alert(
        "Razorpay SDK failed to load. Please check your internet connection."
      );

      setLoading(false);
      return;
    }

    // ---------------------------------------------
    // Create MongoDB order
    // ---------------------------------------------

    const order =
      await createOrder();

    if (!order) {
      alert(
        "Failed to create order"
      );

      setLoading(false);
      return;
    }

    console.log(
      "MongoDB Order:",
      order
    );

    // ---------------------------------------------
    // Create Razorpay order
    // ---------------------------------------------

    const razorpayRes =
      await axios.post(
        "/payments/create-order",
        {
          orderId:
            order._id,
        }
      );

    console.log(
      "Razorpay Order Response:",
      razorpayRes.data
    );

    if (
      !razorpayRes.data?.success
    ) {
      alert(
        razorpayRes.data?.message ||
          "Failed to create Razorpay order"
      );

      setLoading(false);
      return;
    }

    const razorpayOrder =
      razorpayRes.data.order;

    // ---------------------------------------------
    // Razorpay options
    // ---------------------------------------------

    const options = {
      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      name:
        "Madhav & Co.",

      description:
        "E-Commerce Order",

      order_id:
        razorpayOrder.id,

      prefill: {
        name:
          formData.fullName,

        email:
          user?.email || "",

        contact:
          formData.phone,
      },

      theme: {
        color: "#7A4726",
      },

      handler:
        async function (
          response
        ) {
          try {
            console.log(
              "Razorpay Response:",
              response
            );

            // -----------------------------------
            // VERIFY PAYMENT
            // -----------------------------------

            const verifyRes =
              await axios.post(
                "/payments/verify",
                {
                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                  orderId:
                    order._id,
                }
              );

            console.log(
              "Payment Verification:",
              verifyRes.data
            );

            if (
              verifyRes.data?.success
            ) {
              await clearCart();

              alert(
                "Payment Successful 🎉\nOrder Confirmed!"
              );

              navigate(
                "/orders"
              );
            } else {
              alert(
                verifyRes.data
                  ?.message ||
                  "Payment verification failed"
              );

              setLoading(false);
            }
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error.response?.data ||
                error.message
            );

            alert(
              error.response?.data
                ?.message ||
                "Payment verification failed"
            );

            setLoading(false);
          }
        },

      modal: {
        ondismiss:
          function () {
            setLoading(false);

            console.log(
              "Razorpay payment cancelled"
            );
          },
      },
    };

    // ---------------------------------------------
    // OPEN RAZORPAY
    // ---------------------------------------------

    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.on(
      "payment.failed",
      function (response) {
        console.error(
          "PAYMENT FAILED:",
          response.error
        );

        alert(
          response.error
            ?.description ||
            "Payment failed"
        );

        setLoading(false);
      }
    );

    razorpay.open();
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      alert(
        "Your cart is empty"
      );

      return;
    }

    // Validate address
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      alert(
        "Please fill all shipping details"
      );

      return;
    }

    try {
      setLoading(true);

      if (
        paymentMethod ===
        "COD"
      ) {
        await handleCOD();
      } else {
        await handleRazorpay();
      }
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          error.message ||
          "Failed to place order"
      );

      setLoading(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cart.length === 0) {
    return (
      <div
        style={{
          minHeight:
            "calc(100vh - 120px)",

          background:
            "#f7f3ed",

          display: "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          padding:
            "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth:
              "500px",

            width: "100%",

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
          }}
        >
          <div
            style={{
              fontSize: "45px",
              marginBottom:
                "15px",
            }}
          >
            🛒
          </div>

          <p style={styles.eyebrow}>
            YOUR CART
          </p>

          <h1
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize:
                "34px",

              margin:
                "5px 0 12px",
            }}
          >
            Nothing to checkout
          </h1>

          <p
            style={{
              color:
                "#796b5f",

              lineHeight:
                "1.7",

              marginBottom:
                "25px",
            }}
          >
            Your shopping cart
            is currently empty.
            Discover something
            beautiful from our
            collection.
          </p>

          <button
            onClick={() =>
              navigate(
                "/collection"
              )
            }
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap: "15px",

              padding:
                "15px 20px",

              border: "none",

              borderRadius:
                "11px",

              background:
                "#713f21",

              color: "#fff",

              fontSize:
                "15px",

              fontWeight:
                "700",

              cursor:
                "pointer",

              width: "100%",
            }}
          >
            Continue Shopping
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
    <div
      style={{
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
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign:
            "center",

          marginBottom:
            "45px",
        }}
      >
        <p style={styles.eyebrow}>
          SECURE CHECKOUT
        </p>

        <h1
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",

            fontSize:
              "52px",

            margin: "0",

            color:
              "#2d2118",

            fontWeight:
              "600",
          }}
        >
          Checkout
        </h1>

        <p
          style={{
            color:
              "#77685c",

            fontSize:
              "16px",

            marginTop:
              "10px",
          }}
        >
          Complete your order
          with confidence.
        </p>
      </div>

      <form
        onSubmit={
          placeOrder
        }
      >
        <div
          style={{
            maxWidth:
              "1200px",

            margin:
              "0 auto",

            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 1.5fr) minmax(320px, 0.8fr)",

            gap: "28px",

            alignItems:
              "start",
          }}
        >
          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div>
            {/* SHIPPING ADDRESS */}

            <section
              style={styles.card}
            >
              <div
                style={
                  styles.sectionHeader
                }
              >
                <div
                  style={
                    styles.numberCircle
                  }
                >
                  01
                </div>

                <div>
                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    Shipping Address
                  </h2>

                  <p
                    style={
                      styles.sectionDescription
                    }
                  >
                    Where should we
                    deliver your order?
                  </p>
                </div>
              </div>

              <div
                style={
                  styles.formGrid
                }
              >
                {/* FULL NAME */}

                <div
                  style={
                    styles.fieldFull
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label
                    style={
                      styles.label
                    }
                  >
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit phone number"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label
                    style={
                      styles.label
                    }
                  >
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={
                      formData.pincode
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </div>

                {/* STREET */}

                <div
                  style={
                    styles.fieldFull
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Street / Address
                  </label>

                  <input
                    type="text"
                    name="street"
                    placeholder="House number, street, area"
                    value={
                      formData.street
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </div>

                {/* CITY */}

                <div>
                  <label
                    style={
                      styles.label
                    }
                  >
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </div>

                {/* STATE */}

                <div>
                  <label
                    style={
                      styles.label
                    }
                  >
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    required
                    style={
                      styles.input
                    }
                  />
                </div>

                {/* COUNTRY */}

                <div
                  style={
                    styles.fieldFull
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={
                      formData.country
                    }
                    onChange={
                      handleChange
                    }
                    style={
                      styles.input
                    }
                  />
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section
              style={styles.card}
            >
              <div
                style={
                  styles.sectionHeader
                }
              >
                <div
                  style={
                    styles.numberCircle
                  }
                >
                  02
                </div>

                <div>
                  <h2
                    style={
                      styles.sectionTitle
                    }
                  >
                    Payment Method
                  </h2>

                  <p
                    style={
                      styles.sectionDescription
                    }
                  >
                    Choose how you'd
                    like to pay.
                  </p>
                </div>
              </div>

              <div
                style={
                  styles.paymentGrid
                }
              >
                {/* COD */}

                <label
                  style={{
                    ...styles.paymentCard,

                    ...(paymentMethod ===
                    "COD"
                      ? styles.paymentCardActive
                      : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod ===
                      "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    style={
                      styles.radio
                    }
                  />

                  <div>
                    <div
                      style={
                        styles.paymentTitle
                      }
                    >
                      Cash on Delivery
                    </div>

                    <div
                      style={
                        styles.paymentText
                      }
                    >
                      Pay when your
                      order arrives
                    </div>
                  </div>

                  <span
                    style={
                      styles.paymentIcon
                    }
                  >
                    💵
                  </span>
                </label>

                {/* RAZORPAY */}

                <label
                  style={{
                    ...styles.paymentCard,

                    ...(paymentMethod ===
                    "RAZORPAY"
                      ? styles.paymentCardActive
                      : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={
                      paymentMethod ===
                      "RAZORPAY"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                    style={
                      styles.radio
                    }
                  />

                  <div>
                    <div
                      style={
                        styles.paymentTitle
                      }
                    >
                      Online Payment
                    </div>

                    <div
                      style={
                        styles.paymentText
                      }
                    >
                      Secure payment
                      via Razorpay
                    </div>
                  </div>

                  <span
                    style={
                      styles.paymentIcon
                    }
                  >
                    💳
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* ================================================= */}
          {/* RIGHT - ORDER SUMMARY */}
          {/* ================================================= */}

          <aside
            style={
              styles.summaryCard
            }
          >
            <p style={styles.eyebrow}>
              YOUR ORDER
            </p>

            <h2
              style={
                styles.summaryTitle
              }
            >
              Order Summary
            </h2>

            {/* PRODUCTS */}

            <div
              style={
                styles.productsList
              }
            >
              {cart.map(
                (item) => (
                  <div
                    key={
                      item._id
                    }
                    style={
                      styles.productRow
                    }
                  >
                    <img
                      src={
                        item.product
                          ?.images?.[0]
                      }
                      alt={
                        item.product
                          ?.name ||
                        "Product"
                      }
                      style={
                        styles.productImage
                      }
                    />

                    <div
                      style={
                        styles.productInfo
                      }
                    >
                      <h3
                        style={
                          styles.productName
                        }
                      >
                        {
                          item.product
                            ?.name
                        }
                      </h3>

                      <p
                        style={
                          styles.productQuantity
                        }
                      >
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </p>

                      <p
                        style={
                          styles.productPrice
                        }
                      >
                        ₹{" "}
                        {(
                          Number(
                            item
                              .product
                              ?.price ||
                              0
                          ) *
                          Number(
                            item.quantity ||
                              0
                          )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            <div
              style={
                styles.divider
              }
            />

            {/* ITEMS */}

            <div
              style={
                styles.priceRow
              }
            >
              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>
            </div>

            {/* SUBTOTAL */}

            <div
              style={
                styles.priceRow
              }
            >
              <span>
                Subtotal
              </span>

              <span>
                ₹{" "}
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {/* SHIPPING */}

            <div
              style={
                styles.priceRow
              }
            >
              <span>
                Shipping
              </span>

              <span
                style={
                  styles.freeText
                }
              >
                FREE
              </span>
            </div>

            <div
              style={
                styles.divider
              }
            />

            {/* TOTAL */}

            <div
              style={
                styles.totalRow
              }
            >
              <span>
                Total
              </span>

              <span>
                ₹{" "}
                {finalTotal.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              disabled={
                loading
              }
              style={{
                ...styles.primaryButton,

                width:
                  "100%",

                opacity:
                  loading
                    ? 0.7
                    : 1,

                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loading
                ? "Processing..."
                : paymentMethod ===
                  "COD"
                ? "Place Order"
                : "Pay with Razorpay"}

              {!loading && (
                <span>
                  →
                </span>
              )}
            </button>

            {/* BACK TO CART */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/cart"
                )
              }
              style={
                styles.secondaryButton
              }
            >
              ← Back to Cart
            </button>

            {/* SECURITY */}

            <div
              style={
                styles.trustBox
              }
            >
              <span>
                🔒
              </span>

              <div>
                <strong>
                  Secure Checkout
                </strong>

                <p
                  style={
                    styles.trustBoxText
                  }
                >
                  Your information
                  is protected and
                  encrypted.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  eyebrow: {
    fontSize: "13px",
    letterSpacing: "3px",
    color: "#b86f3d",
    fontWeight: "600",
    margin: "0 0 8px",
  },

  card: {
    background: "#fffdf9",
    border: "1px solid #e2d8cb",
    borderRadius: "22px",
    padding: "30px",
    marginBottom: "25px",
    boxShadow:
      "0 12px 35px rgba(65, 43, 25, 0.06)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "28px",
  },

  numberCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#f0e4d7",
    color: "#7a4726",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    flexShrink: 0,
  },

  sectionTitle: {
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    margin: "0",
    fontSize: "25px",
    color: "#2d2118",
  },

  sectionDescription: {
    margin: "5px 0 0",
    color: "#8a7b6d",
    fontSize: "14px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
  },

  fieldFull: {
    gridColumn:
      "1 / -1",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#59483b",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing:
      "border-box",
    padding:
      "14px 15px",
    border:
      "1px solid #d9cdbf",
    borderRadius:
      "10px",
    background:
      "#fff",
    color:
      "#2d2118",
    fontSize:
      "14px",
    outline:
      "none",
  },

  paymentGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  paymentCard: {
    position: "relative",
    display: "flex",
    alignItems:
      "center",
    gap: "12px",
    padding:
      "18px",
    border:
      "1px solid #ded2c5",
    borderRadius:
      "13px",
    background:
      "#fff",
    cursor:
      "pointer",
  },

  paymentCardActive: {
    border:
      "2px solid #7a4726",
    background:
      "#fbf4ec",
  },

  radio: {
    accentColor:
      "#7a4726",
    width:
      "17px",
    height:
      "17px",
  },

  paymentTitle: {
    fontWeight:
      "700",
    fontSize:
      "14px",
    color:
      "#3b2a1f",
  },

  paymentText: {
    fontSize:
      "12px",
    color:
      "#8b7a6c",
    marginTop:
      "4px",
  },

  paymentIcon: {
    marginLeft:
      "auto",
    fontSize:
      "21px",
  },

  summaryCard: {
    background:
      "#fffdf9",
    border:
      "1px solid #e2d8cb",
    borderRadius:
      "22px",
    padding:
      "30px",
    boxShadow:
      "0 12px 35px rgba(65, 43, 25, 0.08)",
    position:
      "sticky",
    top:
      "25px",
  },

  summaryTitle: {
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize:
      "30px",
    margin:
      "0 0 25px",
    color:
      "#2d2118",
  },

  productsList: {
    display:
      "flex",
    flexDirection:
      "column",
    gap:
      "17px",
  },

  productRow: {
    display:
      "flex",
    alignItems:
      "center",
    gap:
      "14px",
  },

  productImage: {
    width:
      "68px",
    height:
      "80px",
    objectFit:
      "cover",
    borderRadius:
      "9px",
    background:
      "#eee",
  },

  productInfo: {
    flex:
      "1",
    minWidth:
      "0",
  },

  productName: {
    margin:
      "0 0 5px",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize:
      "16px",
    color:
      "#3b2a1f",
  },

  productQuantity: {
    margin:
      "0 0 5px",
    fontSize:
      "12px",
    color:
      "#8a796a",
  },

  productPrice: {
    margin:
      "0",
    fontSize:
      "14px",
    fontWeight:
      "700",
    color:
      "#a96335",
  },

  divider: {
    borderTop:
      "1px solid #ded3c7",
    margin:
      "24px 0",
  },

  priceRow: {
    display:
      "flex",
    justifyContent:
      "space-between",
    marginBottom:
      "14px",
    color:
      "#706155",
    fontSize:
      "14px",
  },

  freeText: {
    color:
      "#63805b",
    fontWeight:
      "700",
  },

  totalRow: {
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "24px",
    fontSize:
      "18px",
    fontWeight:
      "700",
    color:
      "#2d2118",
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
  },

  secondaryButton: {
    width:
      "100%",
    padding:
      "14px",
    marginTop:
      "12px",
    border:
      "1px solid #d7c9bb",
    borderRadius:
      "11px",
    background:
      "#fffdf9",
    color:
      "#604d3d",
    fontSize:
      "14px",
    cursor:
      "pointer",
  },

  trustBox: {
    display:
      "flex",
    gap:
      "10px",
    alignItems:
      "flex-start",
    marginTop:
      "22px",
    paddingTop:
      "18px",
    borderTop:
      "1px solid #e2d8cb",
    color:
      "#75675b",
    fontSize:
      "12px",
  },

  trustBoxText: {
    margin:
      "4px 0 0",
  },
};

export default Checkout;