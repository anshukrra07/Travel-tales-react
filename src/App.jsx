import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';
import NearbyPlace from './pages/NearbyPlace';
import SearchResults from './pages/SearchResults';
import Admin from './pages/Admin';
import Weather from './pages/Weather';
import DynamicDestination from './pages/DynamicDestination';
import './styles/login-check-btn.css';
import './styles/search-bar-contents.css';
import './styles/index-style.css';
import './styles/all-devices-responsive.css';
import './styles/dynamic-style.css';
import './styles/weather.css';
import './styles/booking.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/nearby-place" element={<NearbyPlace />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/dynamic-destination" element={<DynamicDestination />} />
      </Routes>
    </Router>
  );
}

export default App;
