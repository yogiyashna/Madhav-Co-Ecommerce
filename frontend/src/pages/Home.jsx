import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/products");

      setProducts(data.products || []);
    } catch (error) {
      console.log("PRODUCT FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      style={{
        background: "#f7f3ed",
        minHeight: "calc(100vh - 108px)",
        color: "#2d2118",
      }}
    >
      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "70px 40px 50px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minHeight: "430px",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, #e8d5c0 0%, #f7eee5 50%, #dfc1a5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
            padding: "60px",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT CONTENT */}

          <div
            style={{
              maxWidth: "600px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#8a5a38",
                fontWeight: "600",
                marginBottom: "18px",
              }}
            >
              Curated for you
            </p>

            <h1
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontSize: "58px",
                lineHeight: "1.05",
                margin: "0 0 22px",
                fontWeight: "500",
                color: "#2d2118",
              }}
            >
              Timeless pieces.
              <br />
              <span style={{ color: "#b87545" }}>
                Modern living.
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.7",
                color: "#66584d",
                maxWidth: "520px",
                marginBottom: "30px",
              }}
            >
              Discover thoughtfully selected products designed
              to bring comfort, elegance and character to your
              everyday life.
            </p>

            <Link
              to="/collection"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                background: "#6b3f21",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.3px",
              }}
            >
              Explore Collection
            </Link>
          </div>

          {/* DECORATIVE CIRCLE */}

          <div
            style={{
              position: "absolute",
              right: "-90px",
              top: "-90px",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background: "rgba(184,117,69,0.16)",
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "70px",
              bottom: "-130px",
              width: "330px",
              height: "330px",
              borderRadius: "50%",
              background: "rgba(107,63,33,0.08)",
            }}
          />
        </div>
      </section>

      {/* =====================================
          FEATURE STRIP
      ====================================== */}

      <section
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 40px 60px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          <Feature
            title="Thoughtfully Selected"
            text="Products chosen with quality and style in mind."
          />

          <Feature
            title="Simple Shopping"
            text="A smooth experience from discovery to checkout."
          />

          <Feature
            title="Made for Everyday"
            text="Beautiful products that fit naturally into your life."
          />
        </div>
      </section>

      {/* =====================================
          PRODUCTS SECTION
      ====================================== */}

      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px 40px 80px",
          boxSizing: "border-box",
        }}
      >
        {/* SECTION HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "30px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                color: "#b87545",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontWeight: "600",
              }}
            >
              Our Products
            </p>

            <h2
              style={{
                margin: 0,
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontSize: "38px",
                fontWeight: "500",
              }}
            >
              Explore our collection
            </h2>
          </div>

          <Link
            to="/collection"
            style={{
              color: "#6b3f21",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            View all →
          </Link>
        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#76695e",
            }}
          >
            <p>Loading products...</p>
          </div>
        )}

        {/* NO PRODUCTS */}

        {!loading && products.length === 0 && (
          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #ded4c6",
              borderRadius: "16px",
              padding: "70px 20px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
                fontSize: "25px",
                marginBottom: "10px",
              }}
            >
              No products available
            </h3>

            <p style={{ color: "#76695e" }}>
              Products will appear here once they are added.
            </p>
          </div>
        )}

        {/* PRODUCTS */}

        {!loading && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "28px",
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* =====================================
   FEATURE COMPONENT
===================================== */

const Feature = ({ title, text }) => {
  return (
    <div
      style={{
        background: "#fffdf9",
        border: "1px solid #ded4c6",
        borderRadius: "14px",
        padding: "25px",
      }}
    >
      <h3
        style={{
          margin: "0 0 8px",
          fontFamily:
            "Georgia, 'Times New Roman', serif",
          fontSize: "19px",
          fontWeight: "500",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#76695e",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default Home;