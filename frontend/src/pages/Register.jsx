import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================
  // HANDLE INPUT
  // ============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // REGISTER CUSTOMER
  // ============================

  const registerUser = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "/auth/register",
        formData
      );

      alert(
        `OTP Generated: ${res.data.otp}`
      );

      setShowOtpBox(true);
    } catch (error) {
      console.log("Registration Error:", error);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // VERIFY OTP
  // ============================

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "/auth/verify-otp",
        {
          email: formData.email,
          otp,
        }
      );

      alert(
        "Account created successfully!"
      );

      navigate("/login");
    } catch (error) {
      console.log(
        "OTP Verification Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "OTP Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ============================
            HEADER
        ============================ */}

        <div style={styles.header}>
          <p style={styles.eyebrow}>
            MADHAV & CO.
          </p>

          <h1 style={styles.title}>
            Create Your Account
          </h1>

          <p style={styles.subtitle}>
            Join Madhav & Co. and start
            shopping with us.
          </p>
        </div>

        {/* ============================
            REGISTRATION FORM
        ============================ */}

        {!showOtpBox ? (
          <form onSubmit={registerUser}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>
        ) : (
          /* ============================
             OTP VERIFICATION
          ============================ */

          <div>

            <div style={styles.otpIcon}>
              ✉
            </div>

            <h2 style={styles.otpTitle}>
              Verify Your Email
            </h2>

            <p style={styles.otpText}>
              We generated an OTP for:
            </p>

            <strong style={styles.email}>
              {formData.email}
            </strong>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Enter OTP
              </label>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                style={styles.input}
                maxLength={6}
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading
                ? "Verifying..."
                : "Verify & Create Account"}
            </button>

            <button
              onClick={() => {
                setShowOtpBox(false);
                setOtp("");
              }}
              style={styles.backButton}
            >
              ← Back
            </button>

          </div>
        )}

        {/* ============================
            LOGIN LINK
        ============================ */}

        {!showOtpBox && (
          <div style={styles.footer}>
            <span>
              Already have an account?
            </span>

            <button
              onClick={() => navigate("/login")}
              style={styles.loginLink}
            >
              Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// ======================================================
// STYLES
// ======================================================

const styles = {
  page: {
    minHeight: "calc(100vh - 100px)",
    background: "#f7f3ed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#fffdf9",
    border: "1px solid #ded4c6",
    borderRadius: "18px",
    padding: "42px",
    boxSizing: "border-box",
    boxShadow:
      "0 12px 35px rgba(70, 50, 30, 0.08)",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  eyebrow: {
    margin: "0 0 10px",
    fontSize: "11px",
    letterSpacing: "4px",
    color: "#b87545",
    fontWeight: "600",
  },

  title: {
    margin: "0 0 12px",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    fontSize: "34px",
    color: "#2d2118",
  },

  subtitle: {
    margin: 0,
    color: "#806f63",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#4d4037",
    fontSize: "13px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    boxSizing: "border-box",
    border: "1px solid #d9cbbd",
    borderRadius: "9px",
    background: "#ffffff",
    color: "#2d2118",
    fontSize: "14px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "9px",
    padding: "14px",
    background: "#75421f",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "5px",
  },

  footer: {
    marginTop: "28px",
    paddingTop: "22px",
    borderTop: "1px solid #eadfd3",
    textAlign: "center",
    color: "#806f63",
    fontSize: "14px",
  },

  loginLink: {
    border: "none",
    background: "transparent",
    color: "#b87545",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "6px",
    fontSize: "14px",
  },

  otpIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#f1dfcd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  otpTitle: {
    textAlign: "center",
    margin: "0 0 10px",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    color: "#2d2118",
  },

  otpText: {
    textAlign: "center",
    margin: "0 0 5px",
    color: "#806f63",
    fontSize: "14px",
  },

  email: {
    display: "block",
    textAlign: "center",
    marginBottom: "25px",
    color: "#b87545",
  },

  backButton: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    border: "1px solid #d9cbbd",
    borderRadius: "9px",
    background: "transparent",
    color: "#5e554d",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Register;