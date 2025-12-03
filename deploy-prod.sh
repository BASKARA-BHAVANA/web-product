#!/bin/bash

echo "Starting production deployment..."

echo "Stopping existing containers..."
docker compose -f docker-compose.prod.yml down


echo "Building and starting production containers..."
docker compose -f docker-compose.prod.yml --env-file .env.production.server up -d --build

echo "Waiting for database to be ready..."
sleep 30

echo "Checking migration status..."
MIGRATION_OUTPUT=$(docker compose -f docker-compose.prod.yml exec -T web npx prisma migrate deploy 2>&1)
MIGRATION_EXIT_CODE=$?

if [ $MIGRATION_EXIT_CODE -ne 0 ]; then
    if echo "$MIGRATION_OUTPUT" | grep -q "P3009"; then
        echo "Failed migration detected (P3009)"
        echo "Attempting to resolve automatically..."
        
        # Run the resolve script
        if [ -f "./resolve-migration.sh" ]; then
            chmod +x ./resolve-migration.sh
            ./resolve-migration.sh
        else
            echo "Error: resolve-migration.sh not found"
            echo "Please run: chmod +x resolve-migration.sh && ./resolve-migration.sh"
            exit 1
        fi
    else
        echo "Migration failed with error:"
        echo "$MIGRATION_OUTPUT"
        exit 1
    fi
else
    echo "✓ Migrations applied successfully"
fi

echo "Checking container status..."
docker compose -f docker-compose.prod.yml ps

echo "Production deployment completed!"
echo "Application will be available at: http://194.233.91.96:3212"
echo "Database will be available at: 194.233.91.96:3213"
echo ""
echo "Container Names:"
echo "  Web App: himatif-web-prod"
echo "  Database: himatif-db-prod"

