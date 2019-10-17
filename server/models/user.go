package models

import (
	"time"
)

type User struct {
	ID          uint    `gorm:"primary_key"`
	Username    string  `gorm:"type:char(15)" json:"username"`
	Email       string  `gorm:"type:varchar(100);unique_index" json:"email"`
	Password    string  `json:"password"`
	Pixels      []Pixel `gorm:"foreignkey:UserId"`
	PixelPlaced time.Time
}
