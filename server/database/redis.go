package database

import (
	"fmt"
	"os"

	"github.com/go-redis/redis"
	"github.com/joho/godotenv"
)

func RedisConn() (*redis.Client, error) {
	err := godotenv.Load()

	host := os.Getenv("redisHost")
	port := os.Getenv("redisPort")
	password := os.Getenv("redisPassword")

	redClient := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%v:%v", host, port),
		Password: password,
		DB:       0,
	})

	pong, err := redClient.Ping().Result()
	if err != nil {
		fmt.Println("Could not connect to REDIS: ", err)
		return nil, err
	}
	fmt.Println("Succesfully connected to REDIS: ", pong)

	return redClient, nil
}
