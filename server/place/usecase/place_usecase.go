package usecase

import (
	"time"

	"github.com/tumachine/place/server/account"
	"github.com/tumachine/place/server/models"
	"github.com/tumachine/place/server/place"
)

type placeUsecase struct {
	placeRepo   place.Repository
	redisRepo   place.Repository
	accountRepo account.Repository
}

func NewPlaceUsecase(placeRepo place.Repository, redisRepo place.Repository, accountRepo account.Repository) place.Usecase {
	return &placeUsecase{
		placeRepo:   placeRepo,
		accountRepo: accountRepo,
		redisRepo:   redisRepo,
	}
}

func (p *placeUsecase) GetPlace() ([]byte, error) {
	return p.redisRepo.GetPlace()
}

func (p *placeUsecase) GetPixel(x uint, y uint) (*models.Pixel, error) {
	return p.placeRepo.GetPixel(x, y)
}

func (p *placeUsecase) SetPixel(pixel *models.Pixel) error {
	err := p.placeRepo.SetPixel(pixel)
	if err != nil {
		return err
	}

	err = p.redisRepo.SetPixel(pixel)
	if err != nil {
		return err
	}

	user, err := p.accountRepo.GetByID(pixel.UserID)
	if err != nil {
		return err
	}
	user.PixelPlaced = time.Now()

	err = p.accountRepo.Update(user)
	if err != nil {
		return err
	}
	return nil
}
