import { loadHeaderFooter, initSearch } from './utils.js';
import { alertMessage } from './alert.js';
import { displayMoodGif } from './giphyAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Page loaded');
  
  // Load header and footer
  await loadHeaderFooter();
  
  // Initialize search (this will work because header is now loaded)
  initSearch();
  
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
      
      // Navigate to results after 3 seconds
      setTimeout(() => {
        window.location.href = `results.html?mood=${mood}`;
      }, 3000);
    });
  });
});