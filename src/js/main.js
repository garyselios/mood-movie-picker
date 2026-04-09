import { loadHeaderFooter } from './utils.js';
import { alertMessage } from './alert.js';
import { displayMoodGif } from './giphyAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Page loaded');
  
  // Load header and footer
  await loadHeaderFooter();
  
  // Show welcome alert
  alertMessage('Welcome to Mood Movie Picker! 🎬 Pick your mood to discover the perfect movie.');
  
  const moodButtons = document.querySelectorAll('.mood-btn');
  const messageDiv = document.getElementById('message');
  
  console.log(`Found ${moodButtons.length} mood buttons`);
  
  moodButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const mood = button.getAttribute('data-mood');
      console.log(`Selected mood: ${mood}`);
      
      // Show alert message for the selected mood
      alertMessage(`You selected: ${mood} mood! Loading recommendations... 🎬`);
      
      // Show GIF for the selected mood
      await displayMoodGif(mood, 'gif-container');
      
      messageDiv.innerHTML = `<p>🎬 Loading movies for <strong>${mood}</strong> mood... Please wait.</p>`;
      
      // Navigate to results after 5 seconds - REMOVED THE SLASH /
      setTimeout(() => {
        window.location.href = `results.html?mood=${mood}`;
      }, 3000);
    });
  });
});

// Search functionality
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

if (searchBtn && searchInput) {
    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`; // REMOVED SLASH
        }
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Make sure search works
setTimeout(() => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchBtn && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`; // REMOVED SLASH
            }
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        console.log('Search listeners added from main.js');
    }
}, 500);