import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/Authcontext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
       // "http://localhost:5000/User/login",
       "https://mernstack-topaz.vercel.app/User",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success && res.data.token) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        alert(" Login Successful");

      
        if (res.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        alert(" Login failed");
      }
    } catch (err) {
      
      alert(err.response?.data?.message || "Login failed " );
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title"> Login</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="login-toggle">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
