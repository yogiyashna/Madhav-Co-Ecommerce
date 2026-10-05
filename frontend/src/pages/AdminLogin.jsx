import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Admin login successful");

      navigate("/admin/dashboard");

    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Admin login failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 150px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f3ed",
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#fffdf9",
          border: "1px solid #ded4c6",
          borderRadius: "18px",
          padding: "45px",
          boxSizing: "border-box",
          boxShadow:
            "0 15px 40px rgba(70, 50, 30, 0.10)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              color: "#b87545",
              letterSpacing: "4px",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            ADMIN PORTAL
          </p>

          <h1
            style={{
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              color: "#2d2118",
              fontSize: "36px",
              margin: 0,
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              color: "#74695f",
              marginTop: "12px",
            }}
          >
            Sign in to manage Madhav & Co.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#3d3027",
                fontWeight: "500",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              style={{
                width: "100%",
                padding: "14px",
                boxSizing: "border-box",
                border: "1px solid #d9cdbf",
                borderRadius: "10px",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#3d3027",
                fontWeight: "500",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              style={{
                width: "100%",
                padding: "14px",
                boxSizing: "border-box",
                border: "1px solid #d9cdbf",
                borderRadius: "10px",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#70401f",
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Sign In as Admin
          </button>

        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid #eadfd3",
          }}
        >
          <span style={{ color: "#74695f" }}>
            Customer?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "transparent",
              color: "#b87545",
              fontWeight: "600",
              cursor: "pointer",
              marginLeft: "6px",
            }}
          >
            Login as User
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;