// import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:8080" });

// console.log(API.get("/characters"))

// export const fetchCharacters = (offset = 0, limit = 20) => API.get("/characters", {
//      params: {offset, limit}
// });

import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });

export const fetchCharacters = (searchQuery = '', offset = 0, limit = 20) => {
  const params = { offset, limit };

  // Only add the 'name' query parameter if there is a valid search query
  if (searchQuery && searchQuery.trim() !== '') {
    params.name = searchQuery.trim();  // Remove extra spaces
  }

  return API.get("/characters", { params });
};

export const fetchSuggestions = (query) => {
  return API.get(`/characters/suggestions`, {
    params: { nameStartsWith: query },
  })
    .then((response) => response.data.suggestions || [])
    .catch((error) => {
      console.error("Error fetching suggestions:", error);
      return [];
    });
};


