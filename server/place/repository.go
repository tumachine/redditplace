package place

import (
	"github.com/tumachine/redditplace/server/models"
)

type Repository interface {
	GetPlace() ([]byte, error)
	GetPixel(x, y uint) (*models.Pixel, error)
	SetPixel(p *models.Pixel) error
}
