package config

import (
	"os"
)

type Config struct {
	Port         string
	DBPath       string
	SyncInterval string
	LogLevel     string
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "data/dam.db"
	}

	syncInterval := os.Getenv("SYNC_INTERVAL")
	if syncInterval == "" {
		syncInterval = "24h"
	}

	logLevel := os.Getenv("LOG_LEVEL")
	if logLevel == "" {
		logLevel = "info"
	}

	return &Config{
		Port:         port,
		DBPath:       dbPath,
		SyncInterval: syncInterval,
		LogLevel:     logLevel,
	}
}
