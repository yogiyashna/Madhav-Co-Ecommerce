import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ==========================================
  // LOGGED-IN ADMIN
  // ==========================================

  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  const user = getStoredUser();
  const token = localStorage.getItem("token");

  // ==========================================
  // STATE
  // ==========================================

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // ======================================
      // FETCH PRODUCTS
      // ======================================

      const productsResponse = await axios.get(
        "/products?limit=100",
        {
          headers,
        }
      );

      const products =
        productsResponse.data?.products || [];

      // ======================================
      // FETCH ORDERS
      // ======================================

      const ordersResponse = await axios.get(
        "/orders",
        {
          headers,
        }
      );

      const orders =
        ordersResponse.data?.orders || [];

      // ======================================
      // FETCH USERS
      // ======================================

      const usersResponse = await axios.get(
        "/admin/users",
        {
          headers,
        }
      );

      const users =
        usersResponse.data?.users || [];

      // ======================================
      // CALCULATE REVENUE
      // ======================================

      const totalRevenue = orders.reduce(
        (total, order) => {
          const amount =
            Number(order.totalPrice) || 0;

          return total + amount;
        },
        0
      );

      // ======================================
      // SORT ORDERS BY DATE
      // ======================================

      const sortedOrders = [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .slice(0, 3);

      // ======================================
      // SET DATA
      // ======================================

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue: totalRevenue,
      });

      setRecentOrders(sortedOrders);

    } catch (error) {
      console.error(
        "DASHBOARD DATA ERROR:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (
        error.response?.status === 403
      ) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // ORDER CUSTOMER NAME
  // ==========================================

  const getCustomerName = (order) => {
    return (
      order.user?.name ||
      order.shippingAddress?.fullName ||
      "Customer"
    );
  };

  // ==========================================
  // ORDER STATUS
  // ==========================================

  const getOrderStatus = (order) => {
    return order.orderStatus || "Pending";
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    const normalized =
      String(status || "Pending")
        .toLowerCase();

    if (normalized === "delivered") {
      return "status delivered";
    }

    if (normalized === "cancelled") {
      return "status cancelled";
    }

    if (normalized === "shipped") {
      return "status shipped";
    }

    if (normalized === "processing") {
      return "status processing";
    }

    return "status pending";
  };

  // ==========================================
  // ACCESS CONTROL
  // ==========================================

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <div className="access-card">

          <div className="access-icon">
            🔒
          </div>

          <p className="admin-label">
            MADHAV & CO.
          </p>

          <h1>Access Denied</h1>

          <p>
            You don't have permission to access
            the administration panel.
          </p>

          <button
            onClick={() => navigate("/")}
            className="admin-primary-btn"
          >
            Back To Store
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-loading-page">
        <div className="admin-loader">
          <div className="loader-circle"></div>

          <p>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="admin-dashboard">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="brand-name">
            Madhav <span>&</span> Co.
          </div>

          <div className="admin-badge">
            ADMIN PANEL
          </div>

        </div>

        <nav className="admin-navigation">

          <Link
            to="/admin/dashboard"
            className="admin-nav-link active"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="admin-nav-link"
          >
            <span>▣</span>
            Products
          </Link>

          <Link
            to="/admin/add-product"
            className="admin-nav-link"
          >
            <span>＋</span>
            Add Product
          </Link>

          <Link
            to="/admin/orders"
            className="admin-nav-link"
          >
            <span>🛍</span>
            Orders
          </Link>

          <Link
            to="/admin/users"
            className="admin-nav-link"
          >
            <span>♙</span>
            Users
          </Link>

          <Link
            to="/admin/categories"
            className="admin-nav-link"
          >
            <span>◇</span>
            Categories
          </Link>

          <Link
            to="/admin/reviews"
            className="admin-nav-link"
          >
            <span>☆</span>
            Reviews
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <Link
            to="/"
            className="store-link"
          >
            ← Back to Store
          </Link>

          <button
            className="admin-logout-btn"
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              window.dispatchEvent(
                new Event("authChanged")
              );

              navigate("/admin/login");
            }}
          >
            ⇥ Logout
          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div>

            <p className="admin-top-label">
              ADMINISTRATION
            </p>

            <h1>
              Dashboard
            </h1>

          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div>

              <strong>
                {user.name}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

        </header>

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="dashboard-error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {/* ======================================
            WELCOME
        ====================================== */}

        <section className="admin-welcome">

          <div>

            <p>
              WELCOME BACK
            </p>

            <h2>
              Hello, {user.name} 👋
            </h2>

            <span>
              Here's what's happening with
              your store today.
            </span>

          </div>

          <div className="welcome-decoration">
            ✦
          </div>

        </section>

        {/* ======================================
            STATISTICS
        ====================================== */}

        <section className="stats-grid">

          {/* PRODUCTS */}

          <div className="stat-card">

            <div className="stat-icon">
              ◇
            </div>

            <div>

              <span>
                Total Products
              </span>

              <strong>
                {stats.products}
              </strong>

              <small>
                Products in store
              </small>

            </div>

          </div>

          {/* ORDERS */}

          <div className="stat-card">

            <div className="stat-icon">
              🛍
            </div>

            <div>

              <span>
                Total Orders
              </span>

              <strong>
                {stats.orders}
              </strong>

              <small>
                Orders received
              </small>

            </div>

          </div>

          {/* USERS */}

          <div className="stat-card">

            <div className="stat-icon">
              ♙
            </div>

            <div>

              <span>
                Total Users
              </span>

              <strong>
                {stats.users}
              </strong>

              <small>
                Registered customers
              </small>

            </div>

          </div>

          {/* REVENUE */}

          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>

              <span>
                Total Revenue
              </span>

              <strong>
                ₹{formatCurrency(
                  stats.revenue
                )}
              </strong>

              <small>
                Store revenue
              </small>

            </div>

          </div>

        </section>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <p>
                MANAGE STORE
              </p>

              <h2>
                Quick Actions
              </h2>

            </div>

          </div>

          <div className="quick-actions">

            <Link
              to="/admin/products"
              className="quick-action"
            >

              <div className="quick-icon">
                ◇
              </div>

              <div>

                <h3>
                  Manage Products
                </h3>

                <p>
                  View, edit and delete
                  products
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </Link>

            <Link
              to="/admin/add-product"
              className="quick-action"
            >

              <div className="quick-icon">
                ＋
              </div>

              <div>

                <h3>
                  Add Product
                </h3>

                <p>
                  Add a new product
                  to your store
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </Link>

            <Link
              to="/admin/orders"
              className="quick-action"
            >

              <div className="quick-icon">
                🛍
              </div>

              <div>

                <h3>
                  Manage Orders
                </h3>

                <p>
                  View and update
                  customer orders
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </Link>

            <Link
              to="/admin/users"
              className="quick-action"
            >

              <div className="quick-icon">
                ♙
              </div>

              <div>

                <h3>
                  Manage Users
                </h3>

                <p>
                  View registered
                  customers
                </p>

              </div>

              <span className="arrow">
                →
              </span>

            </Link>

          </div>

        </section>

        {/* ======================================
            RECENT ORDERS
        ====================================== */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <p>
                STORE ACTIVITY
              </p>

              <h2>
                Recent Orders
              </h2>

            </div>

            <Link
              to="/admin/orders"
              className="view-all"
            >
              View All →
            </Link>

          </div>

          <div className="orders-table">

            {/* TABLE HEADER */}

            <div className="table-header">

              <span>
                Order ID
              </span>

              <span>
                Customer
              </span>

              <span>
                Date
              </span>

              <span>
                Total
              </span>

              <span>
                Status
              </span>

            </div>

            {/* EMPTY */}

            {recentOrders.length === 0 && (
              <div className="empty-orders">
                No orders have been placed yet.
              </div>
            )}

            {/* ORDERS */}

            {recentOrders.map(
              (order) => (
                <div
                  className="order-row"
                  key={order._id}
                >

                  <span className="order-id">
                    #
                    {order._id
                      ?.slice(-8)}
                  </span>

                  <span>
                    {getCustomerName(
                      order
                    )}
                  </span>

                  <span>
                    {formatDate(
                      order.createdAt
                    )}
                  </span>

                  <span className="order-total">
                    ₹
                    {formatCurrency(
                      Number(
                        order.totalPrice
                      ) || 0
                    )}
                  </span>

                  <span
                    className={getStatusClass(
                      getOrderStatus(
                        order
                      )
                    )}
                  >
                    {getOrderStatus(
                      order
                    )}
                  </span>

                </div>
              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;