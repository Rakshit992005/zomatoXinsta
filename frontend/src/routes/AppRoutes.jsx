import React from 'react'
import { BrowserRouter as Router , Route , Routes} from 'react-router-dom'

const AppRoutes = () => {
  return (
    <div>
      <Router>
        <Routes>
            <Route path="/user/register" element={<h1> user Register from</h1>} />
            <Route path="/user/login" element={<h1> user login from</h1>} />
            <Route path="/food-partner/register" element={<h1> food partner register from</h1>} />
            <Route path="/food-partner/login" element={<h1> food partner login from</h1>} />

        </Routes>
      </Router>
    </div>
  )
}

export default AppRoutes
