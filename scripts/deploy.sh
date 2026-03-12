#!/bin/bash
set -e
echo "Pulling latest..."
git pull origin main

echo "Building..."
docker compose build --no-cache

echo "Running migrations..."
docker compose run --rm app npx prisma migrate deploy

echo "Starting..."
docker compose up -d

echo "Deploy complete. App running on port 3001."
