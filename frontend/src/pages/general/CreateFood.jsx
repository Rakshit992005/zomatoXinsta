import React, { useRef, useState } from 'react'
import './CreateFood.css'
import axios from 'axios'


const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fileInputRef = useRef(null)

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (videoFile) formData.append('video', videoFile)
    formData.append('name', name)
    formData.append('description', description)

    const response = await axios.post('http://localhost:3000/api/food', formData , {
      withCredentials: true,
    } )

    console.log(response.data)
  }

  const handleReset = () => {
    setVideoFile(null)
    setPreviewUrl(null)
    setName('')
    setDescription('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="create-food-container">
      <div className="create-food-card">
        <header className="create-food-header">
          <h1>Create Food</h1>
          <p className="muted">Add a food item with video, name and description.</p>
        </header>

        <form className="create-food-form" onSubmit={handleSubmit}>
          {/* VIDEO UPLOAD */}
          <div className="form-group">
            <label>Food Video</label>

            {/* Hidden input */}
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              onChange={handleVideoChange}
              className="hidden-file-input"
            />

            {/* Custom upload box */}
            <div
              className="video-upload-box"
              onClick={() => fileInputRef.current.click()}
            >
              {previewUrl ? (
                <video src={previewUrl} controls />
              ) : (
                <div className="video-placeholder">
                  <span>Click to upload video</span>
                  <small>MP4, WebM supported</small>
                </div>
              )}
            </div>
          </div>

          {/* NAME */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Delicious Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create Food
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFood
