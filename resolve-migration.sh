#!/bin/bash

echo "Checking migration status..."

# Check if containers are running
if ! docker compose -f docker-compose.prod.yml ps | grep -q "himatif-web-prod.*Up"; then
    echo "Error: Web container is not running. Please start containers first."
    exit 1
fi

# Check migration status
MIGRATION_STATUS=$(docker compose -f docker-compose.prod.yml exec -T web npx prisma migrate status 2>&1)

if echo "$MIGRATION_STATUS" | grep -q "Database schema is in sync"; then
    echo "Database schema is already in sync. No action needed."
    exit 0
fi

if echo "$MIGRATION_STATUS" | grep -q "P3009"; then
    echo "Failed migration detected (P3009)"
    echo ""
    echo "Attempting to resolve failed migration..."
    echo ""
    
    # Try to extract migration name from error message
    # Error format: "The `20251125154749_init` migration started at ... failed"
    FAILED_MIGRATION=$(echo "$MIGRATION_STATUS" | grep -oP '`\K[^`]+' | head -1)
    
    # If extraction failed, query database for failed migrations
    if [ -z "$FAILED_MIGRATION" ]; then
        FAILED_MIGRATION=$(docker compose -f docker-compose.prod.yml exec -T db psql -U app -d db_uin_himatif -t -c "SELECT migration_name FROM \"_prisma_migrations\" WHERE finished_at IS NULL ORDER BY started_at DESC LIMIT 1;" 2>/dev/null | tr -d '[:space:]')
    fi
    
    # Fallback to known migration name
    if [ -z "$FAILED_MIGRATION" ]; then
        FAILED_MIGRATION="20251125154749_init"
        echo "⚠ Could not detect migration name, using default: $FAILED_MIGRATION"
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
            echo "Retrying migration deploy..."
            docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
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
            echo "Retrying migration deploy..."
            docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
        else
            echo "Failed to update migration status"
            exit 1
        fi
    fi
else
    echo "Migration status:"
    echo "$MIGRATION_STATUS"
    echo ""
    echo "No P3009 error detected. Running normal migration deploy..."
    docker compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
fi

