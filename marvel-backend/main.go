package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Generate the hash required for the Marvel API request
func generateHash(ts, privateKey, publicKey string) string {
	toHash := ts + privateKey + publicKey
	hash := md5.Sum([]byte(toHash))
	return hex.EncodeToString(hash[:])
}

// Create a reusable HTTP client
var httpClient = &http.Client{
	Timeout: 10 * time.Second, // Set timeout for API requests
}

// Handler to fetch characters from the Marvel API
func getCharacters(c *gin.Context) {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Marvel API keys
	publicKey := os.Getenv("publicKey")
	privateKey := os.Getenv("privateKey")
	fmt.Println(publicKey)
	ts := fmt.Sprintf("%d", time.Now().Unix())

	// Generate hash for authentication
	hash := generateHash(ts, privateKey, publicKey)

	// Extract pagination parameters from the query string
	offset := c.DefaultQuery("offset", "0") // Default offset is 0
	limit := c.DefaultQuery("limit", "20")  // Default limit is 20

	// Build the full Marvel API request URL
	url := fmt.Sprintf(
		"https://gateway.marvel.com/v1/public/characters?ts=%s&apikey=%s&hash=%s&offset=%s&limit=%s",
		ts, publicKey, hash, offset, limit,
	)

	// Create a new HTTP request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	// Execute the request
	resp, err := httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch characters"})
		return
	}
	defer resp.Body.Close()

	// Stream the response back to the client
	c.DataFromReader(http.StatusOK, resp.ContentLength, resp.Header.Get("Content-Type"), resp.Body, nil)
}

func main() {
	r := gin.Default()

	// Enable CORS to allow requests from the frontend
	r.Use(cors.Default())

	// Define routes
	r.GET("/characters", getCharacters)

	// Start the server
	r.Run(":8080")
}
