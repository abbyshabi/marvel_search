// Gin format for basic HTTP requests 

package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func mains() {
	r := gin.Default() // includes logger and recovery middleware by default

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	r.Run(":8080") // listens on port 8080
}

// Echo format for basic HTTP requests 

// package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func maineds() {
	e := echo.New() // echo.New() includes basic middleware, but less than gin.Default()

	e.GET("/ping", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"message": "pong"})
	})

	e.Start(":8080") // listens on port 8080
}

