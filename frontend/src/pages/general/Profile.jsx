import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Profile.css'
import './Home.css'
import '../../styles/variables.css'
import './FoodPartnerProfile.css'
import axios from 'axios'
import VideoPreview from '../../components/VideoPreview'

const Profile = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [videos, setVideos] = useState([])

  useEffect(() => {
    // Fetch user profile
    axios.get('http://localhost:3000/api/auth/me', { withCredentials: true })
      .then(response => {
        setUser(response.data.user)
      })
      .catch(err => {
        console.error('Error fetching user:', err)
      })

    // Fetch saved videos
    axios.get('http://localhost:3000/api/food/savedFoods', { withCredentials: true })
      .then(response => {
        const items = response.data.savedFoods || []
        setVideos(items)
      })
      .catch(err => console.error(err))
  }, [])

  // Get user initials for profile pic
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(user?.fullName || user?.name || 'User')}
        </div>
        <h1 className="profile-name">{user?.fullName || user?.name || 'User'}</h1>
        <p className="profile-email">{user?.email || ''}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{videos.length}</span>
            <span className="profile-stat-label">Saved Videos</span>
          </div>
        </div>
      </div>

      <div className="profile-videos-section">
        <h2 className="profile-section-title">Saved Videos</h2>
        {videos.length === 0 ? (
          <div className="profile-empty-state">
            <p>No saved videos yet</p>
            <p className="profile-empty-subtitle">Save videos from the home page to see them here</p>
          </div>
        ) : (
          <div className="fp-grid">
            {videos.map((video) => (
              <VideoPreview key={video._id} video={video} />
            ))}
          </div>
        )}
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
          onClick={(e) => {
            e.preventDefault()
            navigate('/profile')
          }}
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/profile' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  )
}

export default Profile

