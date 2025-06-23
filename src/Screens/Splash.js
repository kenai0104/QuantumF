import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SplashScreen.css';
import profileImage from '../assets/Quant.png';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-card">
        <div className="image-wrapper">
          <img src={profileImage} alt="Quantum" className="profile-image" />
        </div>
      </div>
    </div>
  );
};

export default Splash;
