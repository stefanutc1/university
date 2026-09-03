package handlers

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/Projects-FEAA-UCV/dam3-backend/services"
)

func RegisterExpenseRoutes(router fiber.Router, db *sql.DB, hub *services.WSHub) {
	groups := router.Group("/groups")

	groups.Get("/", func(c *fiber.Ctx) error {
		rows, err := db.Query("SELECT id, name, currency, created_at FROM groups ORDER BY created_at DESC")
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		defer rows.Close()

		var res []fiber.Map
		for rows.Next() {
			var id, name, curr, created string
			if err := rows.Scan(&id, &name, &curr, &created); err == nil {
				res = append(res, fiber.Map{
					"id":         id,
					"name":       name,
					"currency":   curr,
					"created_at": created,
				})
			}
		}
		return c.JSON(res)
	})

	groups.Post("/", func(c *fiber.Ctx) error {
		type Req struct {
			Name         string   `json:"name"`
			Currency     string   `json:"currency"`
			Participants []string `json:"participants"`
		}
		var body Req
		if err := c.BodyParser(&body); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "invalid payload"})
		}

		groupId := uuid.New().String()
		if body.Currency == "" {
			body.Currency = "RON"
		}

		tx, err := db.Begin()
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}
		defer tx.Rollback()

		_, err = tx.Exec("INSERT INTO groups (id, name, currency) VALUES (?, ?, ?)", groupId, body.Name, body.Currency)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		for _, name := range body.Participants {
			pId := uuid.New().String()
			_, _ = tx.Exec("INSERT INTO participants (id, group_id, name) VALUES (?, ?, ?)", pId, groupId, name)
		}

		if err := tx.Commit(); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": err.Error()})
		}

		return c.Status(201).JSON(fiber.Map{"id": groupId, "name": body.Name, "currency": body.Currency})
	})

	groups.Get("/:id/settle", func(c *fiber.Ctx) error {
		groupId := c.Params("id")
		settlements, err := services.CalculateSettlementsForGroup(db, groupId)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": fmt.Sprintf("failed to calculate settlements: %v", err)})
		}
		return c.JSON(fiber.Map{
			"group_id":    groupId,
			"settlements": settlements,
		})
	})
}

// Expense balance calculations enabled
