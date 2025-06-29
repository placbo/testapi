#!/bin/bash

# PostgreSQL Database Backup Script
# This script creates a backup of the PostgreSQL database from the Docker container

set -e  # Exit on any error

# Configuration
CONTAINER_NAME="pg-docker"
DB_NAME="mydb"
DB_USER="postgres"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${DB_NAME}_${TIMESTAMP}.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if container exists and is running
if ! docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    print_error "Container '${CONTAINER_NAME}' is not running."
    print_info "Starting the container with docker-compose..."
    
    if ! docker-compose up -d db; then
        print_error "Failed to start the database container."
        exit 1
    fi
    
    print_info "Waiting for database to be ready..."
    sleep 10
fi

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    print_info "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Create the backup
print_info "Creating backup of database '$DB_NAME'..."
print_info "Backup file: $BACKUP_DIR/$BACKUP_FILE"

if docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists > "$BACKUP_DIR/$BACKUP_FILE"; then
    print_info "Backup completed successfully!"
    print_info "Backup saved to: $BACKUP_DIR/$BACKUP_FILE"
    
    # Show file size
    file_size=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    print_info "Backup file size: $file_size"
    
    # Optionally compress the backup
    read -p "Do you want to compress the backup? (y/N): " compress_choice
    if [[ $compress_choice =~ ^[Yy]$ ]]; then
        print_info "Compressing backup..."
        gzip "$BACKUP_DIR/$BACKUP_FILE"
        print_info "Compressed backup saved as: $BACKUP_DIR/$BACKUP_FILE.gz"
        compressed_size=$(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1)
        print_info "Compressed file size: $compressed_size"
    fi
    
else
    print_error "Backup failed!"
    exit 1
fi

# Clean up old backups (keep last 10)
print_info "Cleaning up old backups (keeping last 10)..."
cd "$BACKUP_DIR"
ls -t backup_${DB_NAME}_*.sql* 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
cd - >/dev/null

print_info "Backup process completed!"

# Show recent backups
print_info "Recent backups:"
ls -lht "$BACKUP_DIR"/backup_${DB_NAME}_*.sql* 2>/dev/null | head -5 || print_warning "No previous backups found."
