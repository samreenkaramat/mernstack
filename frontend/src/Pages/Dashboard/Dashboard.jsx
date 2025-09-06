import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1> Admin Dashboard</h1>
      <p>Welcome, Admin!</p>
      
     
      <button 
        onClick={handleLogout} 
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#ff4d4f",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
