import React, { useEffect, useRef } from 'react'
import '../pages/general/FoodPartnerProfile.css'

const VideoPreview = ({ video }) => {
  const videoRef = useRef(null)



  return (
    <div className="fp-video">
      <video 
        ref={videoRef}
        src={video.video} 
        muted
      />
    </div>
  )
}

export default VideoPreview

