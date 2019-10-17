package websocket

import (
	// "fmt"
	// "log"

	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		// listen for any closed connection
		_, _, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		// message := Message{Type: messageType, Body: string(p)}
		// c.Pool.Broadcast <- message
		// fmt.Printf("Message received: %+v\n", message)
	}
}
