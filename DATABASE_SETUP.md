# Database Setup & Testing Guide

This guide helps you set up and test your PostgreSQL connection before deploying to Docker.

## Quick Start

```bash
# 1. Setup environment (if .env doesn't exist)
bash scripts/setup-env.sh

# 2. Edit .env with your PostgreSQL credentials
nano apps/backend/.env

# 3. Test the connection
make test-db

# 4. If tests pass, rebuild Docker
make docker-rebuild
```

## Step-by-Step Setup

### 1. Create Environment File

If you haven't created a `.env` file yet:

```bash
# Copy from example
cp apps/backend/.env.example apps/backend/.env

# Or use the setup script
bash scripts/setup-env.sh
```

### 2. Configure Database Credentials

Edit `apps/backend/.env` with your PostgreSQL credentials:

```env
# Database Configuration
DB_HOST=localhost          # Your PostgreSQL host
DB_PORT=5432              # Your PostgreSQL port
DB_DATABASE=adryx         # Database name
DB_USERNAME=your_username # Your PostgreSQL username
DB_PASSWORD=your_password # Your PostgreSQL password
```

**Common Configurations:**

#### Local PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=adryx
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

#### Docker PostgreSQL (from host)
```env
DB_HOST=localhost
DB_PORT=5433
DB_DATABASE=adryx
DB_USERNAME=adryx
DB_PASSWORD=adryx_password
```

#### Remote PostgreSQL
```env
DB_HOST=your-server.com
DB_PORT=5432
DB_DATABASE=adryx
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Test Database Connection

Run the test script to verify your configuration:

```bash
# Using Make (recommended)
make test-db

# Or directly with Node.js
node scripts/test-db-connection.js

# Or with bash (requires psql)
bash scripts/test-db.sh
```

### 4. Interpret Test Results

#### ✅ Success
```
✅ All tests passed!
✅ Database connection is working correctly
✅ Ready to rebuild Docker containers
```

**Next steps:**
```bash
make docker-rebuild
```

#### ❌ Connection Failed
```
❌ Connection failed!
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Troubleshooting:**
1. Check if PostgreSQL is running
2. Verify credentials in `.env`
3. Check firewall settings
4. Ensure database exists

#### ⚠️ Database Doesn't Exist
```
⚠️ Database 'adryx' does not exist
💡 It will be created automatically by TypeORM
```

**This is OK!** TypeORM will create the database automatically when you start the backend.

## Database Setup Options

### Option 1: Use Existing PostgreSQL

If you have PostgreSQL installed locally:

1. **Create database:**
   ```bash
   sudo -u postgres createdb adryx
   ```

2. **Create user (if needed):**
   ```bash
   sudo -u postgres createuser -P your_username
   ```

3. **Grant permissions:**
   ```bash
   sudo -u postgres psql
   GRANT ALL PRIVILEGES ON DATABASE adryx TO your_username;
   \q
   ```

4. **Update .env and test:**
   ```bash
   nano apps/backend/.env
   make test-db
   ```

### Option 2: Use Docker PostgreSQL

Use the PostgreSQL container from docker-compose:

1. **Start only PostgreSQL:**
   ```bash
   docker compose up -d postgres
   ```

2. **Update .env:**
   ```env
   DB_HOST=localhost
   DB_PORT=5433
   DB_DATABASE=adryx
   DB_USERNAME=adryx
   DB_PASSWORD=adryx_password
   ```

3. **Test connection:**
   ```bash
   make test-db
   ```

### Option 3: Use Cloud PostgreSQL

For services like AWS RDS, Azure Database, or DigitalOcean:

1. **Get connection details from your provider**

2. **Update .env:**
   ```env
   DB_HOST=your-instance.region.rds.amazonaws.com
   DB_PORT=5432
   DB_DATABASE=adryx
   DB_USERNAME=admin
   DB_PASSWORD=your_secure_password
   ```

3. **Ensure your IP is whitelisted**

4. **Test connection:**
   ```bash
   make test-db
   ```

## Troubleshooting

### Error: ECONNREFUSED

**Cause:** PostgreSQL is not running or wrong host/port

**Fix:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Or start Docker PostgreSQL
docker compose up -d postgres
```

### Error: Authentication Failed (28P01)

**Cause:** Wrong username or password

**Fix:**
1. Double-check credentials in `.env`
2. Verify user exists in PostgreSQL:
   ```bash
   sudo -u postgres psql -c "\du"
   ```
3. Reset password if needed:
   ```bash
   sudo -u postgres psql
   ALTER USER your_username WITH PASSWORD 'new_password';
   ```

### Error: Database Does Not Exist (3D000)

**Cause:** Database hasn't been created

**Fix:**
```bash
# Create database
sudo -u postgres createdb adryx

# Or let TypeORM create it (set synchronize: true in app.module.ts)
```

### Error: pg Module Not Found

**Cause:** Dependencies not installed

**Fix:**
```bash
cd apps/backend
pnpm install
```

### Error: Permission Denied

**Cause:** User doesn't have access to database

**Fix:**
```bash
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE adryx TO your_username;
\q
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | Yes |
| `PORT` | Backend port | `3000` | Yes |
| `DB_HOST` | PostgreSQL host | `localhost` | Yes |
| `DB_PORT` | PostgreSQL port | `5432` | Yes |
| `DB_DATABASE` | Database name | `adryx` | Yes |
| `DB_USERNAME` | Database user | `postgres` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT signing key | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | Yes |
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` | Yes |

## Docker Integration

### Testing Before Docker Build

Always test your database connection before rebuilding Docker:

```bash
# Test connection
make test-db

# If successful, rebuild
make docker-rebuild
```

### Docker Environment Variables

The docker-compose.yml uses these environment variables for the backend:

```yaml
environment:
  NODE_ENV: production
  PORT: 3000
  DB_HOST: postgres          # Docker service name
  DB_PORT: 5432             # Internal Docker port
  DB_DATABASE: adryx
  DB_USERNAME: adryx
  DB_PASSWORD: adryx_password
```

Note: Inside Docker, the backend connects to `postgres:5432` (internal network), but from your host machine, you connect to `localhost:5433`.

## Best Practices

1. **Never commit .env files** - They contain sensitive credentials
2. **Use strong passwords** - Especially for production
3. **Test before deploying** - Always run `make test-db` first
4. **Keep backups** - Use `make backup-db` regularly
5. **Use environment-specific configs** - Different .env for dev/staging/prod

## Next Steps

After successful database setup:

1. ✅ Test connection: `make test-db`
2. ✅ Rebuild Docker: `make docker-rebuild`
3. ✅ Check logs: `make docker-logs`
4. ✅ Access API: http://localhost:3001/api/docs
5. ✅ Access Frontend: http://localhost:3000

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Database Documentation](https://docs.nestjs.com/techniques/database)
