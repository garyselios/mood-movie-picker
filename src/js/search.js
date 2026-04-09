import { loadHeaderFooter } from './utils.js';
import { alertMessage } from './alert.js';

// TMDB API configuration
const TMDB_API_KEY = '8021cf490a93c46f6303ded93635ac95';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Search for movies
export async function searchMovies(query) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
        
        console.log('Searching for:', query);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Results found:', data.results?.length || 0);
        
        return data.results || [];
    } catch (error) {
        console.error('Error searching movies:', error);
        alertMessage('Error searching movies. Please try again.');
        return [];
    }
}

// Display search results
export function displaySearchResults(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!movies || movies.length === 0) {
        container.innerHTML = '<p>No movies found. Try a different search term! 🎬</p>';
        return;
    }
    
    const resultsHtml = movies.slice(0, 12).map(movie => `
        <div class="movie-card" data-id="${movie.id}">
            <div class="movie-poster">
                ${movie.poster_path ? `<img src="${TMDB_IMAGE_URL}${movie.poster_path}" alt="${movie.title}">` : '<div class="no-poster">🎬</div>'}
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                <div class="movie-rating">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = `
        <h2>🔍 Search Results for "${movies[0]?.title?.split(' ')[0]}..."</h2>
        <div class="results-grid">
            ${resultsHtml}
        </div>
    `;
    
    // Add click events to movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.getAttribute('data-id');
            window.location.href = `details.html?id=${movieId}`;  // REMOVED SLASH
        });
    });
}