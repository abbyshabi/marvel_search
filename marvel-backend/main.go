package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type SuggestionResponse struct {
	Suggestions []string `json:"suggestions"`
}

var baseAPIURL = "https://gateway.marvel.com/v1/public"

func generateHash(ts, privateKey, publicKey string) string {
	toHash := ts + privateKey + publicKey
	hash := md5.Sum([]byte(toHash))
	return hex.EncodeToString(hash[:])
}

var httpClient = defaultHTTPClient()

func defaultHTTPClient() *http.Client {
	return &http.Client{Timeout: 10 * time.Second}
}

func getCharacters(c *gin.Context) {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, relying on environment variables")
	}

	publicKey := os.Getenv("publicKey")
	privateKey := os.Getenv("privateKey")
	ts := fmt.Sprintf("%d", time.Now().Unix())
	hash := generateHash(ts, privateKey, publicKey)

	offset := c.DefaultQuery("offset", "0")
	limit := c.DefaultQuery("limit", "20")
	name := c.DefaultQuery("name", "")

	if name != "" {
		name = url.QueryEscape(name) // Ensure spaces and special characters are encoded
	}

	url := fmt.Sprintf(
		"https://gateway.marvel.com/v1/public/characters?ts=%s&apikey=%s&hash=%s&offset=%s&limit=%s",
		ts, publicKey, hash, offset, limit,
	)

	if name != "" {
		url = fmt.Sprintf("%s&name=%s", url, name)
	}
	fmt.Println(url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch characters"})
		return
	}
	defer resp.Body.Close()

	c.DataFromReader(http.StatusOK, resp.ContentLength, resp.Header.Get("Content-Type"), resp.Body, nil)
}

func getCharacterSuggestions(c *gin.Context) {
	if err := godotenv.Load(); err != nil {
		log.Println("Error loading .env")
	}
	log.Println("publicKey:", os.Getenv("publicKey"))
	log.Println("privateKey:", os.Getenv("privateKey"))

	publicKey := os.Getenv("publicKey")
	privateKey := os.Getenv("privateKey")
	ts := fmt.Sprintf("%d", time.Now().Unix())
	hash := generateHash(ts, privateKey, publicKey)

	nameStartsWith := c.Query("nameStartsWith")

	url := fmt.Sprintf("%s/characters?ts=%s&apikey=%s&hash=%s&nameStartsWith=%s", baseAPIURL, ts, publicKey, hash, nameStartsWith)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch character suggestions"})
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse API response"})
		return
	}

	// Extract suggestions from the API response
	data := result["data"].(map[string]interface{})
	results := data["results"].([]interface{})

	suggestions := []string{}
	for _, item := range results {
		character := item.(map[string]interface{})
		if name, ok := character["name"].(string); ok {
			suggestions = append(suggestions, name)
		}
	}

	c.JSON(http.StatusOK, SuggestionResponse{Suggestions: suggestions})
}

func main() {
	r := gin.Default()

	r.Use(cors.Default())

	// Characters Endpoint
	r.GET("/characters", getCharacters)

	// Suggestions Endpoint
	r.GET("/characters/suggestions", getCharacterSuggestions)

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
