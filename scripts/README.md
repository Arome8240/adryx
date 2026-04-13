# Database Test Scripts

These scripts help you verify your PostgreSQL connection before rebuilding Docker containers.

## Quick Start

```bash
# Using Make (recommended)
make test-db

# Or run directly
node scripts/test-db-connection.js

# Or use bash version (requires psql)
bash scripts/test-db.sh
```

## What Gets Tested

1. ✅ **Environment Variables** - Loads and validates `.env` file
2. ✅ **Connection** - Tests PostgreSQL connectivity
3. ✅ **Database Existence** - Checks if the database exists
4. ✅ **Tables** - Lists existing tables (if any)
5. ✅ **Docker PostgreSQL** - Tests if Docker DB is running (optional)

## Prerequisites

### For Node.js Script (test-db-connection.js)
- Node.js installed
- `pg` package (install with: `cd apps/backend && pnpm install`)

### For Bash Script (test-db.sh)
- `psql` command-line tool installed
- PostgreSQL client libraries

## Setup

1. **Create .env file:**
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

2. **Update credentials in .env:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=adryx
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

3. **Run the test:**
   ```bash
   make test-db
   ```

## Expected Output

### Success ✅
```
═══════════════════════════════════════════════
  PostgreSQL Connection Test
═══════════════════════════════════════════════

📁 Loading environment variables...
✅ Environment variables loaded

📝 Connection Configuration:
   Host:     localhost
   Port:     5432
   Database: adryx
   User:     postgres
   Password: ********

🔌 Attempting to connect to PostgreSQL...
✅ Successfully connected to PostgreSQL!

📊 Running test query...
✅ PostgreSQL Version: PostgreSQL 16.x on x86_64-pc-linux-gnu

🗄️  Checking database...
✅ Database 'adryx' exists

📋 Checking for existing tables...
✅ Found 5 existing tables:
   - users
   - sites
   - campaigns
   - placements
   - interactions

═══════════════════════════════════════════════
  Test Summary
═══════════════════════════════════════════════

✅ All tests passed!
✅ Database connection is working correctly
✅ Ready to rebuild Docker containers

💡 Next steps:
   1. Run: make docker-rebuild
   2. Or: docker compose up -d --build
```

### Failure ❌
```
❌ Connection failed!
Error: connect ECONNREFUSED 127.0.0.1:5432

💡 Troubleshooting:
   1. Make sure PostgreSQL is running
   2. Check if the host and port are correct
   3. Verify firewall settings
```

## Troubleshooting

### Error: .env file not found
```bash
# Create from example
cp apps/backend/.env.example apps/backend/.env
# Then edit with your credentials
```

### Error: ECONNREFUSED
- PostgreSQL is not running
- Wrong host or port
- Firewall blocking connection

**Fix:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Or use Docker PostgreSQL
docker compose up -d postgres
```

### Error: Authentication failed (28P01)
- Wrong username or password
- User doesn't have access

**Fix:**
```bash
# Update .env with correct credentials
# Or create a new PostgreSQL user
sudo -u postgres createuser -P your_username
```

### Error: Database does not exist (3D000)
- Database hasn't been created yet

**Fix:**
```bash
# Create database manually
sudo -u postgres createdb adryx

# Or let TypeORM create it (set synchronize: true)
```

### Error: pg module not found
```bash
# Install dependencies
cd apps/backend
pnpm install
```

## Environment Variables

The script reads these variables from `apps/backend/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_DATABASE` | Database name | `adryx` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |

## Docker vs Local PostgreSQL

### Testing Local PostgreSQL
- Uses credentials from `.env`
- Typically on port `5432`
- For development outside Docker

### Testing Docker PostgreSQL
- Uses Docker credentials
- On port `5433` (mapped from 5432)
- Automatically tested if running

## Integration with Makefile

The test is integrated into the Makefile:

```bash
# Test database connection
make test-db

# Test, then rebuild if successful
make test-db && make docker-rebuild
```

## CI/CD Integration

You can use this in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Test Database Connection
  run: make test-db
  
- name: Build Docker if tests pass
  run: make docker-rebuild
```

## Exit Codes

- `0` - All tests passed
- `1` - Tests failed or error occurred

Use in scripts:
```bash
if make test-db; then
    echo "Tests passed, rebuilding..."
    make docker-rebuild
else
    echo "Tests failed, fix database connection first"
    exit 1
fi
```
