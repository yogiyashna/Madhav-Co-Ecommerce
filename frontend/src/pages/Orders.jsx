import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("ORDERS RESPONSE:", data);

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error("Orders error:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status delivered";

      case "Cancelled":
        return "status cancelled";

      case "Shipped":
        return "status shipped";

      case "Processing":
        return "status processing";

      default:
        return "status pending";
    }
  };

  const getProductImage = (item) => {
    if (item?.image) {
      return item.image;
    }

    if (item?.product?.images) {
      if (Array.isArray(item.product.images)) {
        return item.product.images[0];
      }

      return item.product.images;
    }

    return null;
  };

  /* ==============================
     LOADING
  ============================== */

  if (loading) {
    return (
      <>
        <style>{ordersStyles}</style>

        <div className="orders-page">
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }

  /* ==============================
     PAGE
  ============================== */

  return (
    <>
      <style>{ordersStyles}</style>

      <div className="orders-page">

        {/* ==========================
            HEADER
        =========================== */}

        <div className="orders-header">

          <p className="orders-eyebrow">
            YOUR PURCHASES
          </p>

          <h1>
            My Orders
          </h1>

          <p className="orders-subtitle">
            Track and manage your recent orders
          </p>

        </div>


        {/* ==========================
            EMPTY ORDERS
        =========================== */}

        {orders.length === 0 ? (

          <div className="empty-orders">

            <div className="empty-icon">
              🛍️
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              Your completed purchases will appear here.
            </p>

          </div>

        ) : (

          /* ==========================
             ORDERS
          =========================== */

          <div className="orders-container">

            {orders.map((order) => {

              const items = order.orderItems || [];

              const totalItems = items.reduce(
                (total, item) =>
                  total + Number(item.quantity || 0),
                0
              );

              const orderTotal = Number(
                order.totalPrice ||
                order.total ||
                0
              );

              const status =
                order.orderStatus ||
                order.status ||
                "Pending";

              return (

                <div
                  className="order-card"
                  key={order._id}
                >

                  {/* ======================
                      ORDER TOP
                  ======================= */}

                  <div className="order-top">

                    <div className="order-info">

                      <div className="order-info-item">
                        <span>
                          ORDER ID
                        </span>

                        <strong>
                          #{order._id}
                        </strong>
                      </div>


                      <div className="order-info-item">
                        <span>
                          ORDER DATE
                        </span>

                        <strong>
                          {formatDate(order.createdAt)}
                        </strong>
                      </div>


                      <div className="order-info-item">
                        <span>
                          PAYMENT
                        </span>

                        <strong>
                          {order.paymentMethod || "COD"}
                        </strong>
                      </div>


                      <div className="order-info-item">
                        <span>
                          STATUS
                        </span>

                        <div className={getStatusClass(status)}>
                          <span className="status-dot"></span>
                          {status}
                        </div>
                      </div>

                    </div>

                  </div>


                  {/* ======================
                      PRODUCTS
                  ======================= */}

                  <div className="order-body">

                    <div className="items-header">

                      <div>
                        <h2>
                          Order Items
                        </h2>

                        <p>
                          {totalItems}{" "}
                          {totalItems === 1
                            ? "item"
                            : "items"}
                        </p>
                      </div>

                    </div>


                    <div className="products-list">

                      {items.map((item, index) => {

                        const image =
                          getProductImage(item);

                        const productName =
                          item.name ||
                          item.product?.name ||
                          "Product";

                        const price = Number(
                          item.price ||
                          item.product?.price ||
                          0
                        );

                        const quantity =
                          Number(item.quantity || 0);

                        const itemTotal =
                          price * quantity;

                        return (

                          <div
                            className="product-row"
                            key={
                              item._id || index
                            }
                          >

                            {/* PRODUCT IMAGE */}

                            <div className="product-image">

                              {image ? (

                                <img
                                  src={image}
                                  alt={productName}
                                />

                              ) : (

                                <div className="no-image">
                                  🛍️
                                </div>

                              )}

                            </div>


                            {/* PRODUCT DETAILS */}

                            <div className="product-details">

                              <h3>
                                {productName}
                              </h3>

                              <div className="product-meta">

                                <span>
                                  Quantity:
                                  <b>
                                    {quantity}
                                  </b>
                                </span>

                                <span>
                                  Price:
                                  <b>
                                    ₹{" "}
                                    {price.toLocaleString(
                                      "en-IN"
                                    )}
                                  </b>
                                </span>

                              </div>

                            </div>


                            {/* ITEM TOTAL */}

                            <div className="item-total">

                              <span>
                                ITEM TOTAL
                              </span>

                              <strong>
                                ₹{" "}
                                {itemTotal.toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                            </div>

                          </div>

                        );
                      })}

                    </div>


                    {/* ======================
                        ORDER SUMMARY
                    ======================= */}

                    <div className="order-summary">

                      <div className="summary-left">

                        <span>
                          TOTAL ITEMS
                        </span>

                        <strong>
                          {totalItems}
                        </strong>

                      </div>


                      <div className="summary-right">

                        <span>
                          ORDER TOTAL
                        </span>

                        <strong>
                          ₹{" "}
                          {orderTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}


        {/* ==========================
            FOOTER MESSAGE
        =========================== */}

        {orders.length > 0 && (

          <div className="orders-footer">

            Thank you for shopping with{" "}

            <strong>
              Madhav & Co.
            </strong>

          </div>

        )}

      </div>
    </>
  );
};


/* =====================================================
   ORDERS PAGE CSS
===================================================== */

const ordersStyles = `

* {
  box-sizing: border-box;
}

.orders-page {
  width: 100%;
  min-height: calc(100vh - 100px);

  background: #f7f3ed;
  color: #2d211b;

  padding: 55px 24px 70px;

  overflow-x: hidden;
}


/* ============================
   HEADER
============================ */

.orders-header {
  width: 100%;
  max-width: 1100px;

  margin: 0 auto 48px;

  text-align: center;
}

.orders-eyebrow {
  margin: 0 0 12px;

  color: #b36b3c;

  font-size: 13px;
  font-weight: 600;

  letter-spacing: 4px;
}

.orders-header h1 {
  margin: 0;

  color: #2d211b;

  font-family: Georgia, "Times New Roman", serif;

  font-size: clamp(40px, 5vw, 58px);

  font-weight: 600;

  line-height: 1.1;
}

.orders-subtitle {
  margin: 15px 0 0;

  color: #7d6e63;

  font-size: 17px;
}


/* ============================
   ORDERS CONTAINER
============================ */

.orders-container {
  width: 100%;
  max-width: 1100px;

  margin: 0 auto;
}


/* ============================
   ORDER CARD
============================ */

.order-card {
  width: 100%;

  margin-bottom: 30px;

  overflow: hidden;

  background: #ffffff;

  border: 1px solid #e5d9ce;

  border-radius: 25px;

  box-shadow:
    0 8px 25px rgba(70, 45, 30, 0.06);
}


/* ============================
   ORDER TOP
============================ */

.order-top {
  width: 100%;

  padding: 28px 32px;

  background: #fcfaf7;

  border-bottom: 1px solid #eadfd5;
}

.order-info {
  width: 100%;

  display: grid;

  grid-template-columns:
    1.5fr
    1fr
    0.8fr
    0.8fr;

  gap: 25px;

  align-items: center;
}

.order-info-item {
  min-width: 0;
}

.order-info-item > span {
  display: block;

  margin-bottom: 7px;

  color: #a08069;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 1.8px;
}

.order-info-item strong {
  display: block;

  color: #382920;

  font-size: 14px;

  font-weight: 600;

  word-break: break-word;
}


/* ============================
   STATUS
============================ */

.status {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  width: fit-content;

  padding: 7px 13px;

  border-radius: 50px;

  border: 1px solid;

  font-size: 13px;

  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;

  flex-shrink: 0;

  border-radius: 50%;

  background: currentColor;
}

.status.pending {
  color: #a46220;

  background: #fff7e8;

  border-color: #f0d7ad;
}

.status.processing {
  color: #9a761b;

  background: #fff9e6;

  border-color: #eadba5;
}

.status.shipped {
  color: #28658d;

  background: #edf7fc;

  border-color: #c7e3f0;
}

.status.delivered {
  color: #32734a;

  background: #eff9f1;

  border-color: #cce6d2;
}

.status.cancelled {
  color: #a94343;

  background: #fff0f0;

  border-color: #efcccc;
}


/* ============================
   ORDER BODY
============================ */

.order-body {
  width: 100%;

  padding: 32px;
}


/* ============================
   ITEMS HEADER
============================ */

.items-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 22px;
}

.items-header h2 {
  margin: 0;

  color: #2d211b;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 27px;

  font-weight: 600;
}

.items-header p {
  margin: 5px 0 0;

  color: #89786c;

  font-size: 14px;
}


/* ============================
   PRODUCTS
============================ */

.products-list {
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 14px;
}

.product-row {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 20px;

  padding: 15px;

  background: #faf7f3;

  border: 1px solid #eee4da;

  border-radius: 17px;
}


/* IMAGE */

.product-image {
  width: 105px;
  height: 105px;

  flex: 0 0 105px;

  overflow: hidden;

  background: #f0e7dc;

  border-radius: 13px;
}

.product-image img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  font-size: 28px;
}


/* PRODUCT DETAILS */

.product-details {
  flex: 1;

  min-width: 0;
}

.product-details h3 {
  margin: 0;

  color: #30221b;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 21px;

  font-weight: 600;
}

.product-meta {
  display: flex;

  flex-wrap: wrap;

  gap: 20px;

  margin-top: 10px;

  color: #857468;

  font-size: 14px;
}

.product-meta b {
  margin-left: 5px;

  color: #30221b;

  font-weight: 600;
}


/* ITEM TOTAL */

.item-total {
  min-width: 150px;

  text-align: right;
}

.item-total span {
  display: block;

  margin-bottom: 5px;

  color: #a08069;

  font-size: 10px;

  font-weight: 600;

  letter-spacing: 1.5px;
}

.item-total strong {
  color: #a95f2f;

  font-size: 20px;

  font-weight: 600;
}


/* ============================
   SUMMARY
============================ */

.order-summary {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  margin-top: 28px;

  padding-top: 22px;

  border-top: 1px solid #e5d9ce;
}

.summary-left span,
.summary-right span {
  display: block;

  margin-bottom: 6px;

  color: #857468;

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 1.5px;
}

.summary-left strong {
  color: #30221b;

  font-size: 18px;
}

.summary-right {
  text-align: right;
}

.summary-right strong {
  color: #a95f2f;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 30px;

  font-weight: 600;
}


/* ============================
   FOOTER
============================ */

.orders-footer {
  width: 100%;
  max-width: 1100px;

  margin: 35px auto 0;

  text-align: center;

  color: #8b7869;

  font-size: 14px;
}

.orders-footer strong {
  color: #6f3f20;

  font-family: Georgia, "Times New Roman", serif;
}


/* ============================
   EMPTY
============================ */

.empty-orders {
  width: 100%;
  max-width: 650px;

  margin: 20px auto 80px;

  padding: 65px 35px;

  background: #ffffff;

  border: 1px solid #e5d9ce;

  border-radius: 26px;

  text-align: center;

  box-shadow:
    0 12px 35px rgba(70, 45, 30, 0.07);
}

.empty-icon {
  width: 75px;
  height: 75px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f7eee5;

  font-size: 31px;
}

.empty-orders h2 {
  margin: 0;

  font-family: Georgia, "Times New Roman", serif;

  font-size: 30px;
}

.empty-orders p {
  margin: 12px 0 0;

  color: #806f63;

  font-size: 16px;
}


/* ============================
   LOADING
============================ */

.orders-loading {
  min-height: 70vh;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  color: #6f6259;
}

.loading-spinner {
  width: 38px;
  height: 38px;

  border: 4px solid #e5d9ce;

  border-top-color: #8b4f2b;

  border-radius: 50%;

  animation: orders-spin 0.8s linear infinite;
}

.orders-loading p {
  margin-top: 15px;
}

@keyframes orders-spin {
  to {
    transform: rotate(360deg);
  }
}


/* ==================================================
   TABLET
================================================== */

@media (max-width: 900px) {

  .orders-page {
    padding: 45px 20px 60px;
  }

  .order-info {
    grid-template-columns: 1fr 1fr;
  }

  .order-top,
  .order-body {
    padding: 25px;
  }
}


/* ==================================================
   MOBILE
================================================== */

@media (max-width: 600px) {

  .orders-page {
    width: 100%;

    padding: 30px 12px 45px;
  }

  .orders-header {
    margin-bottom: 30px;
  }

  .orders-eyebrow {
    font-size: 10px;

    letter-spacing: 2.5px;
  }

  .orders-header h1 {
    font-size: 38px;
  }

  .orders-subtitle {
    font-size: 14px;
  }


  /* ORDER CARD */

  .order-card {
    border-radius: 18px;
  }


  /* ORDER INFORMATION */

  .order-top {
    padding: 20px 16px;
  }

  .order-info {
    grid-template-columns: 1fr 1fr;

    gap: 20px 12px;
  }

  .order-info-item > span {
    font-size: 8px;

    letter-spacing: 1.2px;
  }

  .order-info-item strong {
    font-size: 12px;
  }

  .status {
    padding: 6px 9px;

    font-size: 11px;
  }


  /* BODY */

  .order-body {
    padding: 20px 14px;
  }

  .items-header {
    margin-bottom: 16px;
  }

  .items-header h2 {
    font-size: 22px;
  }


  /* PRODUCT */

  .product-row {
    display: grid;

    grid-template-columns: 70px minmax(0, 1fr);

    gap: 12px;

    padding: 12px;

    border-radius: 14px;
  }

  .product-image {
    width: 70px;
    height: 70px;

    flex: none;
  }

  .product-details {
    width: auto;
  }

  .product-details h3 {
    font-size: 17px;

    line-height: 1.2;
  }

  .product-meta {
    display: block;

    margin-top: 7px;

    font-size: 12px;
  }

  .product-meta span {
    display: block;

    margin-bottom: 4px;
  }


  /* ITEM TOTAL */

  .item-total {
    grid-column: 1 / -1;

    width: 100%;

    min-width: 0;

    padding-top: 12px;

    text-align: left;

    border-top: 1px solid #e8ddd3;
  }

  .item-total span {
    font-size: 8px;
  }

  .item-total strong {
    font-size: 17px;
  }


  /* SUMMARY */

  .order-summary {
    margin-top: 20px;

    padding-top: 18px;
  }

  .summary-left span,
  .summary-right span {
    font-size: 8px;

    letter-spacing: 1px;
  }

  .summary-left strong {
    font-size: 16px;
  }

  .summary-right strong {
    font-size: 21px;
  }


  /* EMPTY */

  .empty-orders {
    padding: 45px 20px;
  }

}


/* ==================================================
   VERY SMALL PHONES
================================================== */

@media (max-width: 380px) {

  .orders-page {
    padding-left: 8px;
    padding-right: 8px;
  }

  .orders-header h1 {
    font-size: 32px;
  }

  .order-info {
    gap: 16px 8px;
  }

  .order-body {
    padding: 17px 11px;
  }

  .product-row {
    grid-template-columns: 60px minmax(0, 1fr);

    padding: 10px;
  }

  .product-image {
    width: 60px;
    height: 60px;
  }

  .product-details h3 {
    font-size: 15px;
  }

}
`;

export default Orders;