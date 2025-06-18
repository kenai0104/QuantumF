import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SplashScreen.css';
import profileImage from '../assets/Quant.png';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-card"> {/* Use new class without rotation */}
        <div className="image-wrapper">
          <img src={profileImage} alt="Quantum" className="profile-image" />
        </div>
        <div className="intro-text delayed-fade-in">
          <h1>Hi,</h1>
          <h2>I am Q</h2>
          <h3>How can I help you ?</h3>
        </div>
      </div>
    </div>
  );
};

export default Splash;
