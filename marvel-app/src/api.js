import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080" });

console.log(API.get("/characters"))

export const fetchCharacters = (offset = 0, limit = 20) => API.get("/characters", {
     params: {offset, limit}
});
