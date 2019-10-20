package main

import (
	"log"
	"net/http"
	"time"

	"github.com/tumachine/redditplace/server/routes"
)

func main() {
	// router := mux.NewRouter()
	port := "8080"

	router := routes.Handlers()

	// wsRoute(router)

	srv := &http.Server{
		Handler:      router,
		Addr:         "192.168.0.108:" + port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Fatal(srv.ListenAndServe())
}
