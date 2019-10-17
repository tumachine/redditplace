package account

import (
	"github.com/tumachine/place/server/models"
)

type Repository interface {
	Create(u *models.User) error
	FindOne(email string) (*models.User, error)
	GetByID(id uint) (*models.User, error)
	Update(u *models.User) error
}
