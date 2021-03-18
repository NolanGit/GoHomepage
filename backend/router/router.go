package router

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()
	router.LoadHTMLGlob("../dist/index.html")
	router.Static("/static", "../dist/static")
	router.Use(cors.Default()) // 允许全部域名
	router.GET("/", func(c *gin.Context) {
		c.HTML(
			http.StatusOK,
			"index.html",
			gin.H{
				"title": "Web",
				"url":   "./web.json",
			},
		)
	})
	return router
}
