//KEYS
import { TMDB_API_KEY, YOUTUBE_API_KEY } from './config.js';

// api.js
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function getTrending(type = "movie") {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching trending", error);
        return [];
    }
}

export async function getMovieTrailer(movieTitle) {
    if (!movieTitle || movieTitle.trim() === "") {
        console.error("Movie title is undefined or empty.");
        return null; 
    }

    try {
        const response = await fetch(`${YOUTUBE_BASE_URL}/search?part=snippet&q=${encodeURIComponent(movieTitle + " trailer")}&type=video&key=${YOUTUBE_API_KEY}`);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        
        const data = await response.json();
        console.log("YouTube search data:", data);
        
        if (!data.items || data.items.length === 0) return null;
        
        return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
    } catch (error) {
        console.error("Error fetching trailer", error);
        return null;
    }
}




export async function searchContent(query, type = "movie") {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error searching content", error);
        return [];
    }
}

export async function getGenres() {
    try {
        const response = await fetch('./js/genres.json');
        if (!response.ok) throw new Error(`Error fetching genres: ${response.statusText}`);
        const genres = await response.json();
        return genres;
    } catch (error) {
        console.error("Error fetching genres", error);
        return [];
    }
}

export async function getMoviesByGenre(genreId) {
    try {
        console.log("Fetching movies for genre:", genreId);
        const response = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`);
        if (!response.ok) throw new Error(`Error fetching movies by genre: ${response.statusText}`);
        const data = await response.json();
        console.log("Movies by genre:", data.results); // Verifica los datos de películas por género
        return data.results;
    } catch (error) {
        console.error("Error fetching movies by genre", error);
        return [];
    }
}

