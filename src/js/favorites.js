import { loadHeaderFooter } from './utils.js';
import { alertMessage, alertSuccess } from './alert.js';

// Get favorites from localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('movieFavorites')) || [];
}

// Remove favorite
function removeFavorite(movieId, movieTitle) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.id !== movieId);
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    alertSuccess(`"${movieTitle}" removed from favorites! 💔`);
    displayFavorites(); // Refresh the list
}

// Display favorites
function displayFavorites() {
    const container = document.getElementById('favorites-container');
    if (!container) return;
    
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <p>😢 You don't have any favorite movies yet.</p>
                <p>Go back to the <a href="index.html">home page</a> and pick a mood to find movies!</p>
            </div>
        `;
        return;
    }
    
    const favoritesHtml = favorites.map(movie => `
        <div class="movie-card favorite-card" data-id="${movie.id}">
            <div class="movie-poster">
                ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}">` : '<div class="no-poster">🎬</div>'}
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
                <div class="movie-rating">⭐ ${movie.rating}</div>
                <button class="remove-favorite-btn" data-id="${movie.id}" data-title="${movie.title}">
                    ❌ Remove
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = favoritesHtml;
    
    // Add click events to movie cards (navigate to details)
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the remove button
            if (e.target.classList.contains('remove-favorite-btn')) return;
            const movieId = card.getAttribute('data-id');
            window.location.href = `details.html?id=${movieId}`;  // REMOVED SLASH
        });
    });
    
    // Add click events to remove buttons
    document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = parseInt(btn.getAttribute('data-id'));
            const movieTitle = btn.getAttribute('data-title');
            removeFavorite(movieId, movieTitle);
        });
    });
}

// Initialize page
async function init() {
    await loadHeaderFooter();
    displayFavorites();
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';  // CHANGED from '/' to 'index.html'
        });
    }
}

init();