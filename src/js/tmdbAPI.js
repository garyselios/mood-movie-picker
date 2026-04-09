// TMDB API configuration
const TMDB_API_KEY = '8021cf490a93c46f6303ded93635ac95';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Map moods to TMDB genre IDs
const moodToGenres = {
  happy: [35, 10751],      // Comedy, Family
  sad: [18, 10749],        // Drama, Romance
  bored: [28, 878],        // Action, Sci-Fi
  excited: [12, 28],       // Adventure, Action
  nostalgic: [14, 10751],  // Fantasy, Family
  suspenseful: [53, 80]    // Thriller, Crime
};

// Fetch movies by mood
export async function getMoviesByMood(mood) {
  try {
    const genres = moodToGenres[mood] || [18];
    const genreIds = genres.join(',');
    
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds}&sort_by=popularity.desc&vote_count.gte=100&page=1&language=en-US`;
    
    console.log('Fetching movies from TMDB...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.results?.length || 0} movies`);
    
    if (data.results && data.results.length > 0) {
      return data.results.slice(0, 6).map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
        rating: movie.vote_average.toFixed(1),
        poster: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null,
        overview: movie.overview
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}