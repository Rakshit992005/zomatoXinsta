import React, { useEffect, useState } from "react";
import "./FoodPartnerProfile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const FoodPartnerProfile = () => {
  const { id } = useParams();
  const [profile, setprofile] = useState(null)
  const [videos, setvideos] = useState([]);
  useEffect(() => {
    // Fetch profile data using the id from params
    axios.get(`http://localhost:3000/api/food-partner/${id}` , { withCredentials: true })
      .then(response => {
        setprofile(response.data.foodPartner);
        setvideos(response.data.foodItems);
      })
  }, [id]); 

  return (
    <div className="fp-container">
      {/* Header */}
      <div className="fp-header">
        <div className="fp-avatar" />

        <div className="fp-info">
          <div className="fp-name">{profile?.name}</div>
          <div className="fp-address">{profile?.address}</div>
        </div>

        <div className="fp-stats">
          <div className="fp-stat">
            <span className="fp-stat-value">43</span>
            <span className="fp-stat-label">Total Meals</span>
          </div>
          <div className="fp-stat">
            <span className="fp-stat-value">15K</span>
            <span className="fp-stat-label">Customers Served</span>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="fp-grid">
        {videos.map((video, i) => (
          <div key={i} className="fp-video">
            <video src={video.video} muted></video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodPartnerProfile;
