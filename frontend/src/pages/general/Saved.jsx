import React, { useState, useEffect, useRef } from 'react'
import './Saved.css'
import './Home.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Saved = () => {
  const location = useLocation()
  const [videos, setVideos] = useState([])
  const observerRef = useRef(null)
  const [likedItems, setLikedItems] = useState({})
  const [savedItems, setSavedItems] = useState({})
  const [likesCount, setLikesCount] = useState({})
  const [savesCount, setSavesCount] = useState({})
  const [commentsCount, setCommentsCount] = useState({})

  useEffect(() => {
    axios.get('http://localhost:3000/api/food/savedFoods', { withCredentials: true })
      .then(response => {
        const items = response.data.savedFoods || []
        setVideos(items)
        console.log(items)
        // Initialize counts from API response or default to 0
        const likes = {}
        const saves = {}
        const liked = {}
        const saved = {}
        const comments = {}
        items.forEach(item => {
          likes[item._id] = item.Like || 0
          saves[item._id] = item.Save || 0
          liked[item._id] = item.isLiked || false
          saved[item._id] = item.isSaved || false
          comments[item._id] = item.comments || item.commentsCount || 0
        })
        setLikesCount(likes)
        setSavesCount(saves)
        setLikedItems(liked)
        setSavedItems(saved)
        setCommentsCount(comments)
      })
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

  const toggleLike = async (reelId) => {
    const wasLiked = likedItems[reelId]
    
    // Optimistic update
    setLikedItems(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }))
    setLikesCount(prev => ({
      ...prev,
      [reelId]: wasLiked ? Math.max(0, (prev[reelId] || 0) - 1) : (prev[reelId] || 0) + 1
    }))

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/like',
        { foodId: reelId },
        { withCredentials: true }
      )
      console.log(response.data.message)
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert optimistic update on error
      setLikedItems(prev => ({
        ...prev,
        [reelId]: wasLiked
      }))
      setLikesCount(prev => ({
        ...prev,
        [reelId]: wasLiked ? (prev[reelId] || 0) + 1 : Math.max(0, (prev[reelId] || 0) - 1)
      }))
    }
  }

  const toggleSave = async (reelId) => {
    const wasSaved = savedItems[reelId]
    
    // Optimistic update
    setSavedItems(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }))
    setSavesCount(prev => ({
      ...prev,
      [reelId]: wasSaved ? Math.max(0, (prev[reelId] || 0) - 1) : (prev[reelId] || 0) + 1
    }))

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/save',
        { foodId: reelId },
        { withCredentials: true }
      )
      console.log(response.data.message)
      
      // If unsaved, remove from the list after a short delay
      if (wasSaved) {
        setTimeout(() => {
          setVideos(prev => prev.filter(item => item._id !== reelId))
        }, 300)
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      // Revert optimistic update on error
      setSavedItems(prev => ({
        ...prev,
        [reelId]: wasSaved
      }))
      setSavesCount(prev => ({
        ...prev,
        [reelId]: wasSaved ? (prev[reelId] || 0) + 1 : Math.max(0, (prev[reelId] || 0) - 1)
      }))
    }
  }

  return (
    <div className="reels-container">
      {videos.length === 0 ? (
        <div className="saved-empty-state">
          <h2>No saved items</h2>
          <p>Save food items from the home page to see them here</p>
        </div>
      ) : (
        videos.map((reel) => (
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
              <div className="reel-action-item">
                <button 
                  className={`reel-action-btn ${likedItems[reel._id] ? 'liked' : ''}`}
                  onClick={() => toggleLike(reel._id)}
                  aria-label="Like"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={likedItems[reel._id] ? "#ef4f5f" : "none"} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <span className="reel-action-count">{likesCount[reel._id] || 0}</span>
              </div>
              <div className="reel-action-item">
                <button 
                  className="reel-action-btn"
                  onClick={() => {}}
                  aria-label="Comment"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <span className="reel-action-count">{commentsCount[reel._id] || 0}</span>
              </div>
              <div className="reel-action-item">
                <button 
                  className={`reel-action-btn ${savedItems[reel._id] ? 'saved' : ''}`}
                  onClick={() => toggleSave(reel._id)}
                  aria-label="Save"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={savedItems[reel._id] ? "#fff" : "none"} stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <span className="reel-action-count">{savesCount[reel._id] || 0}</span>
              </div>
            </div>
          </div>
        ))
      )}
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

export default Saved

