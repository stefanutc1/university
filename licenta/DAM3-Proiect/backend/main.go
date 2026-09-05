package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/Projects-FEAA-UCV/dam3-backend/config"
	"github.com/Projects-FEAA-UCV/dam3-backend/database"
	"github.com/Projects-FEAA-UCV/dam3-backend/handlers"
	"github.com/Projects-FEAA-UCV/dam3-backend/services"
)

func main() {
	cfg := config.LoadConfig()

	// Initialize SQLite with WAL mode
	db, err := database.InitDB(cfg.DBPath)
	if err != nil {
		log.Fatalf("[FATAL] Failed to initialize SQLite database: %v", err)
	}
	defer db.Close()

	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("[FATAL] Failed to run database migrations: %v", err)
	}

	// Initialize WebSocket Hub
	wsHub := services.NewWSHub()
	go wsHub.Run()

	// Initialize Currency Sync Background Cron Job
	currencySync := services.NewCurrencySyncService(db)
	currencySync.StartDailyCron()

	app := fiber.New(fiber.Config{
		AppName: "DAM3 Utility Suite Backend v1.0.0",
	})

	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// API v1 Routes
	api := app.Group("/api/v1")
	handlers.RegisterHealthRoutes(api, db)
	handlers.RegisterCurrencyRoutes(api, db, currencySync)
	handlers.RegisterExpenseRoutes(api, db, wsHub)
	handlers.RegisterTelemetryRoutes(api, db)

	// WebSocket handler
	handlers.RegisterWebSocketRoutes(app, wsHub)

	// Graceful shutdown channel
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("[INFO] DAM3 Utility Suite Backend listening on port %s", cfg.Port)
		if err := app.Listen(":" + cfg.Port); err != nil {
			log.Printf("[INFO] Server shut down: %v", err)
		}
	}()

	<-stopChan
	log.Println("[INFO] Shutting down server gracefully...")
	_ = app.Shutdown()
	log.Println("[INFO] Server stopped.")
}
