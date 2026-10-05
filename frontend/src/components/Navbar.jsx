import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ============================
  // LOAD USER
  // ============================

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        console.log("NAVBAR USER:", parsedUser);

        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // ============================
  // AUTH STATE
  // ============================

  useEffect(() => {
    loadUser();

    window.addEventListener("authChanged", loadUser);
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // ============================
  // LOGOUT
  // ============================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMobileMenuOpen(false);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  // ============================
  // PROFILE
  // ============================

  const handleProfileClick = () => {
    setMobileMenuOpen(false);

    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // ============================
  // SEARCH
  // ============================

  const handleSearch = () => {
    setMobileMenuOpen(false);

    const searchBox = document.getElementById("search-box");

    if (searchBox) {
      searchBox.focus();
      return;
    }

    navigate("/");
  };

  // ============================
  // CLOSE MOBILE MENU
  // ============================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="main-navbar">

        <div className="navbar-wrapper">

          {/* ============================
              DESKTOP LEFT
          ============================ */}

          <nav className="navbar-left">

            <Link
              to="/"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            <Link
              to="/collection"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Collection
            </Link>

            <Link
              to="/cart"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Cart
            </Link>

            <Link
              to="/wishlist"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Wishlist
            </Link>

          </nav>


          {/* ============================
              LOGO
          ============================ */}

          <Link
            to="/"
            className="company-name"
            onClick={closeMobileMenu}
          >
            Madhav{" "}
            <span>&</span>{" "}
            Co.
          </Link>


          {/* ============================
              DESKTOP RIGHT
          ============================ */}

          <nav className="navbar-right">

            <Link
              to="/orders"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              Orders
            </Link>


            {/* SEARCH */}

            <button
              onClick={handleSearch}
              title="Search"
              className="icon-button"
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <line
                  x1="16.5"
                  y1="16.5"
                  x2="21"
                  y2="21"
                />
              </svg>
            </button>


            {/* PROFILE */}

            <button
              onClick={handleProfileClick}
              title={
                user
                  ? "My Account"
                  : "Login"
              }
              className="profile-button"
              type="button"
            >

              {user?.profilePic ? (

                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="profile-image"
                />

              ) : (

                <div className="profile-placeholder">

                  {user?.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

              )}

            </button>

          </nav>


          {/* ============================
              MOBILE MENU BUTTON
          ============================ */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            aria-label="Toggle menu"
          >

            {mobileMenuOpen ? (
              <span className="close-icon">
                ×
              </span>
            ) : (
              <span className="hamburger-icon">
                ☰
              </span>
            )}

          </button>

        </div>


        {/* ============================
            MOBILE MENU
        ============================ */}

        {mobileMenuOpen && (

          <div className="mobile-menu">

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="mobile-menu-link"
            >
              Home
            </Link>

            <Link
              to="/collection"
              onClick={closeMobileMenu}
              className="mobile-menu-link"
            >
              Collection
            </Link>

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="mobile-menu-link"
            >
              Cart
            </Link>

            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              className="mobile-menu-link"
            >
              Wishlist
            </Link>

            <Link
              to="/orders"
              onClick={closeMobileMenu}
              className="mobile-menu-link"
            >
              Orders
            </Link>

            <button
              type="button"
              onClick={handleSearch}
              className="mobile-menu-link mobile-button"
            >
              Search
            </button>

            <button
              type="button"
              onClick={handleProfileClick}
              className="mobile-menu-link mobile-button"
            >
              {user
                ? "My Profile"
                : "Login"}
            </button>

          </div>

        )}

      </header>
    </>
  );
};

export default Navbar;