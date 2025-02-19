import { getTrending, searchContent, getGenres, getMoviesByGenre } from "./api.js";
import { displayTrending } from "./ui.js";

// SEARCH EVENT
document.getElementById("searchButton").addEventListener("click", async () => {
    const query = document.getElementById("searchInput").value;
    const results = await searchContent(query);
    displayTrending(results, "searchResults");
});

// Trailer Event
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("trailer-btn")) {
        const trailerUrl = event.target.getAttribute("data-trailer");
        document.getElementById("trailer-container").innerHTML = trailerUrl ? 
            `<iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>` :
            "Trailer Not Available 😔";
    }
});

// Genre Event
document.getElementById('genreSelect').addEventListener('change', async (event) => {
    const genreId = event.target.value;

    if (genreId) {
        const movies = await getMoviesByGenre(genreId); // Llamada a la API para obtener películas por género
        displayTrending(movies, "searchResults"); // Muestra las películas en el contenedor
    }
});

// LOAD Genres
async function loadGenres() {
    const genres = await getGenres();
    const genreSelect = document.getElementById('genreSelect');
    
    genreSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a Genre';
    genreSelect.appendChild(defaultOption);

    if (genres && genres.length > 0) {
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } else {
        genreSelect.innerHTML = '<option>No genres available</option>';
    }
}

// load movies, series
getTrending("movie").then(movies => displayTrending(movies, "trending-movies"));
getTrending("tv").then(series => displayTrending(series, "trending-series"));
loadGenres();
