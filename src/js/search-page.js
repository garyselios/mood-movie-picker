import { loadHeaderFooter, getParam, initSearch } from './utils.js';
import { searchMovies, displaySearchResults } from './search.js';

// Get search query from URL
const query = getParam('q');
console.log('Search query:', query);

// Initialize search page
async function init() {
    await loadHeaderFooter();
    
    // Initialize search in header
    initSearch();
    
    const container = document.getElementById('search-results');
    
    if (!query) {
        container.innerHTML = '<p>No search term provided. <a href="index.html">Go back to home</a></p>';
        return;
    }
    
    // Show loading
    container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Searching for movies... 🎬</p></div>';
    
    // Search movies
    const movies = await searchMovies(query);
    console.log('Movies found:', movies.length);
    displaySearchResults(movies, 'search-results');
    
    // Back button
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';  // CHANGED from '/' to 'index.html'
        });
    }
}

init();