package database

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/tumachine/redditplace/server/account"
	"github.com/tumachine/redditplace/server/models"
)

type postgresUserRepository struct {
	postgres *gorm.DB
}

func NewPostgresUserRepository(postgres *gorm.DB) account.Repository {
	return &postgresUserRepository{
		postgres: postgres,
	}
}

func (u *postgresUserRepository) Create(user *models.User) error {
	createdUser := u.postgres.Create(user)
	if createdUser.Error != nil {
		return createdUser.Error
	}
	return nil
}

func (u *postgresUserRepository) Update(user *models.User) error {
	if err := u.postgres.Save(&user).Error; err != nil {
		return err
	}
	return nil
}

func (u *postgresUserRepository) FindOne(email string) (*models.User, error) {
	user := &models.User{}

	if err := u.postgres.Where("Email = ?", email).First(user).Error; err != nil {
		return nil, fmt.Errorf("Email address not found")
	}
	return user, nil
}

func (u *postgresUserRepository) GetByID(id uint) (*models.User, error) {
	user := &models.User{}
	if err := u.postgres.Where("Id = ?", id).First(user).Error; err != nil {
		return nil, fmt.Errorf("UserID not found")
	}
	return user, nil
}
