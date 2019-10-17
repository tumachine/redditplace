package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/tumachine/place/server/models"
)

type Data map[string]interface{}

func Message(status bool, data interface{}, message string) map[string]interface{} {
	return map[string]interface{}{"success": status, "data": data, "message": message}
}

func ErrMessage(message string) map[string]interface{} {
	return Message(false, nil, message)
}

func ErrResponse(w http.ResponseWriter, message string) {
	Respond(w, ErrMessage(message))
}

func SuccessResponse(w http.ResponseWriter, data interface{}, message string) {
	Respond(w, Message(true, data, message))
}

func Respond(w http.ResponseWriter, data map[string]interface{}) {
	w.Header().Add("Content-Type", "application-json")
	json.NewEncoder(w).Encode(data)
}

func JwtCreate(w http.ResponseWriter, u *models.User) error {
	expiresAt := time.Now().Add(time.Minute * 100000)
	claims := &models.Token{
		User: models.User{Username: u.Username, Email: u.Email},
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		return fmt.Errorf("incorrect credentials")
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expiresAt,
	})
	SuccessResponse(w, Data{"user": claims.User, "token": tokenString}, "logged in succesfully")
	return nil
}

func AuthMiddleware(r *http.Request, jwtKey []byte) (jwt.MapClaims, bool) {
	//obtain session token from the requests cookies
	ck, err := r.Cookie("token")
	if err != nil {
		fmt.Println(err)
		return nil, false
	}

	// Get the JWT string from the cookie
	tokenString := ck.Value

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return jwtKey, nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, true
	}
	return nil, false
}
