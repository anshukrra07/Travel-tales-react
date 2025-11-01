import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/config';
import '../styles/account-style.css';

const Account = () => {
  const [userData, setUserData] = useState({
    username: 'Loading...',
    email: 'Loading...',
    dob: 'Loading...',
    createdAt: 'Loading...',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            username: data.username || 'N/A',
            email: data.email || 'N/A',
            dob: data.dob ? new Date(data.dob).toLocaleDateString() : 'N/A',
            createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
          });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="account-wrapper">
      <div className="sidebar">
        <div className="profile-icon">
          <i className="bx bx-user"></i>
        </div>
        <h2>{userData.username}</h2>
        <p>{userData.email}</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main-content">
        <h1>Profile Info</h1>

        <div className="info-card">
          <label>Username</label>
          <p>{userData.username}</p>
        </div>

        <div className="info-card">
          <label>Email</label>
          <p>{userData.email}</p>
        </div>

        <div className="info-card">
          <label>Date of Birth</label>
          <p>{userData.dob}</p>
        </div>

        <div className="info-card">
          <label>Account Created</label>
          <p>{userData.createdAt}</p>
        </div>

        <div className="section">
          <h2>Favorites</h2>
          <ul id="favorites">
            <li>No favorites yet.</li>
          </ul>
        </div>

        <div className="section">
          <h2>Booking History</h2>
          <ul id="history">
            <li>No booking history yet.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Account;
