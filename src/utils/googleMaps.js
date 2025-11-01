// Google Maps API utilities

export const initializeAutocomplete = (inputRef, onPlaceSelected) => {
  if (!window.google || !inputRef) return;

  // Always use the legacy Autocomplete API which works better with React
  const autocomplete = new window.google.maps.places.Autocomplete(inputRef, {
    types: ['(regions)'],
    fields: ['name', 'geometry', 'formatted_address', 'photos', 'rating']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }

    const placeData = {
      name: place.name || place.formatted_address,
      image: place.photos && place.photos.length > 0 
        ? place.photos[0].getUrl({ maxWidth: 800, maxHeight: 600 }) 
        : '/images/default.webp',
      address: place.formatted_address || 'Address not available',
      rating: place.rating || 'No rating available',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    if (onPlaceSelected) {
      onPlaceSelected(placeData);
    }
  });

  return autocomplete;
};

export const loadGoogleMap = (containerId, address, placeName) => {
  if (!window.google) {
    console.error('Google Maps not loaded');
    return;
  }

  const geocoder = new window.google.maps.Geocoder();
  
  geocoder.geocode({ address }, (results, status) => {
    if (status === 'OK') {
      const location = results[0].geometry.location;

      const map = new window.google.maps.Map(document.getElementById(containerId), {
        zoom: 14,
        center: location,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });

      new window.google.maps.Marker({
        position: location,
        map: map,
        title: placeName,
        animation: window.google.maps.Animation.DROP
      });

      return { map, location };
    } else {
      console.error('Geocode failed:', status);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '<p style="color: red;">Map failed to load</p>';
      }
    }
  });
};

export const fetchNearbyPlaces = (map, location, onPlacesFound) => {
  if (!window.google || !map || !location) return;

  const placesService = new window.google.maps.places.PlacesService(map);
  const categories = ['restaurant', 'hospital', 'tourist_attraction', 'lodging'];

  categories.forEach(category => {
    const request = {
      location: location,
      radius: 5000, // 5km radius
      type: category,
      // Request business_status field instead of permanently_closed
      fields: ['name', 'vicinity', 'rating', 'photos', 'business_status']
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Filter out permanently closed businesses using business_status
        const operationalPlaces = results.filter(place => {
          return !place.business_status || place.business_status === 'OPERATIONAL';
        });
        
        if (onPlacesFound) {
          onPlacesFound(category, operationalPlaces);
        }
      } else {
        console.error(`Error fetching ${category}:`, status);
      }
    });
  });
};

export const getPlacePhoto = (place, maxWidth = 400) => {
  if (place.photos && place.photos.length > 0) {
    return place.photos[0].getUrl({ maxWidth });
  }
  return '/images/default.webp';
};

// Load Google Maps script dynamically
export const loadGoogleMapsScript = (apiKey, callback) => {
  if (window.google && window.google.maps) {
    if (callback) callback();
    return;
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (callback) callback();
  };
  document.head.appendChild(script);
};
