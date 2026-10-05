import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  // =========================
  // STATES
  // =========================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // =========================
  // FETCH PROFILE
  // =========================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (!storedUser?.id || !token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${storedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileUser = res.data.user;

      setUser(profileUser);

      setFormData({
        name: profileUser.name || "",
        email: profileUser.email || "",
        phone: profileUser.phone || "",
      });
    } catch (error) {
      console.log(
        "Profile Fetch Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // INPUT HANDLERS
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/profile/${storedUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = {
        ...storedUser,
        ...res.data.user,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(res.data.user);

      setEditing(false);

      window.dispatchEvent(new Event("authChanged"));

      alert(
        res.data.message ||
          "Profile updated successfully"
      );
    } catch (error) {
      console.log(
        "Profile Update Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const changePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      alert("New passwords do not match");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword:
            passwordData.currentPassword,

          newPassword:
            passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        res.data.message ||
          "Password changed successfully"
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setChangingPassword(false);
    } catch (error) {
      console.log(
        "Change Password Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to change password"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(
      new Event("authChanged")
    );

    navigate("/login");
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditing(false);

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loader}></div>

        <p>Loading your profile...</p>
      </div>
    );
  }

  // =========================
  // USER NOT FOUND
  // =========================

  if (!user) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>!</div>

          <h2>Unable to load profile</h2>

          <p>
            We couldn't retrieve your account
            information.
          </p>

          <button
            onClick={fetchProfile}
            style={styles.primaryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // AVATAR
  // =========================

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  // =========================
  // UI
  // =========================

  return (
    <main style={styles.page}>

      {/* =========================
          HEADER
      ========================= */}

      <section style={styles.header}>
        <p style={styles.eyebrow}>
          YOUR ACCOUNT
        </p>

        <h1 style={styles.title}>
          My Profile
        </h1>

        <p style={styles.subtitle}>
          Manage your personal information and
          account settings.
        </p>
      </section>

      {/* =========================
          PROFILE CARD
      ========================= */}

      <section style={styles.profileCard}>

        {/* PROFILE HEADER */}

        <div style={styles.profileHeader}>

          <div style={styles.avatar}>
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                style={styles.avatarImage}
              />
            ) : (
              initial
            )}
          </div>

          <div style={styles.profileHeading}>
            <h2 style={styles.profileName}>
              {user.name}
            </h2>

            <p>{user.email}</p>

            <span style={styles.roleBadge}>
              {user.role || "User"}
            </span>
          </div>

        </div>

        {/* =========================
            INFORMATION
        ========================= */}

        {!editing ? (
          <div style={styles.infoSection}>

            <div style={styles.infoGrid}>

              <div style={styles.infoItem}>
                <span style={styles.label}>
                  Full Name
                </span>

                <strong>
                  {user.name || "Not Added"}
                </strong>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>
                  Email Address
                </span>

                <strong>
                  {user.email || "Not Added"}
                </strong>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>
                  Phone Number
                </span>

                <strong>
                  {user.phone || "Not Added"}
                </strong>
              </div>

              <div style={styles.infoItem}>
                <span style={styles.label}>
                  Account Type
                </span>

                <strong>
                  {user.role || "User"}
                </strong>
              </div>

            </div>

            {/* =========================
                ACTIONS
            ========================= */}

            <div style={styles.actions}>

              {/* ADMIN DASHBOARD */}

              {user.role === "admin" && (
                <button
                  onClick={() =>
                    navigate("/admin/dashboard")
                  }
                  style={styles.adminButton}
                >
                  Admin Dashboard
                </button>
              )}

              {/* EDIT PROFILE */}

              <button
                onClick={() => {
                  setEditing(true);
                  setChangingPassword(false);
                }}
                style={styles.primaryButton}
              >
                Edit Profile
              </button>

              {/* CHANGE PASSWORD */}

              <button
                onClick={() =>
                  setChangingPassword(
                    !changingPassword
                  )
                }
                style={styles.secondaryButton}
              >
                {changingPassword
                  ? "Close Password"
                  : "Change Password"}
              </button>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                style={styles.logoutButton}
              >
                Logout
              </button>

            </div>

          </div>
        ) : (

          /* =========================
             EDIT PROFILE
          ========================= */

          <div style={styles.formSection}>

            <h3 style={styles.sectionTitle}>
              Edit Profile
            </h3>

            <div style={styles.formGrid}>

              <div style={styles.inputGroup}>
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

            </div>

            <div style={styles.actions}>

              <button
                onClick={updateProfile}
                style={styles.primaryButton}
              >
                Save Changes
              </button>

              <button
                onClick={cancelEdit}
                style={styles.secondaryButton}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </section>

      {/* =========================
          CHANGE PASSWORD
      ========================= */}

      {changingPassword && !editing && (
        <section style={styles.passwordCard}>

          <div>
            <p style={styles.eyebrow}>
              SECURITY
            </p>

            <h2 style={styles.sectionTitle}>
              Change Password
            </h2>

            <p style={styles.sectionDescription}>
              Keep your account secure by using
              a strong password.
            </p>
          </div>

          <div style={styles.formGrid}>

            <div style={styles.inputGroup}>
              <label>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  passwordData.currentPassword
                }
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordData.newPassword
                }
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  passwordData.confirmPassword
                }
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                style={styles.input}
              />
            </div>

          </div>

          <div style={styles.actions}>

            <button
              onClick={changePassword}
              style={styles.primaryButton}
            >
              Update Password
            </button>

            <button
              onClick={() => {
                setChangingPassword(false);

                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              style={styles.secondaryButton}
            >
              Cancel
            </button>

          </div>

        </section>
      )}

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
    padding: "65px 6%",
    color: "#2d2118",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "45px",
  },

  eyebrow: {
    margin: "0 0 10px",
    fontSize: "12px",
    letterSpacing: "4px",
    color: "#b87545",
    fontWeight: "600",
  },

  title: {
    margin: 0,
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "52px",
    fontWeight: "600",
  },

  subtitle: {
    marginTop: "12px",
    color: "#77685c",
    fontSize: "16px",
  },

  profileCard: {
    maxWidth: "1000px",
    margin: "0 auto",
    background: "#fffdf9",
    border: "1px solid #e4d8cb",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow:
      "0 15px 40px rgba(65,43,25,0.07)",
  },

  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "35px",
    background:
      "linear-gradient(135deg, #f3dfcc, #ead0b7)",
    borderBottom:
      "1px solid #e4d8cb",
  },

  avatar: {
    width: "90px",
    height: "90px",
    flexShrink: 0,
    borderRadius: "50%",
    background: "#b87545",
    color: "#fffdf9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "38px",
    fontWeight: "600",
    overflow: "hidden",
    border: "4px solid #fffdf9",
    boxShadow:
      "0 5px 20px rgba(80,50,30,0.12)",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  profileHeading: {
    flex: 1,
  },

  profileName: {
    margin: "0 0 6px",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "28px",
    color: "#2d2118",
  },

  roleBadge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "5px 12px",
    borderRadius: "20px",
    background: "#fffdf9",
    color: "#9b633b",
    fontSize: "12px",
    textTransform: "capitalize",
    border: "1px solid #dfc5ac",
  },

  infoSection: {
    padding: "35px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "25px",
  },

  infoItem: {
    padding: "20px",
    background: "#faf7f2",
    border: "1px solid #eadfd4",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#a48c7a",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "30px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    background: "#70401f",
    color: "#fffdf9",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #d9c7b7",
    borderRadius: "10px",
    padding: "13px 22px",
    background: "#fffdf9",
    color: "#5c4637",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // =========================
  // ADMIN DASHBOARD BUTTON
  // =========================

  adminButton: {
    border: "none",
    borderRadius: "10px",
    padding: "13px 22px",
    background: "#b87545",
    color: "#fffdf9",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  logoutButton: {
    border: "1px solid #e2b7a7",
    borderRadius: "10px",
    padding: "13px 22px",
    background: "#fff7f4",
    color: "#a94b32",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "auto",
  },

  formSection: {
    padding: "35px",
  },

  passwordCard: {
    maxWidth: "1000px",
    margin: "25px auto 0",
    background: "#fffdf9",
    border: "1px solid #e4d8cb",
    borderRadius: "24px",
    padding: "35px",
    boxShadow:
      "0 15px 40px rgba(65,43,25,0.06)",
  },

  sectionTitle: {
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "25px",
    margin: "0 0 8px",
  },

  sectionDescription: {
    color: "#77685c",
    marginTop: "5px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    border: "1px solid #dfd1c3",
    borderRadius: "10px",
    background: "#fffdf9",
    color: "#2d2118",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  loadingPage: {
    minHeight: "calc(100vh - 105px)",
    background: "#f7f3ed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#77685c",
  },

  loader: {
    width: "35px",
    height: "35px",
    border:
      "3px solid #eadfd4",
    borderTop:
      "3px solid #b87545",
    borderRadius: "50%",
    marginBottom: "15px",
  },

  errorPage: {
    minHeight: "calc(100vh - 105px)",
    background: "#f7f3ed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },

  errorCard: {
    maxWidth: "450px",
    width: "100%",
    textAlign: "center",
    background: "#fffdf9",
    border:
      "1px solid #e4d8cb",
    borderRadius: "20px",
    padding: "40px",
    boxShadow:
      "0 15px 40px rgba(65,43,25,0.07)",
  },

  errorIcon: {
    width: "45px",
    height: "45px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#f3dfcc",
    color: "#a94b32",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
};

export default Profile;