import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Collection from "./pages/Collection";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import EditProduct from "./pages/EditProduct";
import AdminOrderDetails from "./pages/AdminOrderDetails";


// ========================================
// APP CONTENT
// ========================================

function AppContent() {
  const location = useLocation();

  // All /admin/* pages use the Admin layout.
  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <>
      {/* ====================================
          CUSTOMER NAVBAR
          Hide it on all admin pages
      ==================================== */}

      {!isAdminRoute && <Navbar />}


      {/* ====================================
          ROUTES
      ==================================== */}

      <Routes>

        {/* ====================================
            CUSTOMER ROUTES
        ==================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/collection"
          element={<Collection />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ====================================
            ADMIN ROUTES
        ==================================== */}

        {/* Admin Login */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* Admin Dashboard */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />


        {/* /admin → Dashboard */}

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />


        {/* Admin Products */}

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />


        {/* Add Product */}

        <Route
          path="/admin/add-product"
          element={<AddProduct />}
        />

        <Route
          path="/admin/edit-product/:id"
          element={<EditProduct />}
        />


        {/* Admin Orders */}

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/orders/:id"
          element={<AdminOrderDetails />}
        />

      </Routes>
    </>
  );
}


// ========================================
// APP
// ========================================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;