// frontend/src/components/ThemeToggle.js
import React, { useState, useEffect } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <div className="toggle-track">
        <div className="toggle-thumb">
          <i className={`fas ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;