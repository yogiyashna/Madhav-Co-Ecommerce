import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        setError(
          response.data.message || "Failed to fetch users"
        );
      }
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have admin access.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load users"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${user.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/users/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((currentUsers) =>
        currentUsers.filter(
          (item) => item._id !== user._id
        )
      );

      alert("User deleted successfully.");
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue) ||
        user.role?.toLowerCase().includes(searchValue)
      );
    });
  }, [users, search]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // AVATAR
  // ==========================================

  const getInitial = (name) => {
    return name
      ? name.charAt(0).toUpperCase()
      : "U";
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main style={styles.page}>

      {/* ======================================
          HEADER
      ====================================== */}

      <div style={styles.header}>

        <div>
          <p style={styles.eyebrow}>
            ADMINISTRATION
          </p>

          <h1 style={styles.title}>
            Users
          </h1>

          <p style={styles.subtitle}>
            Manage registered customers and
            account information.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/admin/dashboard")
          }
          style={styles.dashboardButton}
        >
          ← Dashboard
        </button>

      </div>

      {/* ======================================
          STATS
      ====================================== */}

      <section style={styles.statsGrid}>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            👥
          </div>

          <div>
            <p style={styles.statLabel}>
              Total Users
            </p>

            <h2 style={styles.statValue}>
              {users.length}
            </h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            ✓
          </div>

          <div>
            <p style={styles.statLabel}>
              Verified
            </p>

            <h2 style={styles.statValue}>
              {
                users.filter(
                  (user) => user.isVerified
                ).length
              }
            </h2>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            🛡
          </div>

          <div>
            <p style={styles.statLabel}>
              Admins
            </p>

            <h2 style={styles.statValue}>
              {
                users.filter(
                  (user) => user.role === "admin"
                ).length
              }
            </h2>
          </div>
        </div>

      </section>

      {/* ======================================
          MAIN CARD
      ====================================== */}

      <section style={styles.card}>

        {/* SEARCH HEADER */}

        <div style={styles.cardHeader}>

          <div>
            <p style={styles.sectionEyebrow}>
              CUSTOMER MANAGEMENT
            </p>

            <h2 style={styles.sectionTitle}>
              Registered Users
            </h2>
          </div>

          <div style={styles.searchWrapper}>

            <span style={styles.searchIcon}>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={styles.searchInput}
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                style={styles.clearSearch}
              >
                ×
              </button>
            )}

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div style={styles.errorBox}>
            <strong>
              Unable to load users
            </strong>

            <p>{error}</p>

            <button
              onClick={fetchUsers}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && !error && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>

            <p>
              Loading users...
            </p>
          </div>
        )}

        {/* ======================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          filteredUsers.length === 0 && (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                👤
              </div>

              <h3>
                {search
                  ? "No users found"
                  : "No users yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "Registered customers will appear here."}
              </p>

            </div>
          )}

        {/* ======================================
            TABLE
        ====================================== */}

        {!loading &&
          !error &&
          filteredUsers.length > 0 && (
            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>

                    <th style={styles.th}>
                      USER
                    </th>

                    <th style={styles.th}>
                      EMAIL
                    </th>

                    <th style={styles.th}>
                      PHONE
                    </th>

                    <th style={styles.th}>
                      ROLE
                    </th>

                    <th style={styles.th}>
                      STATUS
                    </th>

                    <th style={styles.th}>
                      JOINED
                    </th>

                    <th
                      style={{
                        ...styles.th,
                        textAlign: "right",
                      }}
                    >
                      ACTION
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.map((user) => (

                    <tr
                      key={user._id}
                      style={styles.tr}
                    >

                      {/* USER */}

                      <td style={styles.td}>

                        <div style={styles.userCell}>

                          <div style={styles.avatar}>

                            {user.profilePic ? (
                              <img
                                src={user.profilePic}
                                alt={user.name}
                                style={
                                  styles.avatarImage
                                }
                              />
                            ) : (
                              getInitial(user.name)
                            )}

                          </div>

                          <div>
                            <strong
                              style={
                                styles.userName
                              }
                            >
                              {user.name ||
                                "Unnamed User"}
                            </strong>

                            <span
                              style={
                                styles.userId
                              }
                            >
                              ID:{" "}
                              {user._id
                                ?.toString()
                                .slice(-8)}
                            </span>
                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td style={styles.td}>
                        <span
                          style={
                            styles.emailText
                          }
                        >
                          {user.email}
                        </span>
                      </td>

                      {/* PHONE */}

                      <td style={styles.td}>
                        {user.phone || "Not Added"}
                      </td>

                      {/* ROLE */}

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.roleBadge,
                            ...(user.role ===
                            "admin"
                              ? styles.adminBadge
                              : {}),
                          }}
                        >
                          {user.role || "user"}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(user.isVerified
                              ? styles.verified
                              : styles.unverified),
                          }}
                        >
                          <span>
                            {user.isVerified
                              ? "●"
                              : "●"}
                          </span>

                          {user.isVerified
                            ? "Verified"
                            : "Unverified"}
                        </span>

                      </td>

                      {/* JOINED */}

                      <td style={styles.td}>
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* ACTION */}

                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                        }}
                      >

                        {user.role === "admin" ? (
                          <span
                            style={
                              styles.protectedText
                            }
                          >
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleDelete(user)
                            }
                            style={
                              styles.deleteButton
                            }
                          >
                            Delete
                          </button>
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        {/* FOOTER */}

        {!loading &&
          !error &&
          users.length > 0 && (
            <div style={styles.cardFooter}>
              Showing{" "}
              <strong>
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong>
                {users.length}
              </strong>{" "}
              users
            </div>
          )}

      </section>

    </main>
  );
};

