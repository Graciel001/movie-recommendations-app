import {TMDB_API_KEY, YOUTUBE_API_KEY} from "./config.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

//fetch trending movies or series from TMDb
/**
 * Fetch trending movies or series from TMDb.
 * @param {string} type - "movie" or "tv"
 */

async function getTrending(type = "movie"){
    try {
        const response = await fetch(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${TMDB_API_KEY}`)
        const data = await response.json();
        console.log(`Trending ${type === "movie" ? "Movies" : "Series"}:`, data.results);
        return data.results
    } catch (error) {
        console.error("Error fetchin trending", error)
    }
}

/**
 * Fetch a movie trailer from YouTube.
 * @param {string} movieTitle - The movie title.
 */

async function getMovieTrailer(movieTitle) {
    try {
        const response = await fetch(`${YOUTUBE_BASE_URL}/search?part=snippet&q=${encodeURIComponent(movieTitle + " trailer")}&type=video&key=${YOUTUBE_API_KEY}`);
        
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            console.warn(`No se encontró trailer para: ${movieTitle}`);
            return null;
        }

        return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
    } catch (error) {
        console.error("Error fetching trailer", error);
        return null;
    }
}




/**
 * Search for movies or TV series on TMDb.
 * @param {string} query - The search query (movie/series name).
 * @param {string} type - "movie" or "tv"
 */

async function searchContent(query, type = "movie"){
    try {
        const response = await fetch(`${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
        const data = await response.json();
        console.log(`Search result for "${query}" (${type}):`, data.results);
        return data.results;
    } catch (error) {
        console.error("Error searching content", error)
    }
}

//Get movies by genre function
async function getMoviesByGenre(genreId) {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`)
        const data = await response.json();
        console.log(`Movies in Genre ${genreId}:`, data.results);
        return data.results;
    } catch (error) {
        console.error("Error fetching movies by genre", error);
    }
}

// Get movies by mood function
const moodToGenre = {
    "happy": 35, // comedy
    "sad": 18, //dramatic
    "excited": 28, // action
    "scary": 27, //Horror
    "romantic": 10749 // romantic
}

async function getMoviesByMood(mood) {
    const genreId = moodToGenre[mood.toLowerCase()];
    if (!genreId) {
        console.error("Mood not found");
        return;
    }

    const movies = await getMoviesByGenre(genreId);
    console.log(`Movies for mood "${mood}":`, movies);
    return movies;
}

// function yo show the trends

async function displayTrending(movies, containerId = "results") {
    const resultsContainer = document.getElementById(containerId);
    if (!resultsContainer) return console.error(`Container ${containerId} not found`);
    
    resultsContainer.innerHTML = "";

    for (const movie of movies) {
        const trailerUrl = await getMovieTrailer(movie.title) || "";

        const movieElement = document.createElement("div");
        movieElement.classList.add("movie-card");
        movieElement.innerHTML = `
            <h3>${movie.title || movie.name}</h3>
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default-image.jpg'}" alt="${movie.title || movie.name}">
            <button class="trailer-btn" ${trailerUrl ? `data-trailer="${trailerUrl}"` : ""}>See Trailer</button>
        `;

        resultsContainer.appendChild(movieElement);
    }
}




document.addEventListener("click", (event) => {
    if (event.target.classList.contains("trailer-btn")) {
        const trailerUrl = event.target.getAttribute("data-trailer");
        if (trailerUrl) {
            document.getElementById("trailer-container").innerHTML = `
                <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            alert("Trailer Not Available 😔");
        }
    }
});



getTrending("movie") // Obtain movies on trending
getTrending("tv") // Obtain Series on trending
getMovieTrailer("Inception");  // Find Inseption trailer
searchContent("The Matrix", "movie");  //  Find Matrix Movie
searchContent("Breaking Bad", "tv");  //  Find Breaking Bad serie
getMoviesByGenre(28); // obtain action movies
getMoviesByMood("happy"); // obtain movies by mood

// obtain and show the trend movies and series
getTrending("movie").then(movies => displayTrending(movies, "trending-movies"));
getTrending("tv").then(series => displayTrending(series, "trending-series"));
