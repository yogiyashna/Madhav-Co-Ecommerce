import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const image =
    product.images?.[0] ||
    "https://via.placeholder.com/500x500?text=Product";

  return (
    <div
      style={{
        background: "#fffdf9",
        border: "1px solid #ded4c6",
        borderRadius: "16px",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-5px)";

        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(70, 50, 30, 0.10)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* IMAGE */}

      <Link
        to={`/product/${product._id}`}
        style={{
          textDecoration: "none",
          display: "block",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "280px",
            background: "#eee7df",
            overflow: "hidden",
          }}
        >
          <img
            src={image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "scale(1.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "scale(1)";
            }}
          />
        </div>
      </Link>

      {/* CONTENT */}

      <div
        style={{
          padding: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
            color: "#2d2118",
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            fontSize: "21px",
            fontWeight: "500",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            margin: "0 0 16px",
            color: "#76695e",
            fontSize: "13px",
            lineHeight: "1.6",
            minHeight: "42px",
          }}
        >
          {product.description
            ? product.description.length > 75
              ? product.description.substring(0, 75) + "..."
              : product.description
            : "Beautifully selected for you."}
        </p>

        {/* PRICE + BUTTON */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#6b3f21",
            }}
          >
            ₹ {product.price}
          </span>

          <Link
            to={`/product/${product._id}`}
            style={{
              textDecoration: "none",
              background: "#6b3f21",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "7px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;