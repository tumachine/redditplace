package repository

import (
	"fmt"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/tumachine/place/server/models"
	"github.com/tumachine/place/server/place"
)

type postgresPlaceRepository struct {
	postgres *gorm.DB
}

func NewPlacePostgresStore(postgres *gorm.DB) place.Repository {
	return &postgresPlaceRepository{
		postgres: postgres,
	}
}

func (r *postgresPlaceRepository) GetPlace() ([]byte, error) {
	panic("not implemented")
}

func (r *postgresPlaceRepository) GetPixel(x uint, y uint) (*models.Pixel, error) {
	pixel := &models.Pixel{}
	// User      User `gorm:foreignkey:UserID`
	// UserID    uint
	// Timestamp *time.Time

	if err := r.postgres.Where("X = ? and Y = ?", x, y).First(pixel).Error; err != nil {
		return nil, err
	}
	return pixel, nil
}

func (r *postgresPlaceRepository) SetPixel(p *models.Pixel) error {
	user := &models.User{}
	// check if user has correct id
	if err := r.postgres.First(user, p.UserID).Error; err != nil {
		return fmt.Errorf("User with was not found")
	}
	// cannot set pixel if 10 seconds hasn't passed
	// if time.Now().Unix()-user.PixelPlaced.Unix() < int64((time.Second * 10).Seconds()) {
	// 	return fmt.Errorf("You cannot place a pixel for now")
	// }

	p.Timestamp = time.Now()

	dbPixel := &models.Pixel{}
	// search for a pixel
	if r.postgres.Where("x = ? AND y = ?", p.X, p.Y).First(dbPixel).RecordNotFound() {
		// create pixel
		createdPixel := r.postgres.Create(p)
		if createdPixel.Error != nil {
			return createdPixel.Error
		}
		return nil
	}
	r.postgres.Model(dbPixel).Updates(map[string]interface{}{"color": p.Color, "user_id": p.UserID})
	return nil
}
