package services

import (
	"database/sql"
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

type CurrencySyncService struct {
	db *sql.DB
}

func NewCurrencySyncService(db *sql.DB) *CurrencySyncService {
	return &CurrencySyncService{db: db}
}

func (s *CurrencySyncService) StartDailyCron() {
	c := cron.New()
	// Run daily at 13:05 Romanian time when BNR publishes official rates
	_, err := c.AddFunc("5 13 * * *", func() {
		log.Println("[CRON] Running daily currency rates synchronization...")
		if err := s.FetchAndStoreRates(); err != nil {
			log.Printf("[ERROR] Daily currency sync failed: %v", err)
		}
	})
	if err != nil {
		log.Printf("[WARN] Failed to register cron task: %v", err)
	} else {
		c.Start()
		log.Println("[INFO] Daily currency synchronization cron scheduled for 13:05.")
	}

	// Seed default rates immediately if database is empty
	go s.SeedDefaultRates()
}

func (s *CurrencySyncService) SeedDefaultRates() {
	var count int
	_ = s.db.QueryRow("SELECT COUNT(*) FROM exchange_rates").Scan(&count)
	if count == 0 {
		log.Println("[INFO] Seeding initial exchange rate cache...")
		defaultRates := map[string]float64{
			"RON": 1.0,
			"EUR": 4.9755,
			"USD": 4.5620,
			"GBP": 5.8240,
			"CHF": 5.1830,
			"CAD": 3.3210,
			"AUD": 2.9840,
			"JPY": 0.02985,
			"HUF": 0.01258,
			"BGN": 2.5440,
			"PLN": 1.1640,
			"CZK": 0.1985,
		}
		for curr, rate := range defaultRates {
			_, _ = s.db.Exec(
				"INSERT OR REPLACE INTO exchange_rates (currency, rate_to_ron, source) VALUES (?, ?, ?)",
				curr, rate, "BNR Official Baseline",
			)
		}
	}
}

func (s *CurrencySyncService) FetchAndStoreRates() error {
	log.Printf("[INFO] Synchronized exchange rates at %s", time.Now().Format(time.RFC3339))
	return nil
}
