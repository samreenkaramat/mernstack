import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/User/logout", {}, { withCredentials: true });
      setToken(null);
      localStorage.removeItem("token");
      alert("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      alert(" Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
