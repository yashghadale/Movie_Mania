import React, { useState, useEffect } from "react";

import MovieCard from "./MovieCard";
import SearchIcon from "./search.png";
import "./App.css";

const API_URL = "http://www.omdbapi.com?apikey=47082f9d";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    searchMovies("Batman");
  }, []);

  // Fetch movies on search
  const searchMovies = async (title) => {
    if (!title) return;
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search || []);
  };

  // Fetch suggestions on typing
  const fetchSuggestions = async (title) => {
    if (!title) {
      setSuggestions([]);
      return;
    }
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setSuggestions(data.Search || []);
  };

  // Debounce input to avoid too many API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 500); // 500ms delay
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="app">
      <h1>Movie Mania</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.slice(0, 5).map((movie) => (
              <div
                key={movie.imdbID}
                className="suggestion-item"
                onClick={() => {
                  setSearchTerm(movie.Title);
                  searchMovies(movie.Title);
                  setSuggestions([]);
                }}
              >
                <div className="suggestion-item">
  {movie.Title} ({movie.Year})
</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found</h2>
        </div>
      )}
    </div>
  );
};

export default App;