// ==================================================
// STYLES
// ==================================================

const styles = {
  page: {
    minHeight: "calc(100vh - 105px)",
    background: "#f7f3ed",
    padding: "55px 5%",
    color: "#2d2118",
    boxSizing: "border-box",
  },

  header: {
    maxWidth: "1200px",
    margin: "0 auto 35px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
  },

  eyebrow: {
    margin: "0 0 8px",
    fontSize: "11px",
    letterSpacing: "4px",
    color: "#b87545",
    fontWeight: "600",
  },

  title: {
    margin: 0,
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "48px",
    fontWeight: "600",
  },

  subtitle: {
    margin: "10px 0 0",
    color: "#77685c",
    fontSize: "15px",
  },

  dashboardButton: {
    border: "1px solid #d9c7b7",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#fffdf9",
    color: "#5c4637",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  statsGrid: {
    maxWidth: "1200px",
    margin: "0 auto 25px",
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },

  statCard: {
    background: "#fffdf9",
    border: "1px solid #e4d8cb",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow:
      "0 8px 25px rgba(65,43,25,0.04)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "13px",
    background: "#f3dfcc",
    color: "#a96538",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  statLabel: {
    margin: 0,
    color: "#88776a",
    fontSize: "12px",
  },

  statValue: {
    margin: "3px 0 0",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "28px",
  },

  card: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#fffdf9",
    border: "1px solid #e4d8cb",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow:
      "0 12px 35px rgba(65,43,25,0.05)",
  },

  cardHeader: {
    padding: "25px 28px",
    borderBottom: "1px solid #eadfd4",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },

  sectionEyebrow: {
    margin: "0 0 5px",
    fontSize: "10px",
    letterSpacing: "3px",
    color: "#b87545",
    fontWeight: "600",
  },

  sectionTitle: {
    margin: 0,
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "25px",
  },

  searchWrapper: {
    position: "relative",
    width: "280px",
  },

  searchIcon: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "13px",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 38px 12px 38px",
    border: "1px solid #dfd1c3",
    borderRadius: "10px",
    background: "#fffdf9",
    color: "#2d2118",
    fontSize: "14px",
    outline: "none",
  },

  clearSearch: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#8a7768",
    fontSize: "20px",
    cursor: "pointer",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "950px",
    borderCollapse: "collapse",
  },

  th: {
    padding: "16px 18px",
    background: "#faf6f0",
    color: "#907c6c",
    fontSize: "10px",
    letterSpacing: "1.5px",
    fontWeight: "600",
    textAlign: "left",
    borderBottom: "1px solid #eadfd4",
    whiteSpace: "nowrap",
  },

  tr: {
    borderBottom: "1px solid #eee5da",
  },

  td: {
    padding: "16px 18px",
    fontSize: "13px",
    color: "#554940",
    verticalAlign: "middle",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#c9824d",
    color: "#fffdf9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontWeight: "600",
    fontSize: "17px",
    overflow: "hidden",
    flexShrink: 0,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  userName: {
    display: "block",
    color: "#2d2118",
    fontSize: "14px",
  },

  userId: {
    display: "block",
    marginTop: "3px",
    color: "#a08d7e",
    fontSize: "10px",
  },

  emailText: {
    color: "#6b5b4e",
  },

  roleBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#f3eadf",
    color: "#8a6347",
    fontSize: "11px",
    textTransform: "capitalize",
  },

  adminBadge: {
    background: "#ead3bc",
    color: "#75431f",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    whiteSpace: "nowrap",
  },

  verified: {
    background: "#edf5ed",
    color: "#547452",
  },

  unverified: {
    background: "#faf0e5",
    color: "#a56b42",
  },

  deleteButton: {
    border: "1px solid #e2b7a7",
    borderRadius: "8px",
    padding: "8px 13px",
    background: "#fff7f4",
    color: "#a94b32",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  protectedText: {
    color: "#a08d7e",
    fontSize: "11px",
    fontStyle: "italic",
  },

  cardFooter: {
    padding: "15px 28px",
    background: "#faf6f0",
    borderTop: "1px solid #eadfd4",
    color: "#88776a",
    fontSize: "12px",
  },

  loading: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#77685c",
  },

  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #eadfd4",
    borderTop: "3px solid #b87545",
    borderRadius: "50%",
    marginBottom: "12px",
    animation: "spin 1s linear infinite",
  },

  emptyState: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "30px",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#f3dfcc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    marginBottom: "15px",
  },

  errorBox: {
    margin: "25px",
    padding: "20px",
    borderRadius: "12px",
    background: "#fff5f2",
    border: "1px solid #e8c4b8",
    color: "#8d4938",
  },

  retryButton: {
    marginTop: "10px",
    border: "none",
    borderRadius: "8px",
    padding: "9px 15px",
    background: "#70401f",
    color: "#fffdf9",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminUsers;