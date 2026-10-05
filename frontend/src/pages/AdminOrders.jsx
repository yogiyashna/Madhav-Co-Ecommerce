import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH ALL ORDERS
  // ==========================================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(
        "FETCH ORDERS ERROR:",
        error
      );

      if (error.response?.status === 403) {
        alert("Admin access only");
        navigate("/admin");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      await axios.put(
        `/orders/${orderId}`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order Status Updated Successfully");

      fetchOrders();
    } catch (error) {
      console.log(
        "UPDATE ORDER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    }
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order Deleted Successfully");

      fetchOrders();
    } catch (error) {
      console.log(
        "DELETE ORDER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    }
  };

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          background: "#fff3cd",
          color: "#946200",
        };

      case "Processing":
        return {
          background: "#e8eefc",
          color: "#3157a4",
        };

      case "Shipped":
        return {
          background: "#eee6ff",
          color: "#6941a5",
        };

      case "Delivered":
        return {
          background: "#e5f4ea",
          color: "#277344",
        };

      case "Cancelled":
        return {
          background: "#fbe4e4",
          color: "#b33a3a",
        };

      default:
        return {
          background: "#f1f1f1",
          color: "#555",
        };
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
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
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
        }}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          style={{
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
              Orders
            </h1>

            <p
              style={{
                margin: 0,
                color: "#786b63",
                fontSize: "18px",
              }}
            >
              Manage customer orders and
              order status.
            </p>
          </div>

          {/* NAVIGATION */}

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                navigate("/admin")
              }
              style={secondaryButton}
            >
              ← Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/products")
              }
              style={secondaryButton}
            >
              Products
            </button>
          </div>
        </div>

        {/* ==========================================
            ORDER COUNT
        ========================================== */}

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
          <strong>{orders.length}</strong>{" "}
          {orders.length === 1
            ? "order"
            : "orders"}{" "}
          received
        </div>

        {/* ==========================================
            ORDERS TABLE
        ========================================== */}

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
            <thead>
              <tr
                style={{
                  background: "#f2e4d3",
                  color: "#3b2a21",
                }}
              >
                <th style={thStyle}>
                  Order
                </th>

                <th style={thStyle}>
                  Customer
                </th>

                <th style={thStyle}>
                  Date
                </th>

                <th style={thStyle}>
                  Items
                </th>

                <th style={thStyle}>
                  Amount
                </th>

                <th style={thStyle}>
                  Payment
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}

              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "55px",
                      textAlign: "center",
                      color: "#786b63",
                      fontSize: "17px",
                    }}
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                /* NO ORDERS */

                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "55px",
                      textAlign: "center",
                      color: "#786b63",
                      fontSize: "17px",
                    }}
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    style={{
                      borderTop:
                        "1px solid #eee3d8",
                    }}
                  >
                    {/* ORDER ID */}

                    <td style={tdStyle}>
                       <button
                          onClick={() =>
                            navigate(`/admin/orders/${order._id}`)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            color: "#70401f",
                            fontWeight: "700",
                            fontSize: "16px",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          #{order._id.slice(-6).toUpperCase()}
                        </button>
                    </td>

                    {/* CUSTOMER */}

                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#2d1f18",
                          marginBottom: "5px",
                        }}
                      >
                        {order.user?.name ||
                          order.shippingAddress
                            ?.fullName ||
                          "Customer"}
                      </div>

                      <div
                        style={{
                          color: "#786b63",
                          fontSize: "14px",
                        }}
                      >
                        {order.user?.email ||
                          "No email"}
                      </div>
                    </td>

                    {/* DATE */}

                    <td style={tdStyle}>
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    {/* ITEMS */}

                    <td style={tdStyle}>
                      {order.orderItems?.reduce(
                        (total, item) =>
                          total +
                          item.quantity,
                        0
                      )}
                    </td>

                    {/* AMOUNT */}

                    <td style={tdStyle}>
                      <strong
                        style={{
                          fontSize: "17px",
                          color: "#2d1f18",
                        }}
                      >
                        ₹{" "}
                        {Number(
                          order.totalPrice
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    {/* PAYMENT */}

                    <td style={tdStyle}>
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            order.paymentMethod ===
                            "RAZORPAY"
                              ? "#3157a4"
                              : "#75401f",
                        }}
                      >
                        {order.paymentMethod}
                      </span>

                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "13px",
                          color:
                            order.isPaid
                              ? "#277344"
                              : "#946200",
                        }}
                      >
                        {order.isPaid
                          ? "Paid"
                          : "Not Paid"}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td style={tdStyle}>
                      <select
                        value={
                          order.orderStatus
                        }
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "9px 12px",
                          border: "none",
                          borderRadius: "20px",
                          fontFamily:
                            "Georgia, serif",
                          fontWeight: "bold",
                          cursor: "pointer",
                          outline: "none",
                          ...getStatusStyle(
                            order.orderStatus
                          ),
                        }}
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    {/* ACTIONS */}

                    <td style={tdStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          deleteOrder(
                            order._id
                          )
                        }
                        style={{
                          padding:
                            "9px 17px",
                          border:
                            "1px solid #e6a4a4",
                          borderRadius: "9px",
                          background:
                            "#fffdf9",
                          color: "#b52e2e",
                          fontSize: "14px",
                          fontFamily:
                            "Georgia, serif",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
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

// ==========================================
// STYLES
// ==========================================

const secondaryButton = {
  padding: "14px 23px",
  border: "1px solid #d9c6b4",
  borderRadius: "10px",
  background: "#fffdf9",
  color: "#75401f",
  fontSize: "16px",
  fontWeight: "500",
  fontFamily: "Georgia, serif",
  cursor: "pointer",
};

const thStyle = {
  padding: "20px 18px",
  textAlign: "left",
  fontSize: "15px",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "18px",
  verticalAlign: "middle",
};

export default AdminOrders;