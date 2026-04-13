# Database Testing - Quick Reference

## What You Need to Do

Since you mentioned you added the correct PostgreSQL credentials, here's what to do:

### 1. Verify .env File Exists

```bash
ls -la apps/backend/.env
```

If it doesn't exist:
```bash
cp apps/backend/.env.example apps/backend/.env
# Then edit with your credentials
```

### 2. Run the Test

```bash
make test-db
```

This will:
- ✅ Load your credentials from `.env`
- ✅ Test PostgreSQL connection
- ✅ Check if database exists
- ✅ List existing tables
- ✅ Verify everything is ready for Docker

### 3. Expected Output

**If successful:**
```
✅ All tests passed!
✅ Database connection is working correctly
✅ Ready to rebuild Docker containers

💡 Next steps:
   1. Run: make docker-rebuild
   2. Or: docker compose up -d --build
```

**If failed:**
```
❌ Connection failed!
Error: [specific error message]

💡 Troubleshooting:
   [specific fixes for your error]
```

### 4. Rebuild Docker (if tests pass)

```bash
make docker-rebuild
```

## Quick Commands

```bash
# Test database connection
make test-db

# If tests pass, rebuild Docker
make docker-rebuild

# View logs after rebuild
make docker-logs

# Check running containers
docker ps
```

## Common Issues & Fixes

### Issue: .env file not found
```bash
cp apps/backend/.env.example apps/backend/.env
nano apps/backend/.env  # Edit with your credentials
```

### Issue: Connection refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Or start Docker PostgreSQL
docker compose up -d postgres
```

### Issue: Wrong credentials
```bash
# Edit .env file
nano apps/backend/.env

# Update these lines:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=adryx
```

### Issue: Database doesn't exist
```bash
# Create it manually
sudo -u postgres createdb adryx

# Or let TypeORM create it automatically (it will)
```

## What the Test Script Does

1. **Loads Environment** - Reads `apps/backend/.env`
2. **Tests Connection** - Connects to PostgreSQL
3. **Checks Database** - Verifies database exists
4. **Lists Tables** - Shows existing tables (if any)
5. **Tests Docker DB** - Checks if Docker PostgreSQL is running
6. **Provides Guidance** - Tells you what to do next

## Files Created

- `scripts/test-db-connection.js` - Node.js test script (main)
- `scripts/test-db.sh` - Bash test script (alternative)
- `scripts/setup-env.sh` - Environment setup helper
- `scripts/README.md` - Detailed documentation
- `DATABASE_SETUP.md` - Complete setup guide

## Integration with Workflow

```bash
# Complete workflow
make test-db              # Test database
make docker-rebuild       # Rebuild if tests pass
make docker-logs          # Check logs
```

## Need Help?

1. Check `DATABASE_SETUP.md` for detailed setup instructions
2. Check `scripts/README.md` for test script documentation
3. Run `make help` to see all available commands

## Your Next Step

Since you mentioned you added the correct PostgreSQL credentials:

```bash
# Run this now:
make test-db
```

If it passes, you're ready to rebuild Docker! 🚀
