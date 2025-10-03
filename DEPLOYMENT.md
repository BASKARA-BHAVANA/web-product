# Deployment Guide

This project has two different Docker configurations for different environments:

## 🏠 Development Environment (Local)

**File:** `docker-compose.yml` (default)
- **Application Port:** 3000
- **Database Port:** 5432
- **Environment:** `.env.production` (local development)

### Usage:
```bash
# Start development environment
docker-compose up -d

# Stop development environment
docker-compose down
```

## 🚀 Production Environment (Server: 194.233.91.96)

**File:** `docker-compose.prod.yml`
- **Application Port:** 3212 (external) → 3000 (internal)
- **Database Port:** 3213 (external) → 5432 (internal)
- **Environment:** `.env.production.server`

### Usage:

#### Option 1: Using the deployment script (Recommended)
```bash
./deploy-prod.sh
```

#### Option 2: Manual deployment
```bash
# Stop existing containers
docker-compose -f docker-compose.prod.yml down

# Build and start production containers
docker-compose -f docker-compose.prod.yml --env-file .env.production.server up -d --build

# Run database migrations
docker-compose -f docker-compose.prod.yml exec web npx prisma migrate deploy
```

## 📋 Environment Files

- **`.env.production`** - Local development environment
- **`.env.production.server`** - Production server environment (194.233.91.96)

## 🔧 Production Server Configuration

### Server Details:
- **IP:** 194.233.91.96
- **Application URL:** http://194.233.91.96:3212
- **Database Port:** 194.233.91.96:3213

### Important Notes:
1. **Firewall:** Ensure ports 3212 and 3213 are open on your server
2. **SSL:** Consider setting up SSL/TLS for production
3. **Domain:** You can configure a domain name to point to your server
4. **Backups:** Set up regular database backups

## 🛠️ Useful Commands

### Development:
```bash
# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Access database
docker-compose exec db psql -U app -d db_uin_himatif
```

### Production:
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Access database
docker-compose -f docker-compose.prod.yml exec db psql -U app -d db_uin_himatif

# Stop production
docker-compose -f docker-compose.prod.yml down
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use strong NEXTAUTH_SECRET**
3. **Configure proper Google OAuth credentials**
4. **Set up SSL/TLS certificates**
5. **Regular security updates**
