import React, { useState } from 'react';
import { fetchCharacters } from '../api'; // Assuming fetchCharacters sends requests to your Go backend

function Search({ setCharacters }) {
  const [searchQuery, setSearchQuery] = useState(""); // Track search query

  const handleSearch = async () => {
    if (searchQuery.trim().length < 1) {
      alert("Input cannot be blank");
      return;
    }

    try {
      // Fetch characters from Go backend with the search query
      const result = await fetchCharacters(searchQuery);
      setCharacters(result?.data?.data?.results || []); // Update the character list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        placeholder="Search Marvel characters..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
