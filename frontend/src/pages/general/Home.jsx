import React, { useState, useEffect, useRef } from 'react'
import './Home.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {

  const [videos, setVideos] = useState([])
  const observerRef = useRef(null)

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
              <Link className="reel-button" to={`/food-partner/${reel.foodPartner}`}>{reel.foodPartner}</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
