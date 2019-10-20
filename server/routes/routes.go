package routes

import (
	"net/http"

	"github.com/gorilla/mux"
	_accountHttp "github.com/tumachine/redditplace/server/account/delivery"
	_accountRepo "github.com/tumachine/redditplace/server/account/repository"
	_accountUsecase "github.com/tumachine/redditplace/server/account/usecase"
	"github.com/tumachine/redditplace/server/database"
	_placeHttp "github.com/tumachine/redditplace/server/place/delivery"
	_placeRepo "github.com/tumachine/redditplace/server/place/repository"
	_placeUsecase "github.com/tumachine/redditplace/server/place/usecase"
)

func Handlers() *mux.Router {
	router := mux.NewRouter()

	// connect to databases
	redisDB, err := database.RedisConn()
	if err != nil {
		panic(err)
	}

	postgresDB, err := database.PostgresConn()
	if err != nil {
		panic(err)
	}

	// setup CORS middleware
	router.Use(CORSMiddleware)

	accountRepo := _accountRepo.NewPostgresUserRepository(postgresDB)
	placeRedisRepo := _placeRepo.NewPlaceRedisStore(redisDB.Conn())
	placePostgresRepo := _placeRepo.NewPlacePostgresStore(postgresDB)

	placeUsecase := _placeUsecase.NewPlaceUsecase(placePostgresRepo, placeRedisRepo, accountRepo)
	_placeHttp.NewPlaceHandler(router, placeUsecase)

	accountUsecase := _accountUsecase.NewAccountUsecase(accountRepo)
	_accountHttp.NewAccountHandler(router, accountUsecase)

	return router
}

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
