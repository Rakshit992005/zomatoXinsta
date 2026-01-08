import React, { useState, useEffect, useRef } from 'react'
import './Home.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Home = () => {
  const location = useLocation()
  const [videos, setVideos] = useState([])
  const observerRef = useRef(null)
  const [likedItems, setLikedItems] = useState({})
  const [savedItems, setSavedItems] = useState({})

  useEffect(() => {
    axios.get('http://localhost:3000/api/food', { withCredentials: true })
      .then(response => setVideos(response.data.foodItems || response.data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    const videoEls = Array.from(document.querySelectorAll('.reel-video'))
    if (!videoEls.length) return

    if (observerRef.current) observerRef.current.disconnect()

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const vid = entry.target
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          vid.play().catch(() => {})
        } else {
          vid.pause()
        }
      })
    }, { threshold: [0.6] })

    videoEls.forEach(v => {
      v.pause()
      observer.observe(v)
    })

    observerRef.current = observer
    return () => observer.disconnect()
  }, [videos])



  const togglePlay = (e) => {
    const video = e.currentTarget
    if (video.paused) video.play()
    else video.pause()
  }

  const toggleLike = (reelId) => {
    setLikedItems(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }))
  }

  const toggleSave = (reelId) => {
    setSavedItems(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }))
  }

  return (
    <div className="reels-container">
      {videos.map((reel) => (
        <div key={reel._id} className="reel-item">
          <video
            className="reel-video"
            src={reel.video}
            loop
            muted
            onClick={togglePlay}
          />
          <div className="reel-overlay">
            <div className="reel-content">
              <p className="reel-description">{reel.description}</p>
              <Link className="reel-button" to={`/food-partner/${reel.foodPartner}`}>Visit Food Partner</Link>
            </div>
          </div>
          <div className="reel-actions">
            <button 
              className={`reel-action-btn ${likedItems[reel._id] ? 'liked' : ''}`}
              onClick={() => toggleLike(reel._id)}
              aria-label="Like"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={likedItems[reel._id] ? "#ef4f5f" : "none"} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button 
              className={`reel-action-btn ${savedItems[reel._id] ? 'saved' : ''}`}
              onClick={() => toggleSave(reel._id)}
              aria-label="Save"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={savedItems[reel._id] ? "#fff" : "none"} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
      <nav className="bottom-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>home</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname === '/profile' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>profile</span>
        </Link>
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

export default Home
