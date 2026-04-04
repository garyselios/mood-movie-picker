import { loadHeaderFooter } from './utils.js';
import { alertMessage, alertSuccess, alertError } from './alert.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Page loaded');
  
  // Load header and footer
  await loadHeaderFooter();
  
  // Show welcome alert (optional - you can remove this line if you want)
  alertMessage('Welcome to Mood Movie Picker! 🎬 Pick your mood to discover the perfect movie.');
  
  const moodButtons = document.querySelectorAll('.mood-btn');
  const messageDiv = document.getElementById('message');
  
  console.log(`Found ${moodButtons.length} mood buttons`);
  
  moodButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mood = button.getAttribute('data-mood');
      console.log(`Selected mood: ${mood}`);
      
      // Show alert message for the selected mood
      alertMessage(`You selected: ${mood} mood! Loading recommendations... 🎬`);
      
      messageDiv.innerHTML = `<p>🎬 Loading movies for <strong>${mood}</strong> mood... Please wait.</p>`;
      
      setTimeout(() => {
        window.location.href = `/results.html?mood=${mood}`;
      }, 800);
    });
  });
});