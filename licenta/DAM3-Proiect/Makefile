start:
	npm start

test:
	node tests/run_all_tests.js

backend-run:
	cd backend && go run main.go

backend-build:
	cd backend && go build -o bin/server main.go

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down
