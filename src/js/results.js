import { loadHeaderFooter } from './utils.js';
import { displayMoodGif } from './giphyAPI.js';

// Get the mood from URL parameter (manually, without getParam)
function getMoodFromUrl() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('mood');
}

const mood = getMoodFromUrl();
console.log('Mood:', mood);

// TMDB API configuration
const TMDB_API_KEY = '8021cf490a93c46f6303ded93635ac95';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Map moods to genre IDs
const moodToGenres = {
  happy: [35, 10751],
  sad: [18, 10749],
  bored: [28, 878],
  excited: [12, 28],
  nostalgic: [14, 10751],
  suspenseful: [53, 80]
};

// Display movie cards
function displayMovies(movies) {
  const container = document.getElementById('results-container');
  if (!container) {
    console.error('Container not found!');
    return;
  }
  
  console.log('Displaying', movies.length, 'movies');
  
  if (!movies || movies.length === 0) {
    container.innerHTML = '<p>No movies found for this mood. Try another one! 🎬</p>';
    return;
  }
  
  const moviesHtml = movies.map(movie => `
    <div class="movie-card" data-id="${movie.id}">
      <div class="movie-poster">
        ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}">` : '<div class="no-poster">🎬</div>'}
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-year">${movie.year}</p>
        <div class="movie-rating">⭐ ${movie.rating}</div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = moviesHtml;
  
  // Add click events - MODIFIED: Navigate to details page
  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const movieId = card.getAttribute('data-id');
      window.location.href = `/details.html?id=${movieId}`;
    });
  });
}

// Fetch movies from TMDB
async function loadMovies() {
  const container = document.getElementById('results-container');
  if (!container) return;
  
  try {
    const genres = moodToGenres[mood] || [18];
    const genreIds = genres.join(',');
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds}&sort_by=popularity.desc&page=1&language=en-US`;
    
    console.log('Fetching movies...');
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Movies found:', data.results?.length || 0);
    
    if (data.results && data.results.length > 0) {
      const movies = data.results.slice(0, 6).map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        rating: movie.vote_average.toFixed(1),
        poster: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null
      }));
      displayMovies(movies);
    } else {
      container.innerHTML = '<p>No movies found for this mood. Try another one! 🎬</p>';
    }
  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
  }
}

// Initialize page
async function init() {
  console.log('Initializing results page...');
  
  await loadHeaderFooter();
  
  const moodSpan = document.getElementById('selected-mood');
  if (moodSpan && mood) {
    moodSpan.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
  }
  
  if (mood) {
    await displayMoodGif(mood, 'gif-container');
  }
  
  // Show loading
  const container = document.getElementById('results-container');
  if (container) {
    container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading movies from TMDB... 🎬</p></div>';
  }
  
  await loadMovies();
  
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
  }
}

// Start
init();