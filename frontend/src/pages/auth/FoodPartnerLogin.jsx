import React from 'react'
import '../../styles/forms.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add your login logic here
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/login', {
        email,
        password
      }, {
        withCredentials: true
      });
      console.log("Login successful:", response.data);
      navigate('/create-food');

    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="form-badge">Food Partner</span>
          <h1>Partner Login</h1>
          <p>Access your restaurant dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Business Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your business email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="checkbox-group">
            <input id="remember" type="checkbox" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Login to Dashboard
            </button>
          </div>

          <div className="auth-footer">
            New partner? <a href="/food-partner/register">Register here</a>
            <br />
            <a href="#forgot">Forgot your password?</a>
            <br />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Are you a user? <a href="/user/login">Login as user</a></span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodPartnerLogin
