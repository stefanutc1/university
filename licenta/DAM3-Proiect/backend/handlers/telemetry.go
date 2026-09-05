package handlers

import (
	"database/sql"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func RegisterTelemetryRoutes(router fiber.Router, db *sql.DB) {
	router.Post("/telemetry", func(c *fiber.Ctx) error {
		type LogEvent struct {
			AppVersion   string `json:"app_version"`
			Platform     string `json:"platform"`
			ErrorMessage string `json:"error_message"`
			StackTrace   string `json:"stack_trace"`
		}
		var evt LogEvent
		if err := c.BodyParser(&evt); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid format"})
		}

		id := uuid.New().String()
		_, err := db.Exec(
			"INSERT INTO telemetry_logs (id, app_version, platform, error_message, stack_trace) VALUES (?, ?, ?, ?, ?)",
			id, evt.AppVersion, evt.Platform, evt.ErrorMessage, evt.StackTrace,
		)
		if err != nil {
			log.Printf("[WARN] Failed to insert telemetry log: %v", err)
		}

		return c.Status(201).JSON(fiber.Map{"status": "received", "id": id})
	})
}
