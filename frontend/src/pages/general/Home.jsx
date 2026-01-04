import React from 'react'
import './Home.css'

const Home = () => {
  const reelsData = [
    {
      id: 1,
      videoUrl: 'https://ik.imagekit.io/fqgsf065n/f4a0191e-c73c-4cd7-a7fa-c824b10cd38c_utGGpkHqZ', 
      description: 'Delicious Biryani - Best taste in town, authentic recipe from Hyderabad',
      storeName: 'Visit Store'
    },
    {
      id: 2,
      videoUrl: 'https://ik.imagekit.io/fqgsf065n/f4a0191e-c73c-4cd7-a7fa-c824b10cd38c_utGGpkHqZ',
      description: 'Fresh Pizza - Handmade with premium ingredients and finest toppings',
      storeName: 'Visit Store'
    },
    {
      id: 3,
      videoUrl: 'https://media.giphy.com/media/l0HlNaQ9d5k/giphy.mp4',
      description: 'Crispy Butter Chicken - Chef special dish with aromatic spices',
      storeName: 'Visit Store'
    },
    {
      id: 4,
      videoUrl: 'https://media.giphy.com/media/l0HlNaQ9d5k/giphy.mp4',
      description: 'Mouth watering Dosa - South Indian delicacy served hot and fresh',
      storeName: 'Visit Store'
    },
  ]

  const togglePlay = (e) => {
    const video = e.currentTarget
    if (video.paused) video.play()
    else video.pause()
  }

  return (
    <div className="reels-container">
      {reelsData.map((reel) => (
        <div key={reel.id} className="reel-item">
          <video
            className="reel-video"
            src={reel.videoUrl}
            loop
            muted
            autoPlay
            onClick={togglePlay}
          />
          <div className="reel-overlay">
            <div className="reel-content">
              <p className="reel-description">{reel.description}</p>
              <button className="reel-button">{reel.storeName}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
