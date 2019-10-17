package database

import (
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/joho/godotenv"
	"github.com/tumachine/place/server/models"
)

func PostgresConn() (*gorm.DB, error) {
	err := godotenv.Load()

	username := os.Getenv("postgresUser")
	password := os.Getenv("postgresPassword")
	databaseName := os.Getenv("postgresName")
	// databaseHost := os.Getenv("databaseHost")

	// dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmode=disable password=%s", databaseHost, username, databaseName, password)

	dbURI := fmt.Sprintf("user=%s dbname=%s sslmode=disable password=%s", username, databaseName, password)
	postgresDB, err := gorm.Open("postgres", dbURI)

	if err != nil {
		fmt.Println("Could not connect to POSTGRES: ", err)
		return nil, err
	}

	// defer postgresDB.Close()

	postgresDB.AutoMigrate(
		&models.User{},
		&models.Pixel{})

	fmt.Println("Succesfully connected to POSTGRES: ")

	return postgresDB, nil
}
