import React, { useState, useEffect, useRef } from 'react'
import './Saved.css'
import './Home.css'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Reel from '../../components/Reel'

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
          <Reel
            key={reel._id}
            reel={reel}
            likedItems={likedItems}
            savedItems={savedItems}
            likesCount={likesCount}
            savesCount={savesCount}
            commentsCount={commentsCount}
            onToggleLike={toggleLike}
            onToggleSave={toggleSave}
            onTogglePlay={togglePlay}
          />
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

