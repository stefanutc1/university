package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/Projects-FEAA-UCV/dam3-backend/services"
)

func RegisterWebSocketRoutes(app *fiber.App, hub *services.WSHub) {
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/expenses/:groupId", websocket.New(func(c *websocket.Conn) {
		groupId := c.Params("groupId")
		_ = groupId
		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				break
			}
			_ = msg
		}
	}))
}
