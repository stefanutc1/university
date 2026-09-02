package handlers

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
	"github.com/Projects-FEAA-UCV/dam3-backend/services"
)

func RegisterCurrencyRoutes(router fiber.Router, db *sql.DB, syncService *services.CurrencySyncService) {
	ratesGroup := router.Group("/rates")

	ratesGroup.Get("/", func(c *fiber.Ctx) error {
		rows, err := db.Query("SELECT currency, rate_to_ron, source, last_updated FROM exchange_rates ORDER BY currency ASC")
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		defer rows.Close()

		type RateItem struct {
			Currency    string  `json:"currency"`
			RateToRon   float64 `json:"rate_to_ron"`
			Source      string  `json:"source"`
			LastUpdated string  `json:"last_updated"`
		}

		var rates []RateItem
		for rows.Next() {
			var r RateItem
			if err := rows.Scan(&r.Currency, &r.RateToRon, &r.Source, &r.LastUpdated); err == nil {
				rates = append(rates, r)
			}
		}

		return c.JSON(fiber.Map{
			"base":  "RON",
			"rates": rates,
		})
	})

	ratesGroup.Post("/refresh", func(c *fiber.Ctx) error {
		if err := syncService.FetchAndStoreRates(); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "rates refreshed successfully"})
	})
}

// Manual rate refresh active
