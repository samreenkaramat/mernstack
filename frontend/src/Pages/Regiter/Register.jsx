import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(//"http://localhost:5000/User/register",
        "https://mernstack-topaz.vercel.app/User",
         {
        username,
        email,
        password,
      });

      if (res.data.success) {
        alert("Registration Successful ✅ Please Login");
        setUsername("");
        setEmail("");
        setPassword("");
        navigate("/login"); 
      } else {
        alert(res.data.message || "Registration Failed ");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong ");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="register-title"> Register</h2>

        <input
          type="text"
          placeholder="Username"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="register-btn">
          Register
        </button>

        <p className="register-toggle">
          Already have an account?{" "}
          <Link to="/login" className="register-link">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
