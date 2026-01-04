import React from 'react'
import '../../styles/forms.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add your registration logic here
    const businessName = e.target.businessname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const contactName = e.target.contactname.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value; 

    try {
      const response = await axios.post('http://localhost:3000/api/auth/food-partner/register' , {
        name : businessName,
        email,
        password,
        contactName,
        phone,
        address
      } , {
        withCredentials: true
      });
      console.log("Registration successful:", response.data);
      navigate('/create-food');

    } catch (error) {
      console.error("Registration error:", error);
    }



  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="form-badge">Food Partner</span>
          <h1>Partner With Us</h1>
          <p>Register your restaurant or food business</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="businessname">Business Name</label>
            <input
              id="businessname"
              type="text"
              placeholder="Enter your business name"
            />
          </div>

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
              placeholder="Create a strong password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactname">Contact Name</label>
            <input
              id="contactname"
              type="text"
              placeholder="Enter contact person name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              placeholder="Enter your business address"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Register as Partner
            </button>
          </div>

          <div className="auth-footer">
            Already registered? <a href="/food-partner/login">Login here</a>
            <br />
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Are you a user? <a href="/user/register">Register as user</a></span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FoodPartnerRegister
