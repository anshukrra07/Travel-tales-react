// Pexels API utilities

const PEXELS_API_KEY = '6GUi9qGWyNrsy9WyXGwEKWAOjQQob2SSaQEzp6AGXerQlOMDgSLn5eoq';

export const fetchPexelsPhotos = async (query, perPage = 15) => {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY }
    });

    if (!response.ok) {
      console.error('Failed to fetch photos:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.photos.map(photo => ({
      id: photo.id,
      url: photo.src.large2x,
      photographer: photo.photographer,
      alt: photo.alt || query
    }));
  } catch (error) {
    console.error('Error fetching photos from Pexels:', error);
    return [];
  }
};
