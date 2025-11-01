import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { destinations } from '../utils/data';
import { fetchPexelsPhotos } from '../utils/pexels';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get('query') || '';

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // First, search local destinations
    const localResults = destinations.filter(
      (dest) =>
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.location.toLowerCase().includes(query.toLowerCase())
    );

    // Then search Google Places API
    const searchGooglePlaces = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        setResults(localResults);
        return;
      }

      setLoading(true);
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        query: query,
        fields: ['name', 'formatted_address', 'geometry', 'photos', 'rating']
      };

      service.textSearch(request, async (placesResults, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && placesResults) {
          // Process results and extract photo URLs immediately
          const googleResults = await Promise.all(
            placesResults.slice(0, 12).map(async (place) => {
              // Get image URL - must be called immediately while place object is fresh
              let imageUrl = '/images/default.webp';
              
              if (place.photos && place.photos.length > 0) {
                try {
                  imageUrl = place.photos[0].getUrl({ maxWidth: 400 });
                } catch (error) {
                  console.warn('Error getting photo for', place.name);
                }
              }
              
              // If no Google photo, try Pexels as fallback
              if (imageUrl === '/images/default.webp') {
                try {
                  const pexelsPhotos = await fetchPexelsPhotos(place.name, 1);
                  if (pexelsPhotos && pexelsPhotos.length > 0) {
                    imageUrl = pexelsPhotos[0].url;
                  }
                } catch (error) {
                  console.warn('Pexels fallback failed for', place.name);
                }
              }
              
              return {
                name: place.name,
                location: place.formatted_address || 'Location not available',
                image: imageUrl,
                rating: place.rating || 'N/A',
                lat: place.geometry?.location?.lat(),
                lng: place.geometry?.location?.lng()
              };
            })
          );
          
          console.log('Google results:', googleResults.map(r => ({ name: r.name, hasImage: r.image !== '/images/default.webp' })));
          
          // Combine local and Google results
          const combined = [...localResults, ...googleResults];
          setResults(combined);
        } else {
          console.log('Google Places search failed:', status);
          setResults(localResults);
        }
        setLoading(false);
      });
    };

    // Wait for Google Maps to load if needed
    if (window.google && window.google.maps && window.google.maps.places) {
      searchGooglePlaces();
    } else {
      setTimeout(searchGooglePlaces, 1000);
    }
  }, [query]);

  return (
    <>
      <Header />
      
      {/* Header with Background */}
      <div className="destination-header" style={{ 
        backgroundImage: 'url(/images/main.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '54px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '4px',
          background: 'linear-gradient(90deg, #ff914d, #ff6f61, #ff3d77)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0px 0px 10px rgba(255, 145, 77, 0.7)'
        }}>
          Search Results for: {query}
        </h1>
      </div>

      {/* Filter and Sort Options */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}>
        {loading ? (
          <p style={{ color: '#ddd', fontSize: '1.2rem' }}>Searching...</p>
        ) : (
          <p style={{ color: '#ddd', fontSize: '1.2rem' }}>Found {results.length} result(s)</p>
        )}
      </div>
      
      {/* Places Grid */}
      <section style={{ padding: '40px 17% 60px' }}>
        <div className="center-text">
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            marginBottom: '40px',
            textTransform: 'uppercase',
            background: 'linear-gradient(90deg, #ff914d, #ff6f61, #ff3d77)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>All Places</h2>
        </div>
        
        <div className="destination-content">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#fff', padding: '40px', fontSize: '1.5rem' }}>Loading results...</div>
          ) : results.length > 0 ? (
            results.map((dest, index) => {
              const linkUrl = dest.lat && dest.lng
                ? `/dynamic-destination?name=${encodeURIComponent(dest.name)}&image=${encodeURIComponent(dest.image)}&address=${encodeURIComponent(dest.location)}&rating=${encodeURIComponent(dest.rating)}&lat=${dest.lat}&lng=${dest.lng}`
                : `/nearby-place?name=${encodeURIComponent(dest.name)}&image=${encodeURIComponent(dest.image)}&address=${encodeURIComponent(dest.location)}&rating=${encodeURIComponent(dest.rating)}`;
              
              return (
                <div key={index} className="box">
                  <Link to={linkUrl}>
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default.webp';
                      }}
                    />
                    <h4>{dest.name}</h4>
                    <h6>{dest.location}</h6>
                    <div className="row">
                      <p>
                        <b>⭐ {dest.rating}/5</b>
                      </p>
                      <span className="button view-details">
                        Visit
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#fff', padding: '40px', fontSize: '1.2rem' }}>
              <p>No results found. Try a different search term.</p>
            </div>
          )}
        </div>
      </section>
      
      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '40px' }}>
        <Link to="/" className="back-btn">⬅ Back to Home</Link>
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;
