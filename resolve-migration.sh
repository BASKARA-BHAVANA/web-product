#!/bin/bash

echo "Checking migration status..."
echo ""

# Check if database container is running (required)
# Use docker ps directly for more reliable checking
if ! docker ps --filter "name=himatif-db-prod" --filter "status=running" --format "{{.Names}}" | grep -q "himatif-db-prod"; then
    echo "Error: Database container is not running. Please start containers first."
    echo "Run: docker compose -f docker-compose.prod.yml up -d db"
    exit 1
fi

# Check if web container is running
WEB_CONTAINER_RUNNING=false
if docker ps --filter "name=himatif-web-prod" --filter "status=running" --format "{{.Names}}" | grep -q "himatif-web-prod"; then
    WEB_CONTAINER_RUNNING=true
    echo "Web container is running. Checking migration status via Prisma..."
    MIGRATION_STATUS=$(docker compose -f docker-compose.prod.yml exec -T web npx prisma migrate status 2>&1)
else
    echo "Web container is not running. Checking migration state directly in database..."
    echo "This is normal if migrations failed and prevented the container from starting."
    echo ""
    MIGRATION_STATUS=""
fi

# Check for failed migrations directly in database
FAILED_MIGRATIONS=$(docker compose -f docker-compose.prod.yml exec -T db psql -U app -d db_uin_himatif -t -c "SELECT migration_name FROM \"_prisma_migrations\" WHERE finished_at IS NULL ORDER BY started_at DESC LIMIT 1;" 2>/dev/null | tr -d '[:space:]')

if [ -z "$FAILED_MIGRATIONS" ] && [ "$WEB_CONTAINER_RUNNING" = true ]; then
    if echo "$MIGRATION_STATUS" | grep -q "Database schema is in sync"; then
        echo "Database schema is already in sync. No action needed."
        exit 0
    fi
fi

# Check if we have a failed migration (either from Prisma status or database query)
if [ -n "$FAILED_MIGRATIONS" ] || ([ "$WEB_CONTAINER_RUNNING" = true ] && echo "$MIGRATION_STATUS" | grep -q "P3009"); then
    echo "Failed migration detected (P3009)"
    echo ""
    echo "Attempting to resolve failed migration..."
    echo ""
    
    # Get failed migration name from database (most reliable method)
    FAILED_MIGRATION="$FAILED_MIGRATIONS"
    
    # If not found in database, try to extract from Prisma error message
    if [ -z "$FAILED_MIGRATION" ] && [ "$WEB_CONTAINER_RUNNING" = true ]; then
        FAILED_MIGRATION=$(echo "$MIGRATION_STATUS" | grep -oP '`\K[^`]+' | head -1)
    fi
    
    # Fallback to known migration name
    if [ -z "$FAILED_MIGRATION" ]; then
        FAILED_MIGRATION="20251125154749_init"
        echo "Could not detect migration name, using default: $FAILED_MIGRATION"
    fi
    
    echo "Failed migration: $FAILED_MIGRATION"
    echo ""
    echo "Checking if migration actually succeeded (tables exist)..."
    
    TABLE_CHECK=$(docker compose -f docker-compose.prod.yml exec -T db psql -U app -d db_uin_himatif -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'accounts', 'sessions');" 2>&1 | tr -d '[:space:]')
    
    if [ "$TABLE_CHECK" -gt "0" ]; then
        echo "Tables exist - migration likely succeeded but was marked as failed"
        echo "Marking migration as applied..."
        
        docker compose -f docker-compose.prod.yml exec -T db psql -U app -d db_uin_himatif <<EOF
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(), 
    "applied_steps_count" = 1
WHERE "migration_name" = '$FAILED_MIGRATION' 
  AND "finished_at" IS NULL;
EOF
        
        if [ $? -eq 0 ]; then
            echo "Migration marked as applied"
            echo ""
            if [ "$WEB_CONTAINER_RUNNING" = true ]; then
                echo "Retrying migration deploy..."
                docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
            else
                echo "Migration state fixed. You can now start the web container:"
                echo "  docker compose -f docker-compose.prod.yml up -d web"
                echo "  docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy"
            fi
        else
            echo "Failed to update migration status"
            exit 1
        fi
    else
        echo "Tables don't exist - migration actually failed"
        echo ""
        echo "Marking migration as rolled back..."
        
        # Mark migration as rolled back
        docker compose -f docker-compose.prod.yml exec -T db psql -U app -d db_uin_himatif <<EOF
UPDATE "_prisma_migrations" 
SET "finished_at" = NOW(), 
    "rolled_back_at" = NOW(),
    "applied_steps_count" = 0
WHERE "migration_name" = '$FAILED_MIGRATION' 
  AND "finished_at" IS NULL;
EOF
        
        if [ $? -eq 0 ]; then
            echo "Migration marked as rolled back"
            echo ""
            if [ "$WEB_CONTAINER_RUNNING" = true ]; then
                echo "Retrying migration deploy..."
                docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
            else
                echo "Migration state fixed. You can now start the web container:"
                echo "  docker compose -f docker-compose.prod.yml up -d web"
                echo "  docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy"
            fi
        else
            echo "Failed to update migration status"
            exit 1
        fi
    fi
else
    if [ "$WEB_CONTAINER_RUNNING" = true ]; then
        echo "Migration status:"
        echo "$MIGRATION_STATUS"
        echo ""
        echo "No P3009 error detected. Running normal migration deploy..."
        docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
    else
        echo "No failed migrations found in database."
        echo "You can start the web container:"
        echo "  docker compose -f docker-compose.prod.yml up -d web"
    fi
fi

