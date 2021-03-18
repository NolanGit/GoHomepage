package main

import (
	"./router"
)

func main() {
	router := router.SetupRouter()
	_ = router.Run()
}
