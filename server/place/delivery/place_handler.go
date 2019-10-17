package delivery

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/tumachine/place/server/models"
	"github.com/tumachine/place/server/place"
	"github.com/tumachine/place/server/utils"
	"github.com/tumachine/place/server/websocket"
)

type PlaceHandler struct {
	PUsecase place.Usecase
}

func NewPlaceHandler(r *mux.Router, p place.Usecase) {
	handler := &PlaceHandler{
		PUsecase: p,
	}
	r.HandleFunc("/api/place/board-bitmap", handler.GetPlace)
	r.HandleFunc("/api/place/pixel", handler.GetPixel)

	ws := websocket.NewPool()
	r.HandleFunc("/ws", handler.wsRoute(ws))
	r.HandleFunc("/api/place/draw", handler.SetPixel(ws))
}

func (p *PlaceHandler) wsRoute(pool *websocket.Pool) http.HandlerFunc {
	go pool.Start()
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Websocket Endpoint Hit")
		conn, err := websocket.Upgrade(w, r)
		if err != nil {
			fmt.Fprintf(w, "%+v\n", err)
		}
		client := &websocket.Client{
			Conn: conn,
			Pool: pool,
		}

		pool.Register <- client
		client.Read()
	}
}

func (p *PlaceHandler) GetPixel(w http.ResponseWriter, r *http.Request) {
	pixel := &models.Pixel{}
	json.NewDecoder(r.Body).Decode(pixel)
	pixel, err := p.PUsecase.GetPixel(pixel.X, pixel.Y)
	if err != nil {
		utils.ErrResponse(w, err.Error())
		return
	}

	utils.SuccessResponse(w, pixel, "got pixel")
}

func (p *PlaceHandler) SetPixel(pool *websocket.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, isAuthenticated := utils.AuthMiddleware(r, []byte("secret"))
		if !isAuthenticated {
			utils.ErrResponse(w, "Only logged in user can place a pixel")
			return
		}

		pixel := &models.Pixel{}

		err := json.NewDecoder(r.Body).Decode(pixel)
		fmt.Println(pixel.X, pixel.Y, pixel.Color)
		if err != nil {
			utils.ErrResponse(w, "Invalid request")
			return
		}

		err = p.PUsecase.SetPixel(pixel)
		if err != nil {
			utils.ErrResponse(w, err.Error())
			return
		}
		byt, _ := json.Marshal(pixel)
		pool.Broadcast <- websocket.Message{Type: 1, Body: string(byt)}

		utils.SuccessResponse(w, nil, "Placed pixel")
	}
}

func (p *PlaceHandler) GetPlace(w http.ResponseWriter, r *http.Request) {
	place, err := p.PUsecase.GetPlace()
	if err != nil {
		utils.ErrResponse(w, err.Error())
		return
	}
	utils.SuccessResponse(w, place, "Got place")
}
