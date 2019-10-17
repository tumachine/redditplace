package usecase

import (
	"fmt"

	"github.com/tumachine/place/server/account"
	"github.com/tumachine/place/server/models"
	"golang.org/x/crypto/bcrypt"
)

// maybe create token.Repository
type accountUsecase struct {
	accountRepo account.Repository
}

func NewAccountUsecase(accountRepo account.Repository) account.Usecase {
	return &accountUsecase{
		accountRepo: accountRepo,
	}
}

func (u *accountUsecase) GetByID(id uint) (*models.User, error) {
	user, err := u.accountRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (u *accountUsecase) Update(user *models.User) error {
	err := u.accountRepo.Update(user)
	if err != nil {
		return err
	}
	return nil
}

func (a *accountUsecase) Create(user *models.User) error {
	// check if provided email is already in the database
	_, err := a.accountRepo.FindOne(user.Email)
	if err == nil {
		return fmt.Errorf("User with this email already exists")
	}

	pass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("Password encryption failed")
	}
	user.Password = string(pass)

	err = a.accountRepo.Create(user)
	if err != nil {
		return err
	}

	return nil
}

func (a *accountUsecase) FindOne(email, password string) (*models.User, error) {
	user, err := a.accountRepo.FindOne(email)
	if err != nil {
		return nil, err
	}

	// compare provided password with hashed password stored in database
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return nil, fmt.Errorf("Invalid login credentials. Please try again")
	}
	return user, nil
}
