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
      <div className="image-placeholder">
       <img src="/images/hero-image.jpeg" alt="Hero Image" className="hero-image" />
        </div>

      </div>

      {/* ✏️ Welcome Text */}
      <div className="welcome-text">
        <h2>Welcome to the Student Booking System</h2>
        <p>Book study rooms, lab time, or equipment easily!</p>
      </div>
    </div>
  );
};

export default Home;
