import { loadHeaderFooter } from './utils.js';
import { alertMessage, alertSuccess, alertError } from './alert.js';

// Get movie ID from URL
function getMovieIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

const movieId = getMovieIdFromUrl();
console.log('Movie ID:', movieId);

// TMDB API configuration
const TMDB_API_KEY = '8021cf490a93c46f6303ded93635ac95';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_URL = 'https://image.tmdb.org/t/p/original';

// Fetch movie details
async function fetchMovieDetails() {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`;
        console.log('Fetching movie details...');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const movie = await response.json();
        console.log('Movie details:', movie);
        displayMovieDetails(movie);
        
        // Also fetch trailer
        await fetchMovieTrailer(movieId);
        
        // Update favorite button
        updateFavoriteButton(movieId);
        
    } catch (error) {
        console.error('Error:', error);
        const container = document.getElementById('movie-details');
        if (container) {
            container.innerHTML = `<p>Error loading movie details: ${error.message}</p>`;
        }
    }
}

// Fetch movie trailer
async function fetchMovieTrailer(movieId) {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();
        
        const trailer = data.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        
        const trailerContainer = document.getElementById('trailer-container');
        if (trailerContainer && trailer) {
            trailerContainer.innerHTML = `
                <div class="trailer-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${trailer.key}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
        } else if (trailerContainer) {
            trailerContainer.innerHTML = '<p>No trailer available for this movie.</p>';
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
    }
}

// Share movie function
async function shareMovie(movie) {
    const shareData = {
        title: movie.title,
        text: `Check out "${movie.title}" (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}) - Rating: ${movie.vote_average?.toFixed(1) || 'N/A'}/10`,
        url: window.location.href
    };
    
    // Try to use native share API (mobile)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            alertSuccess('Movie shared successfully! 🎉');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                fallbackShare(shareData);
            }
        }
    } else {
        // Fallback for desktop browsers
        fallbackShare(shareData);
    }
}

// Fallback share method (copy to clipboard)
function fallbackShare(shareData) {
    const shareText = `${shareData.title}\n${shareData.text}\nWatch it here: ${shareData.url}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        alertSuccess('Movie info copied to clipboard! 📋 Share it with your friends.');
    }).catch(() => {
        alertMessage('Could not copy to clipboard. You can manually share the URL.');
    });
}

// Display movie details
function displayMovieDetails(movie) {
    const container = document.getElementById('movie-details');
    if (!container) return;
    
    const posterUrl = movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null;
    const backdropUrl = movie.backdrop_path ? `${TMDB_BACKDROP_URL}${movie.backdrop_path}` : null;
    
    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
    const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A';
    const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const voteCount = movie.vote_count ? movie.vote_count.toLocaleString() : '0';
    
    container.innerHTML = `
        <div class="movie-details-card" style="${backdropUrl ? `background-image: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${backdropUrl}); background-size: cover; background-position: center;` : ''}">
            <div class="movie-details-content">
                <div class="movie-poster-section">
                    ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" class="detail-poster">` : '<div class="no-poster detail-no-poster">🎬</div>'}
                </div>
                <div class="movie-info-section">
                    <h1 class="movie-title-detail">${movie.title}</h1>
                    <p class="movie-tagline">${movie.tagline || ''}</p>
                    <div class="movie-meta">
                        <div class="meta-item">
                            <span class="meta-icon">📅</span>
                            <span class="meta-label">Year</span>
                            <span class="meta-value">${releaseYear}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">⏱️</span>
                            <span class="meta-label">Runtime</span>
                            <span class="meta-value">${runtime}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">⭐</span>
                            <span class="meta-label">Rating</span>
                            <span class="meta-value">${rating}/10</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-icon">🗳️</span>
                            <span class="meta-label">Votes</span>
                            <span class="meta-value">${voteCount}</span>
                        </div>
                    </div>
                    <div class="movie-genres">🎭 ${genres}</div>
                    <div class="movie-overview">
                        <h3>Synopsis</h3>
                        <p>${movie.overview || 'No synopsis available.'}</p>
                    </div>
                    <div class="action-buttons">
                        <button id="share-btn" class="share-btn">📤 Share this movie</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="trailer-section">
            <h3>🎬 Trailer</h3>
            <div id="trailer-container" class="trailer-container">
                <div class="loading-spinner"><div class="spinner"></div><p>Loading trailer...</p></div>
            </div>
        </div>
    `;
    
    // Add share button functionality
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareMovie(movie);
        });
    }
}

// Favorites functions
function getFavorites() {
    return JSON.parse(localStorage.getItem('movieFavorites')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}

function isFavorite(movieId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === movieId);
}

function addFavorite(movieId) {
    // We need to fetch movie details to save
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`)
        .then(res => res.json())
        .then(movie => {
            const favorites = getFavorites();
            if (!favorites.some(fav => fav.id === movieId)) {
                favorites.push({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                    rating: movie.vote_average.toFixed(1),
                    poster: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null
                });
                saveFavorites(favorites);
                alertSuccess('Movie added to favorites! ❤️');
                updateFavoriteButton(movieId);
            }
        })
        .catch(error => {
            console.error('Error adding favorite:', error);
            alertError('Could not add to favorites');
        });
}

function removeFavorite(movieId) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.id !== movieId);
    saveFavorites(favorites);
    alertMessage('Movie removed from favorites 💔');
    updateFavoriteButton(movieId);
}

function updateFavoriteButton(movieId) {
    const container = document.getElementById('favorite-btn-container');
    if (!container) return;
    
    const isFav = isFavorite(movieId);
    
    container.innerHTML = `
        <button id="favorite-btn" class="favorite-btn ${isFav ? 'favorited' : ''}">
            ${isFav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
        </button>
    `;
    
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            if (isFavorite(movieId)) {
                removeFavorite(movieId);
            } else {
                addFavorite(movieId);
            }
        });
    }
}

// Initialize page
async function init() {
    await loadHeaderFooter();
    
    if (!movieId) {
        const container = document.getElementById('movie-details');
        if (container) {
            container.innerHTML = '<p>No movie selected. <a href="index.html">Go back to home</a></p>';  // CHANGED
        }
        return;
    }
    
    await fetchMovieDetails();
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = document.referrer || 'index.html';  // CHANGED from '/' to 'index.html'
        });
    }
}

init();