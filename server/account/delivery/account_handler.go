package delivery

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tumachine/redditplace/server/account"
	"github.com/tumachine/redditplace/server/models"
	"github.com/tumachine/redditplace/server/utils"
)

type AccountHandler struct {
	AUsecase account.Usecase
}

func NewAccountHandler(r *mux.Router, us account.Usecase) {
	handler := &AccountHandler{
		AUsecase: us,
	}

	r.HandleFunc("/auth/login", handler.Login).Methods("POST", "OPTIONS")
	r.HandleFunc("/auth/register", handler.Register).Methods("POST", "OPTIONS")
	r.HandleFunc("/auth/session", handler.Session).Methods("GET", "OPTIONS")
}

func (a *AccountHandler) Register(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	json.NewDecoder(r.Body).Decode(user)

	fmt.Println(user)
	err := a.AUsecase.Create(user)
	if err != nil {
		utils.ErrResponse(w, err.Error())
		return
	}

	utils.SuccessResponse(w, nil, "user created succesfully")
}

func (a *AccountHandler) Login(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		utils.ErrResponse(w, err.Error())
		return
	}

	user, err = a.AUsecase.FindOne(user.Email, user.Password)
	if err != nil {
		utils.ErrResponse(w, err.Error())
		return
	}

	err = utils.JwtCreate(w, user)
	if err != nil {
		utils.ErrResponse(w, err.Error())
		return
	}
}

// Session returns JSON of user info
func (a *AccountHandler) Session(w http.ResponseWriter, r *http.Request) {
	user, isAuthenticated := utils.AuthMiddleware(r, []byte("secret"))
	if !isAuthenticated {
		utils.ErrResponse(w, "unauthorized")
		return
	}

	utils.SuccessResponse(w, user, "correct session cookie")
}
