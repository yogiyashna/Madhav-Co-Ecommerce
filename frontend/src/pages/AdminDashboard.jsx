import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ============================
  // ACCESS CONTROL
  // ============================

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <div className="access-card">
          <div className="access-icon">🔒</div>

          <p className="admin-label">MADHAV & CO.</p>

          <h1>Access Denied</h1>

          <p>
            You don't have permission to access the
            administration panel.
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

  // ============================
  // DASHBOARD
  // ============================

  return (
    <div className="admin-dashboard">

      {/* ============================
          SIDEBAR
      ============================ */}

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
              localStorage.removeItem("token");
              localStorage.removeItem("user");

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


      {/* ============================
          MAIN CONTENT
      ============================ */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div>
            <p className="admin-top-label">
              ADMINISTRATION
            </p>

            <h1>Dashboard</h1>
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
              <strong>{user.name}</strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

        </header>


        {/* WELCOME */}

        <section className="admin-welcome">

          <div>
            <p>WELCOME BACK</p>

            <h2>
              Hello, {user.name} 👋
            </h2>

            <span>
              Here's what's happening with your
              store today.
            </span>
          </div>

          <div className="welcome-decoration">
            ✦
          </div>

        </section>


        {/* ============================
            STATISTICS
        ============================ */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              ◇
            </div>

            <div>
              <span>Total Products</span>

              <strong>24</strong>

              <small>
                Products in store
              </small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🛍
            </div>

            <div>
              <span>Total Orders</span>

              <strong>12</strong>

              <small>
                Orders received
              </small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ♙
            </div>

            <div>
              <span>Total Users</span>

              <strong>156</strong>

              <small>
                Registered customers
              </small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div>
              <span>Total Revenue</span>

              <strong>₹45,999</strong>

              <small>
                Store revenue
              </small>
            </div>

          </div>

        </section>


        {/* ============================
            QUICK ACTIONS
        ============================ */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <p>MANAGE STORE</p>

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
                  View, edit and delete products
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
                  Add a new product to your store
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
                  View and update customer orders
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
                  View registered customers
                </p>
              </div>

              <span className="arrow">
                →
              </span>
            </Link>

          </div>

        </section>


        {/* ============================
            RECENT ORDERS
        ============================ */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <p>STORE ACTIVITY</p>

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

            <div className="table-header">

              <span>Order ID</span>

              <span>Customer</span>

              <span>Date</span>

              <span>Total</span>

              <span>Status</span>

            </div>


            <div className="order-row">

              <span>
                #6ac25fc4
              </span>

              <span>
                Customer
              </span>

              <span>
                04 Oct 2026
              </span>

              <span>
                ₹3,19,996
              </span>

              <span className="status pending">
                Pending
              </span>

            </div>


            <div className="order-row">

              <span>
                #6a8881f4
              </span>

              <span>
                Customer
              </span>

              <span>
                21 Aug 2026
              </span>

              <span>
                ₹79,999
              </span>

              <span className="status pending">
                Pending
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;