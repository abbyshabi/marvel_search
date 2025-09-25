import React, { useState } from "react";
import "./Search.css";

function Search({ searchQuery, setSearchQuery, triggerSearch, fetchSuggestions }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() !== "") {
      try {
        const fetchedSuggestions = await fetchSuggestions(query); // Fetch suggestions
        setSuggestions(fetchedSuggestions || []);
        setIsDropdownOpen(fetchedSuggestions && fetchedSuggestions.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsDropdownOpen(false);
      }
    } else {
      // Clear suggestions if input is empty
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion); // Update input value
    setSuggestions([]); // Clear suggestions
    setIsDropdownOpen(false); // Close dropdown
    triggerSearch(suggestion); // Trigger main search
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setSuggestions([]); // Clear suggestions
    setIsDropdownOpen(false); // Close dropdown
    triggerSearch(); // Trigger main search
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent accidental form submission
      setSuggestions([]); // Clear suggestions
      setIsDropdownOpen(false); // Close dropdown
      triggerSearch(); // Trigger main search
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearchSubmit}>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange} // Fetch suggestions
          placeholder="Search for characters..."
          className="search-input"
          onKeyDown={handleKeyPress} // Handle Enter key for search
        />
        <button
          type="submit"
          className="search-button"
          disabled={!searchQuery.trim()} // Disable button if input is empty
        >
          Search
        </button>
      </div>
      {isDropdownOpen && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion-item"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default Search;
