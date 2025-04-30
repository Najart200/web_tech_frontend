import React, { useState } from "react";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "home dark" : "home light"}>
      
      {/* 🌟 Navigation Bar */}
      <nav className="navbar">
        <h1 className="title">Student Booking System</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="toggle-button"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </nav>

      {/* 📸 Picture Placeholder */}
      <div className="image-placeholder">
        <img src="/images/hero-image.jpeg" alt="Hero Image" className="hero-image" />
      </div>

      {/* ✏️ Welcome Text */}
      <div className="welcome-text">
        <h2>Welcome to the Student Booking System</h2>
        <p>Book study rooms, lab time, or equipment easily!</p>
      </div>

      {/* 🛠️ Features Section */}
      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li> Book study rooms, labs, or equipment</li>
          <li> Secure login and role-based access</li>
          <li> Admin dashboard for managing resources</li>
          <li> Responsive design for all devices</li>
        </ul>
      </div>

     

      {/* 💬 Testimonials */}
      <div className="testimonials-section">
        <h2>What Our Users Say</h2>
        <blockquote>
          "This system has made booking resources so much easier!" - Seyram
        </blockquote>
        <blockquote>
          "The admin dashboard is a game-changer for managing bookings." - Nana Kwame
        </blockquote>
      </div>

      {/* 📞 Footer */}
      <footer className="footer">
        <p>&copy; 2025 Student Booking System. All rights reserved.</p>
        
      </footer>
    </div>
  );
};

export default Home;