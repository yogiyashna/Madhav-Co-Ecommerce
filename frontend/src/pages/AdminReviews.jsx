import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

import "./AdminReviews.css";

const AdminReviews = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ============================================
  // USER / ACCESS CONTROL
  // ============================================

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  // ============================================
  // FETCH ALL REVIEWS
  // ============================================

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/review/admin/all");

      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("FETCH REVIEWS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // ACCESS CONTROL
  // ============================================

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-reviews-access-denied">
        <div className="admin-reviews-access-card">
          <div className="admin-reviews-access-icon">
            🔒
          </div>

          <p className="admin-reviews-label">
            MADHAV & CO.
          </p>

          <h1>Access Denied</h1>

          <p>
            Only administrators can view customer
            reviews.
          </p>

          <button
            onClick={() => navigate("/")}
            className="admin-reviews-primary-btn"
          >
            Back To Store
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // SEARCH
  // ============================================

  const searchText = search.toLowerCase().trim();

  const filteredReviews = reviews.filter((review) => {
    return (
      review.productName
        ?.toLowerCase()
        .includes(searchText) ||
      review.customerName
        ?.toLowerCase()
        .includes(searchText) ||
      review.comment
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ============================================
  // RATING DISPLAY
  // ============================================

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="admin-review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= value
                ? "star active"
                : "star"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // ============================================
  // DATE FORMAT
  // ============================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="admin-reviews-loading">
        <div className="admin-reviews-spinner"></div>

        <p>Loading reviews...</p>
      </div>
    );
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="admin-reviews-page">

      {/* ========================================
          TOP HEADER
      ======================================== */}

      <header className="admin-reviews-header">

        <div>
          <p className="admin-reviews-top-label">
            ADMINISTRATION
          </p>

          <h1>Customer Reviews</h1>

          <p className="admin-reviews-subtitle">
            View customer feedback and product
            experiences.
          </p>
        </div>

        <button
          className="admin-reviews-dashboard-btn"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>

      {/* ========================================
          INTRO
      ======================================== */}

      <section className="admin-reviews-intro">

        <div>
          <p>FEEDBACK & INSIGHTS</p>

          <h2>
            What Customers Are Saying
          </h2>

          <span>
            Customer reviews are displayed here
            for transparency and store insights.
          </span>
        </div>

      </section>

      {/* ========================================
          STATISTICS
      ======================================== */}

      <section className="admin-review-stats">

        <div className="admin-review-stat-card">

          <div className="admin-review-stat-icon">
            ★
          </div>

          <div>
            <span>Total Reviews</span>

            <strong>
              {reviews.length}
            </strong>

            <small>
              Customer reviews
            </small>
          </div>

        </div>

        <div className="admin-review-stat-card">

          <div className="admin-review-stat-icon">
            ✓
          </div>

          <div>
            <span>Average Rating</span>

            <strong>
              {reviews.length > 0
                ? (
                    reviews.reduce(
                      (total, review) =>
                        total +
                        Number(
                          review.rating || 0
                        ),
                      0
                    ) / reviews.length
                  ).toFixed(1)
                : "0.0"}
            </strong>

            <small>
              Out of 5 stars
            </small>
          </div>

        </div>

      </section>

      {/* ========================================
          REVIEWS SECTION
      ======================================== */}

      <section className="admin-reviews-section">

        <div className="admin-reviews-section-header">

          <div>
            <p>REVIEW LIST</p>

            <h2>
              Customer Feedback
            </h2>

            {search && (
              <small className="admin-review-result-count">
                {filteredReviews.length} review
                {filteredReviews.length !== 1
                  ? "s"
                  : ""}{" "}
                found for "{search}"
              </small>
            )}
          </div>

          {/* SEARCH */}

          <div className="admin-review-search">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="admin-review-clear-search"
              >
                ×
              </button>
            )}

          </div>

        </div>

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {filteredReviews.length === 0 ? (
          <div className="admin-reviews-empty">

            <div className="admin-reviews-empty-icon">
              ☆
            </div>

            <h3>
              {search
                ? "No reviews found"
                : "No customer reviews yet"}
            </h3>

            <p>
              {search
                ? "Try searching with a different product, customer, or comment."
                : "Customer reviews will appear here once customers start reviewing products."}
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="admin-review-clear-btn"
              >
                Clear Search
              </button>
            )}

          </div>
        ) : (

          /* ====================================
             REVIEW GRID
          ==================================== */

          <div className="admin-reviews-grid">

            {filteredReviews.map((review) => (

              <article
                className="admin-review-card"
                key={
                  review._id ||
                  `${review.productId}-${review.createdAt}`
                }
              >

                {/* CARD HEADER */}

                <div className="admin-review-card-header">

                  <div className="admin-review-customer">

                    <div className="admin-review-avatar">
                      {review.customerName
                        ? review.customerName
                            .charAt(0)
                            .toUpperCase()
                        : "C"}
                    </div>

                    <div>
                      <h3>
                        {review.customerName ||
                          "Customer"}
                      </h3>

                      <span>
                        Customer
                      </span>
                    </div>

                  </div>

                  <span className="admin-review-date">
                    {formatDate(
                      review.createdAt
                    )}
                  </span>

                </div>

                {/* PRODUCT */}

                <div className="admin-review-product">

                  <span>
                    PRODUCT
                  </span>

                  <strong>
                    {review.productName ||
                      "Unknown Product"}
                  </strong>

                </div>

                {/* RATING */}

                <div className="admin-review-rating">

                  {renderStars(
                    review.rating
                  )}

                  <strong>
                    {Number(
                      review.rating || 0
                    ).toFixed(0)}/5
                  </strong>

                </div>

                {/* COMMENT */}

                <div className="admin-review-comment">

                  <span className="admin-review-quote">
                    "
                  </span>

                  <p>
                    {review.comment ||
                      "No comment provided."}
                  </p>

                </div>

                {/* READ ONLY NOTICE */}

                <div className="admin-review-readonly">

                  <span>✓</span>

                  <span>
                    Customer feedback ·
                    Read only
                  </span>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default AdminReviews;