import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import './Profile.css';
import { AuthContext } from "../../Context/Authcontext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          alert("Please login first!");
          navigate("/login"); 
          return;
        }

        const res = await axios.get(//"http://localhost:5000/User/profile",
          "https://mernstack-topaz.vercel.app/User/profile",
           {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile Response:", res.data);

        if (res.data.success && res.data.user) {
          setProfile(res.data.user); 
        } else {
          alert(res.data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Profile fetch error:", error.response || error.message);
        alert("Error fetching profile ");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  if (!profile) return <h3>Loading profile...</h3>;

  const handleLogout = async () => {
    await logout(); 
    navigate("/login"); 
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>

        <button onClick={handleLogout} className="logout-btn">
           Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
