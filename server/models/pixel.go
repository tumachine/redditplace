package models

import (
	"time"
)

type Pixel struct {
	X         uint `gorm:"type:smallint;primary_key" json:"x"`
	Y         uint `gorm:"type:smallint;primary_key" json:"y"`
	Color     uint `json:"color"`
	Timestamp time.Time
	UserID    uint `json:"user_id"`
}
