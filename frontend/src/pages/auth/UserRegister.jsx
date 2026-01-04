import React from 'react'
import '../../styles/forms.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add your registration logic here 
    
    const fullName = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    // console.log("Registering user:", fullName , email , password);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/user/register' , {
        fullName: fullName,
        email,
        password
      } , {
        withCredentials: true
      });
      console.log("Registration successful:", response.data);
      navigate('/');


    } catch (error) {
      console.error("Registration error:", error);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="form-badge">User</span>
          <h1>Create Account</h1>
          <p>Join us today and start exploring</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>

          <div className="auth-footer">
            Already have an account? <a href="/user/login">Login here</a>
            <br />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Are you a food partner? <a href="/food-partner/register">Register as partner</a></span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserRegister
