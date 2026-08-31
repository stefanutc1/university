package handlers

import (
	"database/sql"
	"runtime"
	"time"

	"github.com/gofiber/fiber/v2"
)

var startTime = time.Now()

func RegisterHealthRoutes(router fiber.Router, db *sql.DB) {
	router.Get("/health", func(c *fiber.Ctx) error {
		var m runtime.MemStats
		runtime.ReadMemStats(&m)

		dbStatus := "ok"
		if err := db.Ping(); err != nil {
			dbStatus = "error: " + err.Error()
		}

		return c.JSON(fiber.Map{
			"status":    "ok",
			"service":   "dam3-backend",
			"uptime":    time.Since(startTime).String(),
			"db_status": dbStatus,
			"memory": fiber.Map{
				"alloc_mb":   m.Alloc / 1024 / 1024,
				"total_mb":   m.TotalAlloc / 1024 / 1024,
				"goroutines": runtime.NumGoroutine(),
			},
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})
}
