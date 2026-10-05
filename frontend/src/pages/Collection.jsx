import { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";

const Collection = () => {
  const [products, setProducts] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  // =====================================
  // FETCH PRODUCTS
  // =====================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 8);

      if (keyword.trim()) {
        params.append("keyword", keyword.trim());
      }

      if (category.trim()) {
        params.append("category", category.trim());
      }

      if (minPrice) {
        params.append("minPrice", minPrice);
      }

      if (maxPrice) {
        params.append("maxPrice", maxPrice);
      }

      const res = await axios.get(
        `/products?${params.toString()}`
      );

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(
        "Collection Error:",
        error.response?.data || error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // FETCH WHEN FILTER CHANGES
  // =====================================

  useEffect(() => {
    fetchProducts();
  }, [page]);

  // =====================================
  // SEARCH
  // =====================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    fetchProducts();
  };

  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters = () => {
    setKeyword("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  // =====================================
  // CATEGORY CHANGE
  // =====================================

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  // =====================================
  // PRICE CHANGE
  // =====================================

  const handlePriceChange = () => {
    setPage(1);
    fetchProducts();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f3ed",
        paddingBottom: "60px",
      }}
    >

      {/* =====================================
          HEADER
      ===================================== */}

      <section
        style={{
          padding: "55px 20px 35px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#b87545",
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Madhav & Co.
        </p>

        <h1
          style={{
            margin: 0,
            color: "#2d2118",
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            fontSize: "42px",
            fontWeight: "500",
          }}
        >
          Our Collection
        </h1>

        <p
          style={{
            color: "#756b62",
            maxWidth: "600px",
            margin: "15px auto 0",
            lineHeight: "1.7",
            fontSize: "15px",
          }}
        >
          Explore our carefully selected collection
          and find something made just for you.
        </p>
      </section>


      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div
        style={{
          maxWidth: "1350px",
          margin: "0 auto",
          padding: "0 25px",
        }}
      >

        {/* =====================================
            SEARCH
        ===================================== */}

        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            maxWidth: "700px",
            margin: "0 auto 35px",
          }}
        >
          <input
            id="search-box"
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            style={{
              flex: 1,
              padding: "14px 18px",
              border: "1px solid #d8cec0",
              borderRadius: "10px 0 0 10px",
              outline: "none",
              background: "#fffdf9",
              color: "#2d2118",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0 25px",
              border: "none",
              borderRadius: "0 10px 10px 0",
              background: "#2d2118",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Search
          </button>
        </form>


        {/* =====================================
            FILTERS
        ===================================== */}

        <div
          style={{
            background: "#fffdf9",
            border: "1px solid #ded4c6",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "35px",

            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          {/* Category */}

          <select
            value={category}
            onChange={handleCategoryChange}
            style={{
              padding: "11px 15px",
              borderRadius: "8px",
              border: "1px solid #d8cec0",
              background: "#fffdf9",
              color: "#4e453d",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="">
              All Categories
            </option>

            <option value="Men">
              Men
            </option>

            <option value="Women">
              Women
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Shoes">
              Shoes
            </option>

            <option value="Accessories">
              Accessories
            </option>
          </select>


          {/* Minimum Price */}

          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
            style={{
              width: "110px",
              padding: "11px 12px",
              borderRadius: "8px",
              border: "1px solid #d8cec0",
              outline: "none",
              boxSizing: "border-box",
            }}
          />


          {/* Maximum Price */}

          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
            style={{
              width: "110px",
              padding: "11px 12px",
              borderRadius: "8px",
              border: "1px solid #d8cec0",
              outline: "none",
              boxSizing: "border-box",
            }}
          />


          {/* Apply Price */}

          <button
            onClick={handlePriceChange}
            style={{
              padding: "11px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#b87545",
              color: "white",
              cursor: "pointer",
            }}
          >
            Apply
          </button>


          {/* Clear */}

          <button
            onClick={clearFilters}
            style={{
              padding: "11px 18px",
              border: "1px solid #cbbfaf",
              borderRadius: "8px",
              background: "transparent",
              color: "#5e554d",
              cursor: "pointer",
            }}
          >
            Clear
          </button>

        </div>


        {/* =====================================
            PRODUCT COUNT
        ===================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#2d2118",
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              fontWeight: "500",
            }}
          >
            Products
          </h2>

          <span
            style={{
              color: "#756b62",
              fontSize: "14px",
            }}
          >
            {products.length} products
          </span>
        </div>


        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#756b62",
            }}
          >
            <h3>Loading products...</h3>
          </div>
        ) : products.length === 0 ? (

          /* =====================================
              NO PRODUCTS
          ===================================== */

          <div
            style={{
              textAlign: "center",
              background: "#fffdf9",
              border: "1px solid #ded4c6",
              borderRadius: "14px",
              padding: "60px 20px",
            }}
          >
            <h2
              style={{
                color: "#2d2118",
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              No Products Found
            </h2>

            <p
              style={{
                color: "#756b62",
              }}
            >
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              style={{
                marginTop: "10px",
                padding: "12px 22px",
                border: "none",
                borderRadius: "8px",
                background: "#2d2118",
                color: "white",
                cursor: "pointer",
              }}
            >
              View All Products
            </button>
          </div>

        ) : (

          /* =====================================
              PRODUCT GRID
          ===================================== */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "25px",
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


        {/* =====================================
            PAGINATION
        ===================================== */}

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "45px",
            }}
          >

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              style={{
                padding: "10px 18px",
                border: "1px solid #d8cec0",
                borderRadius: "8px",
                background:
                  page === 1
                    ? "#e5ded5"
                    : "#fffdf9",
                color:
                  page === 1
                    ? "#aaa"
                    : "#4e453d",
                cursor:
                  page === 1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              ← Previous
            </button>


            <span
              style={{
                padding: "10px 16px",
                color: "#5e554d",
                fontSize: "14px",
              }}
            >
              Page {page} of {totalPages}
            </span>


            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              style={{
                padding: "10px 18px",
                border: "1px solid #d8cec0",
                borderRadius: "8px",
                background:
                  page === totalPages
                    ? "#e5ded5"
                    : "#fffdf9",
                color:
                  page === totalPages
                    ? "#aaa"
                    : "#4e453d",
                cursor:
                  page === totalPages
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Next →
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Collection;