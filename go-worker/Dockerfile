# Stage 1: Build
FROM golang:1.20-alpine AS build
WORKDIR /app
COPY go.mod ./
# Copy required packages
RUN go mod tidy
COPY . .
# Compile tĩnh
RUN CGO_ENABLED=0 GOOS=linux go build -o go_worker main.go

# Stage 2: Deploy mini
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/go_worker .
CMD ["./go_worker"]
