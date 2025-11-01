import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadGoogleMap, fetchNearbyPlaces, getPlacePhoto } from '../utils/googleMaps';
import { fetchPexelsPhotos } from '../utils/pexels';
import { fetchWeather } from '../utils/weather';
import '../styles/dynamic-style.css';
import '../styles/booking.css';
import '../styles/weather.css';

const DynamicDestination = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [placeData, setPlaceData] = useState({
    name: '',
    image: '',
    address: '',
    rating: '',
    lat: null,
    lng: null,
  });
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('flights');
  const [photos, setPhotos] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState({});
  const [weather, setWeather] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleKeyDown = (e) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setCurrentImageIndex((prev) => (prev + 1) % photos.length);
      resetZoom();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
      resetZoom();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    }
  };

  const resetZoom = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    resetZoom();
    // Unlock body scroll and restore position
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.overflow = 'auto';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  };

  // Keyboard navigation effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, currentImageIndex, photos.length]);

  useEffect(() => {
    const name = searchParams.get('name') || 'Unknown Place';
    const image = searchParams.get('image') || '/images/default.webp';
    const address = searchParams.get('address') || 'Location not specified';
    const rating = searchParams.get('rating') || 'N/A';
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    setPlaceData({ name, image, address, rating, lat, lng });

    // Fetch Pexels photos
    if (name) {
      fetchPexelsPhotos(name, 15).then(setPhotos);
      fetchWeather(name).then(setWeather);
    }

    // Load Google Map and fetch nearby places
    if (address && window.google && window.google.maps) {
      setTimeout(() => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            
            // Create map
            const map = new window.google.maps.Map(document.getElementById('map'), {
              zoom: 14,
              center: location,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true
            });
            
            // Add marker
            new window.google.maps.Marker({
              position: location,
              map: map,
              title: name,
              animation: window.google.maps.Animation.DROP
            });
            
            // Fetch nearby places
            fetchNearbyPlaces(map, location, (category, places) => {
              // Process places to extract photo URLs immediately and filter out closed businesses
              const processedPlaces = places
                .filter(place => {
                  // Use business_status instead of permanently_closed
                  return !place.business_status || place.business_status === 'OPERATIONAL';
                })
                .map(place => ({
                  ...place,
                  photoUrl: place.photos && place.photos.length > 0 
                    ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
                    : null,
                  business_status: place.business_status || 'OPERATIONAL'
                }));
              
              setNearbyPlaces(prev => ({
                ...prev,
                [category]: processedPlaces
              }));
            });
          }
        });
      }, 500);
    }
  }, [searchParams]);

  const openBookingPopup = () => {
    setShowBookingPopup(true);
  };

  const closeBookingPopup = () => {
    setShowBookingPopup(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handlePlaceClick = (place) => {
    const params = new URLSearchParams({
      name: place.name,
      image: place.photoUrl || '/images/default.webp',
      address: place.vicinity,
      rating: place.rating || 'N/A'
    });
    navigate(`/nearby-place?${params.toString()}`);
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Lock body scroll and prevent position change
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
  };


  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    resetZoom();
  };

  const showPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetZoom();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const direction = e.deltaY > 0 ? -1 : 1;
    const newScale = Math.min(Math.max(1, scale + direction * zoomIntensity), 3);
    setScale(newScale);
    if (newScale === 1) {
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  const handleTouchStart = (e) => {
    if (scale > 1) return; // Don't swipe when zoomed
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (scale > 1) return; // Don't swipe when zoomed
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (scale > 1) return; // Don't swipe when zoomed
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      // Swiped left - next image
      showNextImage();
    } else if (distance < -minSwipeDistance) {
      // Swiped right - previous image
      showPrevImage();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <Header />
      
      <div 
        className="destination-header" 
        style={{ 
          backgroundImage: `url(${placeData.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1>{placeData.name}</h1>
      </div>

      <div className="destination-container">
        <section className="destination-detail">
          <div className="main-image-container">
            {placeData.image && <img src={placeData.image} alt={placeData.name} />}
          </div>
        </section>
      </div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <section style={{ padding: '40px 20px', background: 'rgba(255, 255, 255, 0.05)', marginTop: '20px', maxWidth: '100vw', overflow: 'hidden' }}>
          <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '2.5rem', marginBottom: '30px' }}>📸 Photo Gallery</h2>
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '15px', 
            padding: '10px',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}>
            {photos.map((photo, index) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={photo.alt}
                className="gallery-image"
                style={{ flexShrink: 0, cursor: 'pointer' }}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        </section>
      )}

      <aside className="destination-sidebar">
        {/* Weather Card */}
        {weather && (
          <div id="weather-info" className="weather-glass-card">
            <div className="weather-left">
              <div className="weather-city">{weather.city}</div>
              <div className="weather-temp">{weather.temp}°C</div>
              <div className="weather-condition">{weather.condition}</div>
            </div>
            <div className="weather-center">
              {weather.icon && <img src={weather.icon} alt={weather.description} />}
            </div>
            <div className="weather-right">
              <div>🌡️ Feels like: <span>{weather.feelsLike}°C</span></div>
              <div>💧 Humidity: <span>{weather.humidity}%</span></div>
              <div>💨 Wind: <span>{weather.windSpeed} km/h</span></div>
            </div>
          </div>
        )}

        <div className="sidebar-content">
          <div className="travel-info">
            <h3>Travel Info</h3>
            <ul>
              <p><strong>📍 Address:</strong> {placeData.address}</p>
              <p><strong>⭐ Rating:</strong> {placeData.rating}/5</p>
              <li><strong>🌦 Best Time to Visit:</strong> All Year Round</li>
              <li><strong>🎭 Activities:</strong> Sightseeing, Adventure, Culture</li>
              <li><strong>🍽 Food Specialties:</strong> Local Cuisine</li>
            </ul>

            <div className="reviews">
              <h3>User Reviews</h3>
              <div id="reviews-container">
                <p>🌟🌟🌟🌟🌟 "Amazing place!" - Alice</p>
                <p>🌟🌟🌟🌟 "Beautiful views, must visit!" - John</p>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button className="book-btn" onClick={openBookingPopup}>
                📖 Book Now
              </button>
            </div>
          </div>

          <div className="map-container">
            <div id="map"></div>
          </div>
        </div>
      </aside>

      {/* Nearby Places */}
      <div id="nearby-places" style={{ padding: '40px 20px', marginTop: '30px', maxWidth: '100vw', overflow: 'hidden' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', fontSize: '2.5rem', marginBottom: '40px' }}>📍 Nearby Places</h2>
        {Object.keys(nearbyPlaces).length > 0 ? (
          <>
            {Object.entries(nearbyPlaces).map(([category, places]) => {
              const categoryNames = {
                restaurant: '🍽️ Restaurants',
                hospital: '🏥 Hospitals',
                tourist_attraction: '🗺️ Tourist Attractions',
                lodging: '🏨 Hotels'
              };
              
              return (
                <div key={category} className="info-section">
                  <h3>{categoryNames[category] || category}</h3>
                  <div className="places-container">
                    {places.slice(0, 10).map((place, index) => (
                      <div 
                        key={index} 
                        className="place-card" 
                        onClick={() => handlePlaceClick(place)}
                        style={{ cursor: 'pointer' }}
                      >
                        {place.photoUrl && (
                          <img 
                            src={place.photoUrl} 
                            alt={place.name}
                            className="place-img"
                          />
                        )}
                        <div className="place-info">
                          <strong>{place.name}</strong>
                          <p>📍 {place.vicinity}</p>
                          {place.rating && <p>⭐ {place.rating}/5</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <p style={{ color: '#ddd', marginTop: '10px', textAlign: 'center' }}>Loading nearby places...</p>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="back-btn">⬅ Back to Home</Link>
      </div>

      {/* Booking Popup */}
      {showBookingPopup && (
        <div 
          id="booking-popup"
          style={{ 
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            overflow: 'auto'
          }}
        >
          <div className="modal-content">
            <span className="close-btn1" onClick={closeBookingPopup}>×</span>
            <h2>Book your trip to <span>{placeData.name}</span></h2>

            <div className="category-tabs">
              <button className={`tab ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => switchTab('flights')}>
                Flights
              </button>
              <button className={`tab ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => switchTab('hotels')}>
                Hotels
              </button>
              <button className={`tab ${activeTab === 'trains' ? 'active' : ''}`} onClick={() => switchTab('trains')}>
                Trains
              </button>
              <button className={`tab ${activeTab === 'buses' ? 'active' : ''}`} onClick={() => switchTab('buses')}>
                Buses
              </button>
            </div>

            {/* Flights Tab */}
            {activeTab === 'flights' && (
              <div className="tab-content active-tab">
                <div className="popup-links">
                  <a href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>MakeMyTrip</span>
                  </a>
                  <a href="https://www.goindigo.in/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>IndiGo</span>
                  </a>
                  <a href="https://www.yatra.com/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>Yatra</span>
                  </a>
                </div>
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <div className="tab-content active-tab">
                <div className="popup-links">
                  <a href="https://www.booking.com/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>Booking.com</span>
                  </a>
                  <a href="https://www.makemytrip.com/hotels/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>MakeMyTrip</span>
                  </a>
                  <a href="https://www.oyorooms.com/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>OYO</span>
                  </a>
                </div>
              </div>
            )}

            {/* Trains Tab */}
            {activeTab === 'trains' && (
              <div className="tab-content active-tab">
                <div className="popup-links">
                  <a href="https://www.irctc.co.in/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>IRCTC</span>
                  </a>
                  <a href="https://www.makemytrip.com/railways/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>MakeMyTrip Trains</span>
                  </a>
                </div>
              </div>
            )}

            {/* Buses Tab */}
            {activeTab === 'buses' && (
              <div className="tab-content active-tab">
                <div className="popup-links">
                  <a href="https://www.redbus.in/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>RedBus</span>
                  </a>
                  <a href="https://www.zoomcar.com/" target="_blank" rel="noopener noreferrer" className="partner-link">
                    <span>Zoomcar</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox/Popup */}
      {lightboxOpen && photos.length > 0 && (
        <div 
          style={{
            display: 'flex',
            position: 'fixed',
            zIndex: 9999,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(4px)',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            margin: 0,
            padding: 0
          }}
          onClick={closeLightbox}
        >
          <span 
            style={{
              position: 'absolute',
              top: '20px',
              right: '35px',
              fontSize: '45px',
              fontWeight: '300',
              color: 'white',
              cursor: 'pointer',
              zIndex: 10002,
              lineHeight: 1
            }}
            onClick={closeLightbox}
          >
            ×
          </span>
          
          <button 
            style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              fontSize: '50px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: 'none',
              padding: '15px 25px',
              cursor: 'pointer',
              zIndex: 10002,
              borderRadius: '8px',
              transition: 'all 0.2s',
              fontWeight: '300',
              lineHeight: 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
          >
            ❮
          </button>
          
          <div 
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={photos[currentImageIndex].url}
              alt={photos[currentImageIndex].alt}
              style={{
                maxWidth: scale === 1 ? '90%' : 'none',
                maxHeight: scale === 1 ? '90vh' : 'none',
                width: scale > 1 ? `${scale * 100}%` : 'auto',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                cursor: scale > 1 ? 'grab' : 'zoom-in',
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                transition: 'transform 0.2s ease-out',
                userSelect: 'none',
                WebkitUserDrag: 'none',
                objectFit: 'contain'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (scale === 1) {
                  setScale(2);
                } else {
                  setScale(1);
                  setTranslateX(0);
                  setTranslateY(0);
                }
              }}
              draggable={false}
            />
          </div>
          
          <button 
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              fontSize: '50px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: 'none',
              padding: '15px 25px',
              cursor: 'pointer',
              zIndex: 10002,
              borderRadius: '8px',
              transition: 'all 0.2s',
              fontWeight: '300',
              lineHeight: 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            onClick={(e) => { e.stopPropagation(); showNextImage(); }}
          >
            ❯
          </button>
          
          {/* Image counter */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '16px',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px 16px',
            borderRadius: '20px',
            zIndex: 10002
          }}>
            {currentImageIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DynamicDestination;
