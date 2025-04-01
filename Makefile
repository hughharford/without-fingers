.PHONY: all build run test clean

# Default target
all: build run

# Build the Docker image
build:
	docker build -t without-fingers:test .

# Run both Electron app and Docker container
run: build
	npm start

# Run tests
test:
	poetry run pytest

# Clean up
clean:
	docker rmi without-fingers:test || true
	rm -rf node_modules || true 