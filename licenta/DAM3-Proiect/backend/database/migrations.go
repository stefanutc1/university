package database

import (
	"database/sql"
	"fmt"
	"log"
)

func RunMigrations(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS groups (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		currency TEXT NOT NULL DEFAULT 'RON',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS participants (
		id TEXT PRIMARY KEY,
		group_id TEXT NOT NULL,
		name TEXT NOT NULL,
		avatar_color TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS expenses (
		id TEXT PRIMARY KEY,
		group_id TEXT NOT NULL,
		payer_id TEXT NOT NULL,
		description TEXT NOT NULL,
		amount REAL NOT NULL,
		currency TEXT NOT NULL DEFAULT 'RON',
		category TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE,
		FOREIGN KEY(payer_id) REFERENCES participants(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS expense_splits (
		id TEXT PRIMARY KEY,
		expense_id TEXT NOT NULL,
		participant_id TEXT NOT NULL,
		share_amount REAL NOT NULL,
		FOREIGN KEY(expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
		FOREIGN KEY(participant_id) REFERENCES participants(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS exchange_rates (
		currency TEXT PRIMARY KEY,
		rate_to_ron REAL NOT NULL,
		source TEXT NOT NULL,
		last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS telemetry_logs (
		id TEXT PRIMARY KEY,
		app_version TEXT,
		platform TEXT,
		error_message TEXT,
		stack_trace TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`

	_, err := db.Exec(schema)
	if err != nil {
		return fmt.Errorf("migration exec error: %w", err)
	}

	log.Println("[INFO] SQLite database migrations executed successfully.")
	return nil
}

// Expenses and splits table schema verified

// Exchange rates schema verified
