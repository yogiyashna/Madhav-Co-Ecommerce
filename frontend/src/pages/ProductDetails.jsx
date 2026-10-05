import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import axios from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] =
    useState(0);

  // =====================================================
  // REVIEWS
  // =====================================================

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] =
    useState("");

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res =
        await axios.get(
          `/products/${id}`
        );

      setProduct(
        res.data.product
      );

      // Fetch reviews after product
      // has been loaded
      fetchReviews();
    } catch (error) {
      console.log(
        "PRODUCT DETAILS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  const fetchReviews = async () => {
    try {
      const res =
        await axios.get(
          `/review/${id}`
        );

      console.log(
        "REVIEWS RESPONSE:",
        res.data
      );

      setReviews(
        res.data?.reviews || []
      );
    } catch (error) {
      console.error(
        "GET REVIEWS ERROR:",
        error.response?.data ||
          error.message
      );

      setReviews([]);
    }
  };

  // =====================================================
  // GET USER
  // =====================================================

  const getUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "user"
        ) || "null"
      );
    } catch (error) {
      console.error(
        "INVALID USER DATA:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async () => {
    try {
      const user =
        getUser();

      if (!user) {
        alert(
          "Please Login First"
        );

        navigate("/login");

        return;
      }

      await axios.post(
        "/cart/add",
        {
          userId:
            user.id ||
            user._id,

          productId:
            product._id,

          quantity,
        }
      );

      alert(
        "Product Added To Cart ❤️"
      );

      navigate("/cart");
    } catch (error) {
      console.log(
        "ADD CART ERROR:",
        error.response?.data
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed To Add Cart"
      );
    }
  };

  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  const addToWishlist = async () => {
    try {
      const user =
        getUser();

      if (!user) {
        alert(
          "Please Login First"
        );

        navigate("/login");

        return;
      }

      const res =
        await axios.post(
          "/wishlist/add",
          {
            userId:
              user.id ||
              user._id,

            productId:
              product._id,
          }
        );

      alert(
        res.data.message
      );

      navigate(
        "/wishlist"
      );
    } catch (error) {
      console.log(
        "WISHLIST ERROR:",
        error.response?.data
      );

      if (
        error.response?.status ===
          400 &&
        error.response?.data
          ?.message ===
          "Product already in wishlist"
      ) {
        alert(
          "Product is already in your wishlist ❤️"
        );

        return;
      }

      alert(
        error.response?.data
          ?.message ||
          "Failed To Add Wishlist"
      );
    }
  };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = async () => {
    try {
      const user =
        getUser();

      if (!user) {
        alert(
          "Please Login First"
        );

        navigate("/login");

        return;
      }

      if (!comment.trim()) {
        alert(
          "Please write a review"
        );

        return;
      }

      if (
        rating < 1 ||
        rating > 5
      ) {
        alert(
          "Please select a rating between 1 and 5"
        );

        return;
      }

      setReviewLoading(
        true
      );

      const userId =
        user.id ||
        user._id;

      const userName =
        user.name ||
        user.username ||
        user.fullName ||
        "Customer";

      console.log(
        "SUBMITTING REVIEW:",
        {
          productId: product._id,
          userId,
          name: userName,
          rating,
          comment,
        }
      );

      const res =
        await axios.post(
          "/review",
          {
            productId:
              product._id,

            userId,

            name:
              userName,

            rating:
              Number(rating),

            comment:
              comment.trim(),
          }
        );

      console.log(
        "REVIEW RESPONSE:",
        res.data
      );

      if (
        res.data?.success
      ) {
        alert(
          "Review added successfully ⭐"
        );

        setComment("");

        setRating(5);

        await fetchReviews();

        // Refresh product so
        // average rating/count
        // are updated
        const productRes =
          await axios.get(
            `/products/${id}`
          );

        setProduct(
          productRes.data.product
        );
      } else {
        alert(
          res.data?.message ||
            "Failed to add review"
        );
      }
    } catch (error) {
      console.error(
        "ADD REVIEW ERROR:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to add review"
      );
    } finally {
      setReviewLoading(
        false
      );
    }
  };

  // =====================================================
  // RENDER STARS
  // =====================================================

  const renderStars = (
    value
  ) => {
    const roundedValue =
      Math.round(
        Number(value) || 0
      );

    return (
      <span
        style={{
          color: "#b87545",
          letterSpacing:
            "2px",
        }}
      >
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <span
              key={star}
            >
              {star <=
              roundedValue
                ? "★"
                : "☆"}
            </span>
          )
        )}
      </span>
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight:
            "70vh",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          background:
            "#f7f3ed",

          color:
            "#6b3f21",
        }}
      >
        <h2
          style={{
            fontFamily:
              "Georgia, 'Times New Roman', serif",

            fontWeight:
              "500",
          }}
        >
          Loading product...
        </h2>
      </div>
    );
  }

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <div
        style={{
          minHeight:
            "70vh",

          background:
            "#f7f3ed",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          textAlign:
            "center",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",

              color:
                "#2d2118",
            }}
          >
            Product not found
          </h2>

          <Link
            to="/collection"
            style={{
              color:
                "#6b3f21",

              textDecoration:
                "none",

              fontWeight:
                "600",
            }}
          >
            ← Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // IMAGES
  // =====================================================

  const images =
    product.images?.length >
    0
      ? product.images
      : [
          "https://via.placeholder.com/600x700?text=Product",
        ];

  // =====================================================
  // STOCK
  // =====================================================

  const isOutOfStock =
    product.stock !==
      undefined &&
    product.stock <= 0;

  // =====================================================
  // RATING
  // =====================================================

  const averageRating =
    Number(
      product.rating || 0
    );

  const reviewCount =
    product.numReviews ||
    reviews.length ||
    0;

  return (
    <div
      style={{
        background:
          "#f7f3ed",

        minHeight:
          "calc(100vh - 108px)",

        padding:
          "50px 30px 80px",

        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          maxWidth:
            "1200px",

          margin:
            "0 auto",
        }}
      >
        {/* ================================================= */}
        {/* BREADCRUMB */}
        {/* ================================================= */}

        <div
          style={{
            marginBottom:
              "30px",

            fontSize:
              "13px",

            color:
              "#76695e",
          }}
        >
          <Link
            to="/"
            style={{
              color:
                "#76695e",

              textDecoration:
                "none",
            }}
          >
            Home
          </Link>

          <span
            style={{
              margin:
                "0 8px",
            }}
          >
            /
          </span>

          <Link
            to="/collection"
            style={{
              color:
                "#76695e",

              textDecoration:
                "none",
            }}
          >
            Collection
          </Link>

          <span
            style={{
              margin:
                "0 8px",
            }}
          >
            /
          </span>

          <span>
            {product.name}
          </span>
        </div>

        {/* ================================================= */}
        {/* MAIN PRODUCT CARD */}
        {/* ================================================= */}

        <div
          style={{
            background:
              "#fffdf9",

            border:
              "1px solid #ded4c6",

            borderRadius:
              "22px",

            padding:
              "30px",

            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 1fr) minmax(0, 1fr)",

            gap:
              "55px",

            boxSizing:
              "border-box",
          }}
        >
          {/* ================================================= */}
          {/* LEFT - IMAGES */}
          {/* ================================================= */}

          <div>
            <div
              style={{
                width:
                  "100%",

                height:
                  "560px",

                background:
                  "#eee7df",

                borderRadius:
                  "16px",

                overflow:
                  "hidden",

                marginBottom:
                  "15px",
              }}
            >
              <img
                src={
                  images[
                    selectedImage
                  ]
                }
                alt={
                  product.name
                }
                style={{
                  width:
                    "100%",

                  height:
                    "100%",

                  objectFit:
                    "cover",

                  display:
                    "block",
                }}
              />
            </div>

            {/* THUMBNAILS */}

            {images.length >
              1 && (
              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "10px",

                  overflowX:
                    "auto",
                }}
              >
                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={
                        index
                      }
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      style={{
                        width:
                          "75px",

                        height:
                          "85px",

                        padding:
                          0,

                        border:
                          selectedImage ===
                          index
                            ? "2px solid #b87545"
                            : "1px solid #ded4c6",

                        borderRadius:
                          "8px",

                        overflow:
                          "hidden",

                        background:
                          "#eee7df",

                        cursor:
                          "pointer",

                        flexShrink:
                          0,
                      }}
                    >
                      <img
                        src={
                          image
                        }
                        alt={`${product.name} ${
                          index +
                          1
                        }`}
                        style={{
                          width:
                            "100%",

                          height:
                            "100%",

                          objectFit:
                            "cover",
                        }}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* RIGHT - PRODUCT INFO */}
          {/* ================================================= */}

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              justifyContent:
                "center",
            }}
          >
            {/* BRAND */}

            {product.brand && (
              <p
                style={{
                  margin:
                    "0 0 12px",

                  color:
                    "#b87545",

                  textTransform:
                    "uppercase",

                  letterSpacing:
                    "2px",

                  fontSize:
                    "12px",

                  fontWeight:
                    "700",
                }}
              >
                {product.brand}
              </p>
            )}

            {/* NAME */}

            <h1
              style={{
                margin:
                  "0 0 12px",

                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  "42px",

                lineHeight:
                  "1.15",

                fontWeight:
                  "500",

                color:
                  "#2d2118",
              }}
            >
              {product.name}
            </h1>

            {/* RATING */}

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "10px",

                marginBottom:
                  "18px",
              }}
            >
              {renderStars(
                averageRating
              )}

              <span
                style={{
                  fontSize:
                    "14px",

                  color:
                    "#76695e",
                }}
              >
                {averageRating.toFixed(
                  1
                )}{" "}
                ({reviewCount}{" "}
                {reviewCount ===
                1
                  ? "review"
                  : "reviews"})
              </span>
            </div>

            {/* PRICE */}

            <div
              style={{
                fontSize:
                  "28px",

                fontWeight:
                  "700",

                color:
                  "#6b3f21",

                marginBottom:
                  "25px",
              }}
            >
              ₹{" "}
              {Number(
                product.price ||
                  0
              ).toLocaleString(
                "en-IN"
              )}
            </div>

            {/* DESCRIPTION */}

            <div
              style={{
                borderTop:
                  "1px solid #e5dbcf",

                borderBottom:
                  "1px solid #e5dbcf",

                padding:
                  "22px 0",

                marginBottom:
                  "25px",
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 10px",

                  fontSize:
                    "15px",

                  color:
                    "#2d2118",
                }}
              >
                About this product
              </h3>

              <p
                style={{
                  margin:
                    0,

                  color:
                    "#76695e",

                  lineHeight:
                    "1.8",

                  fontSize:
                    "14px",
                }}
              >
                {product.description ||
                  "A thoughtfully selected product from Madhav & Co."}
              </p>
            </div>

            {/* STOCK */}

            <div
              style={{
                marginBottom:
                  "25px",

                fontSize:
                  "14px",
              }}
            >
              <span
                style={{
                  color:
                    "#76695e",
                }}
              >
                Availability:{" "}
              </span>

              <strong
                style={{
                  color:
                    isOutOfStock
                      ? "#a33"
                      : "#52734d",
                }}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `${product.stock} items available`}
              </strong>
            </div>

            {/* QUANTITY */}

            {!isOutOfStock && (
              <div
                style={{
                  marginBottom:
                    "20px",
                }}
              >
                <p
                  style={{
                    margin:
                      "0 0 9px",

                    fontSize:
                      "13px",

                    fontWeight:
                      "600",

                    color:
                      "#5e554d",
                  }}
                >
                  Quantity
                </p>

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    width:
                      "130px",

                    height:
                      "42px",

                    border:
                      "1px solid #d8cbbd",

                    borderRadius:
                      "8px",

                    overflow:
                      "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity -
                            1
                        )
                      )
                    }
                    style={
                      quantityButtonStyle
                    }
                  >
                    −
                  </button>

                  <span
                    style={{
                      flex: 1,

                      textAlign:
                        "center",

                      fontSize:
                        "14px",

                      fontWeight:
                        "600",
                    }}
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product.stock ||
                            quantity +
                              1,

                          quantity +
                            1
                        )
                      )
                    }
                    style={
                      quantityButtonStyle
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* BUTTONS */}

            <div
              style={{
                display:
                  "flex",

                gap:
                  "12px",

                flexWrap:
                  "wrap",
              }}
            >
              <button
                type="button"
                onClick={
                  addToCart
                }
                disabled={
                  isOutOfStock
                }
                style={{
                  flex: 1,

                  minWidth:
                    "180px",

                  padding:
                    "15px 20px",

                  border:
                    "none",

                  borderRadius:
                    "8px",

                  background:
                    isOutOfStock
                      ? "#b8aea5"
                      : "#6b3f21",

                  color:
                    "#fff",

                  fontSize:
                    "14px",

                  fontWeight:
                    "600",

                  cursor:
                    isOutOfStock
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={
                  addToWishlist
                }
                style={{
                  padding:
                    "15px 20px",

                  border:
                    "1px solid #b87545",

                  borderRadius:
                    "8px",

                  background:
                    "#fff",

                  color:
                    "#6b3f21",

                  fontSize:
                    "14px",

                  fontWeight:
                    "600",

                  cursor:
                    "pointer",
                }}
              >
                ♡ Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* REVIEWS SECTION */}
        {/* ================================================= */}

        <section
          style={{
            marginTop:
              "30px",

            background:
              "#fffdf9",

            border:
              "1px solid #ded4c6",

            borderRadius:
              "22px",

            padding:
              "35px",

            boxSizing:
              "border-box",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap:
                "20px",

              flexWrap:
                "wrap",

              marginBottom:
                "30px",
            }}
          >
            <div>
              <p
                style={{
                  margin:
                    "0 0 7px",

                  color:
                    "#b87545",

                  fontSize:
                    "12px",

                  letterSpacing:
                    "3px",

                  fontWeight:
                    "700",
                }}
              >
                CUSTOMER FEEDBACK
              </p>

              <h2
                style={{
                  margin:
                    0,

                  fontFamily:
                    "Georgia, 'Times New Roman', serif",

                  fontSize:
                    "32px",

                  color:
                    "#2d2118",
                }}
              >
                Customer Reviews
              </h2>
            </div>

            <div
              style={{
                textAlign:
                  "right",
              }}
            >
              <div
                style={{
                  fontSize:
                    "25px",
                }}
              >
                {renderStars(
                  averageRating
                )}
              </div>

              <div
                style={{
                  color:
                    "#76695e",

                  fontSize:
                    "13px",

                  marginTop:
                    "4px",
                }}
              >
                {averageRating.toFixed(
                  1
                )}{" "}
                out of 5 ·{" "}
                {reviewCount}{" "}
                reviews
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* REVIEW FORM */}
          {/* ================================================= */}

          <div
            style={{
              background:
                "#f7f3ed",

              border:
                "1px solid #e5dbcf",

              borderRadius:
                "15px",

              padding:
                "25px",

              marginBottom:
                "30px",
            }}
          >
            <h3
              style={{
                margin:
                  "0 0 18px",

                fontFamily:
                  "Georgia, 'Times New Roman', serif",

                fontSize:
                  "21px",

                color:
                  "#2d2118",
              }}
            >
              Write a Review
            </h3>

            {/* STAR SELECTOR */}

            <div
              style={{
                marginBottom:
                  "18px",
              }}
            >
              <p
                style={{
                  margin:
                    "0 0 8px",

                  fontSize:
                    "13px",

                  fontWeight:
                    "600",

                  color:
                    "#5e554d",
                }}
              >
                Your Rating
              </p>

              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "5px",
                }}
              >
                {[
                  1, 2, 3, 4, 5,
                ].map(
                  (star) => (
                    <button
                      key={
                        star
                      }
                      type="button"
                      onClick={() =>
                        setRating(
                          star
                        )
                      }
                      style={{
                        border:
                          "none",

                        background:
                          "transparent",

                        color:
                          star <=
                          rating
                            ? "#b87545"
                            : "#cdbfb1",

                        fontSize:
                          "31px",

                        cursor:
                          "pointer",

                        padding:
                          "0 2px",
                      }}
                    >
                      ★
                    </button>
                  )
                )}
              </div>
            </div>

            {/* COMMENT */}

            <textarea
              value={
                comment
              }
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Share your experience with this product..."
              rows={5}
              style={{
                width:
                  "100%",

                boxSizing:
                  "border-box",

                resize:
                  "vertical",

                border:
                  "1px solid #d8cbbd",

                borderRadius:
                  "10px",

                padding:
                  "14px",

                background:
                  "#fffdf9",

                color:
                  "#2d2118",

                fontSize:
                  "14px",

                outline:
                  "none",

                fontFamily:
                  "inherit",

                marginBottom:
                  "15px",
              }}
            />

            <button
              type="button"
              onClick={
                submitReview
              }
              disabled={
                reviewLoading
              }
              style={{
                padding:
                  "13px 22px",

                border:
                  "none",

                borderRadius:
                  "9px",

                background:
                  reviewLoading
                    ? "#b8aea5"
                    : "#713f21",

                color:
                  "#fff",

                fontWeight:
                  "700",

                cursor:
                  reviewLoading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>

          {/* ================================================= */}
          {/* REVIEW LIST */}
          {/* ================================================= */}

          {reviews.length ===
          0 ? (
            <div
              style={{
                textAlign:
                  "center",

                padding:
                  "35px 10px",

                color:
                  "#796b5f",
              }}
            >
              <div
                style={{
                  fontSize:
                    "38px",

                  marginBottom:
                    "10px",
                }}
              >
                ☆
              </div>

              <p
                style={{
                  margin:
                    0,

                  fontSize:
                    "15px",
                }}
              >
                No reviews yet.
                Be the first to
                review this
                product!
              </p>
            </div>
          ) : (
            <div
              style={{
                display:
                  "flex",

                flexDirection:
                  "column",

                gap:
                  "18px",
              }}
            >
              {reviews.map(
                (
                  review,
                  index
                ) => (
                  <div
                    key={
                      review._id ||
                      index
                    }
                    style={{
                      padding:
                        "22px",

                      border:
                        "1px solid #e5dbcf",

                      borderRadius:
                        "14px",

                      background:
                        "#fff",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "flex-start",

                        gap:
                          "15px",

                        marginBottom:
                          "10px",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            color:
                              "#2d2118",

                            fontSize:
                              "15px",
                          }}
                        >
                          {review.name ||
                            "Customer"}
                        </strong>

                        <div
                          style={{
                            marginTop:
                              "5px",

                            fontSize:
                              "16px",
                          }}
                        >
                          {renderStars(
                            review.rating
                          )}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize:
                            "12px",

                          color:
                            "#95877b",
                        }}
                      >
                        Verified Review
                      </span>
                    </div>

                    <p
                      style={{
                        margin:
                          0,

                        color:
                          "#66584d",

                        lineHeight:
                          "1.7",

                        fontSize:
                          "14px",
                      }}
                    >
                      {
                        review.comment
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// =====================================================
// QUANTITY BUTTON STYLE
// =====================================================

const quantityButtonStyle = {
  width:
    "40px",

  height:
    "100%",

  border:
    "none",

  background:
    "#f7f3ed",

  color:
    "#6b3f21",

  fontSize:
    "20px",

  cursor:
    "pointer",
};

export default ProductDetails;