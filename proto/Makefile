# Makefile for buf proto management
.PHONY: help lint format generate breaking build clean install-buf

# Default target
help:
	@echo "Available buf commands:"
	@echo "  make install-buf  - Install buf CLI tool"
	@echo "  make lint         - Lint proto files"
	@echo "  make format       - Format proto files"
	@echo "  make generate     - Generate code from proto files"
	@echo "  make breaking     - Check for breaking changes"
	@echo "  make build        - Build proto files"
	@echo "  make clean        - Clean generated files"

# Install buf if not already installed
install-buf:
	@command -v buf >/dev/null 2>&1 || { \
		echo "Installing buf..."; \
		curl -sSL https://github.com/bufbuild/buf/releases/latest/download/buf-$(shell uname -s)-$(shell uname -m) -o /tmp/buf && \
		chmod +x /tmp/buf && \
		sudo mv /tmp/buf /usr/local/bin/buf; \
	}
	@echo "buf version: $$(buf --version)"

# Lint proto files
lint:
	@echo "Linting proto files..."
	@cd .. && buf lint proto

# Format proto files
format:
	@echo "Formatting proto files..."
	@cd .. && buf format -w proto

# Generate code from proto files
generate:
	@echo "Generating code from proto files..."
	@cd .. && buf generate proto

# Check for breaking changes (requires git)
breaking:
	@echo "Checking for breaking changes..."
	@cd .. && buf breaking proto --against '.git#branch=main'

# Build proto files (compile check)
build:
	@echo "Building proto files..."
	@cd .. && buf build proto

# Clean generated files
clean:
	@echo "Cleaning generated files..."
	@find . -name "*.pb.go" -delete
	@find . -name "*_pb2.py" -delete
	@find . -name "*.pb.js" -delete
	@find . -name "*.pb.ts" -delete
