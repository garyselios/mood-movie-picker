const GIPHY_API_KEY ='OweNoqdK9w1YiS16lGTsWt8rBQpdhA2m';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

// Fetch a GIF based on mood
export async function getMoodGif(mood) {
  try {
    const moodMap = {
      happy: 'happy dancing',
      sad: 'sad',
      bored: 'bored',
      excited: 'excited',
      nostalgic: 'nostalgic',
      suspenseful: 'suspenseful'
    };
    
    const searchTerm = moodMap[mood] || mood;
    const url = `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${searchTerm}&limit=1&rating=pg`;
    
    console.log('Fetching URL:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Data received:', data);
    
    if (data.data && data.data.length > 0) {
      return data.data[0].images.original.url;
    } else {
      console.log('No GIF found, using fallback');
      return 'https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif';
    }
  } catch (error) {
    console.error('Error fetching GIF:', error);
    return null;
  }
}

// Display GIF in a container
export async function displayMoodGif(mood, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.log('Container not found:', containerId);
    return;
  }
  
  // Show loading spinner
  container.innerHTML = `
    <div class="gif-loading">
      <div class="spinner"></div>
      <p>Loading GIF... 🎞️</p>
    </div>
  `;
  
  const gifUrl = await getMoodGif(mood);
  console.log('GIF URL:', gifUrl);
  
  if (gifUrl) {
    container.innerHTML = `
      <div class="gif-container">
        <img src="${gifUrl}" alt="${mood} mood GIF" class="mood-gif" style="max-width: 300px; border-radius: 12px;">
        <p class="gif-caption">Feeling ${mood}? Here's a GIF for you!</p>
      </div>
    `;
  } else {
    container.innerHTML = '<p>Sorry, couldn\'t load a GIF for this mood. 😢</p>';
  }
}