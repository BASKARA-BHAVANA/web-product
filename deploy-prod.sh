#!/bin/bash

echo "Starting production deployment..."

echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down


echo "Building and starting production containers..."
docker compose -f docker-compose.prod.yml --env-file .env.production.server up -d --build

echo "Waiting for database to be ready..."
sleep 30

echo "Running database migrations..."
docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy

echo "Checking container status..."
docker compose -f docker-compose.prod.yml ps

echo "Production deployment completed!"
echo "Application will be available at: http://194.233.91.96:3212"
echo "Database will be available at: 194.233.91.96:3213"
echo ""
echo "Container Names:"
echo "  Web App: himatif-web-prod"
echo "  Database: himatif-db-prod"

