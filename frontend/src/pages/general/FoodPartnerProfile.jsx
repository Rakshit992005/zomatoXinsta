import React, { useEffect, useState } from "react";
import "./FoodPartnerProfile.css";
import "./Home.css";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoPreview from "../../components/VideoPreview";

const FoodPartnerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleProfileClick = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:3000/api/auth/me', { withCredentials: true })
      if (response.data.userType === 'foodPartner') {
        navigate(`/food-partner/${response.data.user._id}`)
      } else {
        navigate('/profile')
      }
    } catch (error) {
      console.error('Error checking user type:', error)
      navigate('/user/login')
    }
  } 

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
        {videos.map((video) => (
          <VideoPreview key={video._id} video={video} />
        ))}
      </div>

      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>home</span>
        </Link>
        <a 
          href="#" 
          onClick={handleProfileClick}
          className={`nav-item ${location.pathname === '/profile' || location.pathname.startsWith('/food-partner/') ? 'active' : ''}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/profile' || location.pathname.startsWith('/food-partner/') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>profile</span>
        </a>
        <Link to="/saved" className={`nav-item ${location.pathname === '/saved' ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/saved' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>saved</span>
        </Link>
      </nav>
    </div>
  );
};

export default FoodPartnerProfile;
