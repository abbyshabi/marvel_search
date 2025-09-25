package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// setupRouter initializes the routes for testing
func setupRouter() *gin.Engine {
	_ = os.Setenv("publicKey", "test-public")
	_ = os.Setenv("privateKey", "test-private")

	r := gin.Default()
	r.GET("/characters", getCharacters)
	r.GET("/characters/suggestions", getCharacterSuggestions)
	return r
}

// Mock HTTP Client not implemented here — you may want to inject a mock for real unit tests

func TestGetCharacters(t *testing.T) {
	router := setupRouter()

	req, _ := http.NewRequest("GET", "/characters?name=Spider-Man", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	assert.Equal(t, http.StatusOK, resp.Code)
	assert.Contains(t, resp.Header().Get("Content-Type"), "application/json") // or "application/json; charset=utf-8"
}

func TestGetCharacterSuggestions(t *testing.T) {
	// Start a mock Marvel API server
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{
			"data": {
				"results": [
					{"name": "Spider-Man"},
					{"name": "Spiral"}
				]
			}
		}`)
	}))
	defer mockServer.Close()

	// Point the handler to use the mock server instead of Marvel's real API
	baseAPIURL = mockServer.URL

	// Use default client or the mock one — doesn't matter now because URL is overridden
	httpClient = &http.Client{}

	os.Setenv("publicKey", "test")
	os.Setenv("privateKey", "test")

	router := setupRouter()

	req, _ := http.NewRequest("GET", "/characters/suggestions?nameStartsWith=spi", nil)
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)
	assert.Equal(t, http.StatusOK, resp.Code)
	assert.Contains(t, resp.Body.String(), "Spider-Man")
}
