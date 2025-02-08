import {TMDB_API_KEY} from "./config.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function getTrendingMovies() {
    const response = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`)
    const data =  await response.json();
    console.log("Trending Movies:", data.results);
}

getTrendingMovies

import { YOUTUBE_API_KEY } from "./config.js";

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3"

async function getMovieTrailer(query){
    const response = await fetch(`${YOUTUBE_BASE_URL}/search?part=snippet&q=${query} trailer&type=video&key=${YOUTUBE_API_KEY}`)
    const data = await response.json();
    console.log("Trailer:", data.items[0]);
}

getMovieTrailer("Inception");