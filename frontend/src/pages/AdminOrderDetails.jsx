import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f5ef",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <h2>Loading Order...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f5ef",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <h2>Order Not Found</h2>

        <button
          onClick={() => navigate("/admin/orders")}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            borderRadius: "8px",
            border: "1px solid #8b4a24",
            background: "#8b4a24",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f5ef",
        padding: "50px",
        color: "#2f211b",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              letterSpacing: "5px",
              color: "#b56736",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            ADMIN PANEL
          </div>

          <h1
            style={{
              fontSize: "48px",
              margin: "0 0 10px",
              fontFamily: "Georgia, serif",
            }}
          >
            Order Details
          </h1>

          <p
            style={{
              color: "#75665e",
              fontSize: "18px",
              margin: 0,
            }}
          >
            View complete order information.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate("/admin/orders")}
            style={{
              padding: "14px 24px",
              borderRadius: "10px",
              border: "1px solid #dfcbb9",
              background: "#fffdf9",
              color: "#70401f",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ← Orders
          </button>

          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              padding: "14px 24px",
              borderRadius: "10px",
              border: "1px solid #dfcbb9",
              background: "#fffdf9",
              color: "#70401f",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* ORDER SUMMARY */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "25px",
            boxShadow: "0 10px 30px rgba(80, 50, 30, 0.08)",
            border: "1px solid #eadbcd",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#9a6747",
                  fontSize: "14px",
                  letterSpacing: "2px",
                  fontWeight: "600",
                }}
              >
                ORDER
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontFamily: "Georgia, serif",
                }}
              >
                #{order._id.slice(-6).toUpperCase()}
              </h2>
            </div>

            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 18px",
                  borderRadius: "20px",
                  background:
                    order.orderStatus === "Delivered"
                      ? "#dff2e5"
                      : order.orderStatus === "Cancelled"
                      ? "#fbe2e2"
                      : "#f7e9c5",
                  color:
                    order.orderStatus === "Delivered"
                      ? "#287345"
                      : order.orderStatus === "Cancelled"
                      ? "#b52b2b"
                      : "#966300",
                  fontWeight: "600",
                }}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <InfoBox
              title="ORDER DATE"
              value={new Date(order.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            />

            <InfoBox
              title="TOTAL AMOUNT"
              value={`₹ ${Number(
                order.totalPrice
              ).toLocaleString("en-IN")}`}
            />

            <InfoBox
              title="PAYMENT"
              value={order.paymentMethod}
            />

            <InfoBox
              title="PAYMENT STATUS"
              value={order.isPaid ? "Paid" : "Not Paid"}
            />
          </div>
        </div>

        {/* CUSTOMER + SHIPPING */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "25px",
            marginBottom: "25px",
          }}
        >
          {/* CUSTOMER */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 10px 30px rgba(80, 50, 30, 0.08)",
              border: "1px solid #eadbcd",
            }}
          >
            <SectionTitle title="CUSTOMER INFORMATION" />

            <InfoRow
              label="Name"
              value={order.user?.name || "N/A"}
            />

            <InfoRow
              label="Email"
              value={order.user?.email || "N/A"}
            />
          </div>

          {/* SHIPPING */}

          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 10px 30px rgba(80, 50, 30, 0.08)",
              border: "1px solid #eadbcd",
            }}
          >
            <SectionTitle title="SHIPPING ADDRESS" />

            <InfoRow
              label="Name"
              value={order.shippingAddress?.fullName}
            />

            <InfoRow
              label="Phone"
              value={order.shippingAddress?.phone}
            />

            <InfoRow
              label="Street"
              value={order.shippingAddress?.street}
            />

            <InfoRow
              label="City"
              value={order.shippingAddress?.city}
            />

            <InfoRow
              label="State"
              value={order.shippingAddress?.state}
            />

            <InfoRow
              label="Pincode"
              value={order.shippingAddress?.pincode}
            />

            <InfoRow
              label="Country"
              value={order.shippingAddress?.country}
            />
          </div>
        </div>

        {/* ORDER ITEMS */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(80, 50, 30, 0.08)",
            border: "1px solid #eadbcd",
            marginBottom: "30px",
          }}
        >
          <SectionTitle title="ORDER ITEMS" />

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f6e8d7",
                    textAlign: "left",
                  }}
                >
                  <th style={thStyle}>PRODUCT</th>
                  <th style={thStyle}>PRICE</th>
                  <th style={thStyle}>QUANTITY</th>
                  <th style={thStyle}>SUBTOTAL</th>
                </tr>
              </thead>

              <tbody>
                {order.orderItems?.map((item, index) => {
                  const product = item.product;

                  return (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "18px",
                          borderBottom:
                            "1px solid #eee1d5",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                          }}
                        >
                          <img
                            src={product?.images?.[0]}
                            alt={product?.name}
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border:
                                "1px solid #eadbcd",
                            }}
                          />

                          <div>
                            <strong
                              style={{
                                fontSize: "17px",
                              }}
                            >
                              {product?.name ||
                                "Product"}
                            </strong>

                            <div
                              style={{
                                color: "#806f64",
                                marginTop: "5px",
                              }}
                            >
                              {product?.brand || ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={tdStyle}>
                        ₹{" "}
                        {Number(
                          item.price
                        ).toLocaleString("en-IN")}
                      </td>

                      <td style={tdStyle}>
                        {item.quantity}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          ₹{" "}
                          {Number(
                            item.price *
                              item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "25px",
            }}
          >
            <div
              style={{
                minWidth: "280px",
                background: "#f7ead9",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "20px",
                }}
              >
                <strong>Total</strong>

                <strong>
                  ₹{" "}
                  {Number(
                    order.totalPrice
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BUTTON */}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "40px",
          }}
        >
          <button
            onClick={() => navigate("/admin/orders")}
            style={{
              padding: "14px 28px",
              borderRadius: "10px",
              border: "1px solid #d9bfa9",
              background: "#fffdf9",
              color: "#70401f",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ← Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Reusable Components
========================= */

const SectionTitle = ({ title }) => (
  <h3
    style={{
      margin: "0 0 25px",
      color: "#a76540",
      letterSpacing: "3px",
      fontSize: "14px",
    }}
  >
    {title}
  </h3>
);

const InfoBox = ({ title, value }) => (
  <div
    style={{
      background: "#faf5ee",
      borderRadius: "12px",
      padding: "18px",
      border: "1px solid #eadbcd",
    }}
  >
    <div
      style={{
        fontSize: "12px",
        letterSpacing: "2px",
        color: "#9a806d",
        marginBottom: "8px",
      }}
    >
      {title}
    </div>

    <strong style={{ fontSize: "18px" }}>
      {value}
    </strong>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      padding: "12px 0",
      borderBottom: "1px solid #eee1d5",
    }}
  >
    <span style={{ color: "#806f64" }}>
      {label}
    </span>

    <strong
      style={{
        textAlign: "right",
        maxWidth: "65%",
      }}
    >
      {value || "N/A"}
    </strong>
  </div>
);

const thStyle = {
  padding: "16px",
  fontSize: "14px",
  letterSpacing: "1px",
};

const tdStyle = {
  padding: "18px",
  borderBottom: "1px solid #eee1d5",
};

export default AdminOrderDetails;