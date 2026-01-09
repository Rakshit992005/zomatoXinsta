import React from 'react'
import { Link } from 'react-router-dom'
import '../pages/general/Home.css'

const Reel = ({ 
  reel, 
  likedItems, 
  savedItems, 
  likesCount, 
  savesCount, 
  commentsCount, 
  onToggleLike, 
  onToggleSave, 
  onTogglePlay 
}) => {
  return (
    <div className="reel-item">
      <video
        className="reel-video"
        src={reel.video}
        loop
        muted
        onClick={onTogglePlay}
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
            onClick={() => onToggleLike(reel._id)}
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
            onClick={() => onToggleSave(reel._id)}
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
  )
}

export default Reel

