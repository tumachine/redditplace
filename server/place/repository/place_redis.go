package repository

import (
	"fmt"

	"github.com/go-redis/redis"
	"github.com/tumachine/redditplace/server/models"
	"github.com/tumachine/redditplace/server/place"
)

type redisPlaceRepository struct {
	redis *redis.Conn
}

func NewPlaceRedisStore(redis *redis.Conn) place.Repository {
	return &redisPlaceRepository{
		redis: redis,
	}
}

func (p *redisPlaceRepository) GetPlace() ([]byte, error) {
	buff, err := p.redis.Get("place").Bytes()

	if err != nil {
		return nil, err
	}
	return buff[:5000], nil
}

// replace to postgres db
func (p *redisPlaceRepository) GetPixel(x, y uint) (*models.Pixel, error) {
	arr, err := p.redis.BitField("place", "get", "u4", (x+100*y)*4).Result()
	if err != nil {
		return nil, err
	}

	color := uint(arr[0])
	pixel := models.Pixel{
		X:     x,
		Y:     y,
		Color: color,
	}
	return &pixel, nil
}

// also save pixel with postgres
func (p *redisPlaceRepository) SetPixel(pixel *models.Pixel) error {
	_, err := p.redis.BitField("place", "set", "u4", (pixel.X+100*pixel.Y)*4, pixel.Color).Result()
	if err != nil {
		return fmt.Errorf("FAILED to SET a pixel at:\n%v", p)
	}
	// resp := utils.Message(true, fmt.Sprintf("Placed a pixel at:\n%v", p))
	fmt.Println("Place a pixel at: ", pixel)
	return nil
	// resp["pixel"] = p
	// return resp
}
