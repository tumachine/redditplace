package models

import (
	jwt "github.com/dgrijalva/jwt-go"
)

type Token struct {
	User
	jwt.StandardClaims
}
