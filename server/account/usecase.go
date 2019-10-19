package account

import (
	"github.com/tumachine/redditplace/server/models"
)

type Usecase interface {
	Create(u *models.User) error
	FindOne(email, password string) (*models.User, error)
	GetByID(id uint) (*models.User, error)
	Update(u *models.User) error
}
