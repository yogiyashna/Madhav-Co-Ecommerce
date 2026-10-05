import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN USER:", res.data.user);
      console.log("LOGIN ROLE:", res.data.user.role);

      // =====================================
      // SAVE AUTH DATA
      // =====================================

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // =====================================
      // IMPORTANT
      // TELL NAVBAR THAT LOGIN HAPPENED
      // =====================================

      window.dispatchEvent(
        new Event("authChanged")
      );

      alert("Login Successful");

      // =====================================
      // REDIRECT ACCORDING TO ROLE
      // =====================================

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "35px",
          background: "#fffdf9",
          borderRadius: "18px",
          border: "1px solid #ded4c6",
          boxShadow:
            "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >

        <h1
          style={{
            textAlign: "center",
            fontFamily:
              "Georgia, 'Times New Roman', serif",
            color: "#2d2118",
            marginBottom: "30px",
          }}
        >
          Login
        </h1>

        <form onSubmit={loginUser}>

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={inputStyle}
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={inputStyle}
          />

          {/* LOGIN */}

          <button
            type="submit"
            style={loginButtonStyle}
          >
            Login
          </button>

        </form>

        {/* REGISTER */}

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#666",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#b87545",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  marginBottom: "15px",
  border: "1px solid #d8cbbd",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "14px",
  outline: "none",
};

const loginButtonStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  background: "#6b3f21",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

export default Login;