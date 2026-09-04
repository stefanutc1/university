package services

import (
	"log"
	"sync"

	"github.com/gofiber/websocket/v2"
)

type WSHub struct {
	clients    map[*websocket.Conn]string // conn -> groupId
	broadcast  chan []byte
	register   chan *ClientReg
	unregister chan *websocket.Conn
	mutex      sync.RWMutex
}

type ClientReg struct {
	Conn    *websocket.Conn
	GroupID string
}

func NewWSHub() *WSHub {
	return &WSHub{
		clients:    make(map[*websocket.Conn]string),
		broadcast:  make(chan []byte),
		register:   make(chan *ClientReg),
		unregister: make(chan *websocket.Conn),
	}
}

func (h *WSHub) Run() {
	for {
		select {
		case reg := <-h.register:
			h.mutex.Lock()
			h.clients[reg.Conn] = reg.GroupID
			h.mutex.Unlock()
			log.Printf("[WS] Client connected to group %s", reg.GroupID)

		case conn := <-h.unregister:
			h.mutex.Lock()
			delete(h.clients, conn)
			h.mutex.Unlock()
			_ = conn.Close()
			log.Println("[WS] Client disconnected.")

		case message := <-h.broadcast:
			h.mutex.RLock()
			for conn := range h.clients {
				_ = conn.WriteMessage(websocket.TextMessage, message)
			}
			h.mutex.RUnlock()
		}
	}
}

func (h *WSHub) BroadcastToGroup(groupID string, msg []byte) {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	for conn, gId := range h.clients {
		if gId == groupID {
			_ = conn.WriteMessage(websocket.TextMessage, msg)
		}
	}
}
