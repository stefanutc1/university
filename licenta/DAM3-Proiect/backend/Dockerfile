# Multi-stage production container build for DAM3 Backend
FROM golang:1.24-alpine AS builder

WORKDIR /app
RUN apk add --no-cache build-base

COPY go.mod go.sum* ./
RUN go mod download || true

COPY . .
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -o dam3-backend main.go

FROM alpine:3.20

WORKDIR /app
RUN apk add --no-cache ca-certificates sqlite-libs tzdata
ENV TZ=Europe/Bucharest

COPY --from=builder /app/dam3-backend /app/dam3-backend
COPY litestream.yml /etc/litestream.yml

EXPOSE 8080
VOLUME ["/data"]

CMD ["/app/dam3-backend"]
