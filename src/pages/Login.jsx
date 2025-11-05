import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/config';
import '../styles/login-style.css';

const Login = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const navigate = useNavigate();

  // Password strength checker
  useEffect(() => {
    if (activeForm === 'signup' && password) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password, activeForm]);

  // Google Sign-In callback
  useEffect(() => {
    window.handleGoogleLogin = (response) => {
      console.log('Google login response:', response);
      alert('Google login not fully implemented yet');
    };

    return () => {
      delete window.handleGoogleLogin;
    };
  }, []);

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (pwd.length < 10) return 'Medium';
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return 'Strong';
    return 'Medium';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, dob }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Account created! Please login.');
        setActiveForm('login');
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <>
      <div className="login-page-wrapper">
        <div
          id="g_id_onload"
          data-client_id="875301827345-e2s6lj03shc7d221ri05q8b9ejfm6o6f.apps.googleusercontent.com"
          data-callback="handleGoogleLogin"
          data-auto_prompt="false"
        ></div>

        <div className="website-name">
          <h1>
            <span className="half-white">tra</span>
            <span className="half-orange">vel</span>
            <span className="half-white">ta</span>
            <span className="half-orange">les</span>
          </h1>
          <p>Your Journey Begins Here</p>
        </div>

        <div className="box">
          <div className="container">
            {activeForm === 'login' && (
              <div id="login-form" className="form-container">
                <div className="top-header">
                  <header>Login</header>
                </div>
                <div className="server-login">
                  <p>
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('server-login'); }}>
                      Server Login
                    </a>
                  </p>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    className="input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <i className="bx bx-user"></i>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i className="bx bx-lock-alt"></i>
                </div>
                <div className="input-field">
                  <input
                    type="submit"
                    className="submit"
                    value="Login"
                    onClick={handleLogin}
                  />
                </div>
                {message && <p className="error-message">{message}</p>}

                <div className="bottom">
                  <div className="left">
                    <input type="checkbox" id="check" />
                    <label htmlFor="check"> Remember Me</label>
                  </div>
                  <div className="right">
                    <label>
                      <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('forgot-password'); }}>
                        Forgot password?
                      </a>
                    </label>
                  </div>
                </div>

                <div className="social-login">
                  <div className="google-hover-wrapper">
                    <div
                      className="g_id_signin"
                      data-type="standard"
                      data-size="large"
                      data-theme="outline"
                      data-text="signin"
                      data-shape="pill"
                      data-logo_alignment="left"
                      data-width="115"
                    ></div>
                  </div>
                  <button onClick={() => alert('Facebook login not implemented')}>
                    <i className="bx bxl-facebook"></i> Facebook
                  </button>
                </div>

                <div className="signup-link">
                  <p>
                    Don't have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('signup'); }}>
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            )}

            {activeForm === 'signup' && (
              <div id="signup-form" className="form-container">
                <div className="top-header">
                  <header>Sign Up</header>
                </div>

                <div className="input-field">
                  <input
                    type="text"
                    className="input"
                    placeholder="Create Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <i className="bx bx-user"></i>
                </div>
                <div className="input-field">
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <i className="bx bx-envelope"></i>
                </div>
                <div className="input-field">
                  <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i className="bx bx-lock-alt"></i>
                </div>
                <div className="password-strength">
                  <span>Password Strength:</span>{' '}
                  <span className={passwordStrength.toLowerCase()}>{passwordStrength}</span>
                </div>
                <div className="input-field">
                  <input
                    type="date"
                    className="input"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                  <i className="bx bx-calendar"></i>
                </div>
                <div className="input-field">
                  <input
                    type="submit"
                    className="submit"
                    value="Sign Up"
                    onClick={handleSignup}
                  />
                </div>
                {message && <p className="error-message">{message}</p>}

                <div className="social-login">
                  <div className="google-hover-wrapper">
                    <div
                      className="g_id_signin"
                      data-type="standard"
                      data-size="large"
                      data-theme="outline"
                      data-text="signin"
                      data-shape="pill"
                      data-logo_alignment="left"
                      data-width="115"
                    ></div>
                  </div>
                  <button onClick={() => alert('Facebook login not implemented')}>
                    <i className="bx bxl-facebook"></i> Facebook
                  </button>
                </div>

                <div className="signup-link">
                  <p>
                    Already have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('login'); }}>
                      Login
                    </a>
                  </p>
                </div>
              </div>
            )}

            {activeForm === 'forgot-password' && (
              <div id="forgot-password-form" className="form-container">
                <div className="top-header">
                  <header>Forgot Password</header>
                </div>
                <div className="input-field">
                  <input type="email" className="input" placeholder="Enter your email" required />
                  <i className="bx bx-envelope"></i>
                </div>
                <div className="input-field">
                  <input type="date" className="input" placeholder="Date of Birth" required />
                  <i className="bx bx-calendar"></i>
                </div>
                <div className="input-field">
                  <input type="submit" className="submit" value="Reset Password" />
                </div>
                <div className="server-login">
                  <p>
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('login'); }}>
                      Back to Login
                    </a>
                  </p>
                </div>
              </div>
            )}

            {activeForm === 'server-login' && (
              <div id="server-login-form" className="form-container">
                <div className="top-header">
                  <header>Server Login</header>
                </div>
                <div className="input-field">
                  <input type="text" className="input" placeholder="Server Username" required />
                  <i className="bx bx-user"></i>
                </div>
                <div className="input-field">
                  <input type="password" className="input" placeholder="Server Password" required />
                  <i className="bx bx-lock-alt"></i>
                </div>
                <div className="input-field">
                  <input type="submit" className="submit" value="Login" />
                </div>
                <p className="error-message"></p>
                <div className="server-login">
                  <p>
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveForm('login'); }}>
                      Back to Login
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
