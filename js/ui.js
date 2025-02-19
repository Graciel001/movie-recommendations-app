// ui.js
import { getMovieTrailer } from "./api.js";

export async function displayTrending(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    console.log("Movies to display:", movies); 
    
    container.innerHTML = "";
    for (const movie of movies) {
        const movieTitle = movie.title || movie.name; 
        const trailerUrl = await getMovieTrailer(movieTitle) || "";
        
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie-card");
        movieElement.innerHTML = `
            <h3>${movieTitle}</h3>
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'default-image.jpg'}" alt="${movieTitle}">
            <button class="trailer-btn" ${trailerUrl ? `data-trailer="${trailerUrl}"` : ""}>See Trailer</button>
        `;
        
        container.appendChild(movieElement);
    }
}


