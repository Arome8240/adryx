# Database Migrations - Quick Start

## TL;DR

```bash
# Generate migration (compares entities with DB)
make migration-generate

# Run migrations
make migration-run

# Rollback if needed
make migration-revert
```

## Your Current Setup

✅ **Entities Defined**: User, Site, Campaign, Placement, Interaction  
✅ **Database Connected**: PostgreSQL on localhost:5432  
✅ **Auto-sync Enabled**: Tables created automatically in development  
⚠️ **No Migrations Yet**: Need to generate initial migration  

## Two Approaches

### Approach 1: Keep Using Auto-Sync (Current)

**Pros:**
- ✅ Fast development
- ✅ No migration management
- ✅ Tables auto-created

**Cons:**
- ❌ Not safe for production
- ❌ No version control
- ❌ Can't rollback changes

**When to use:** Rapid prototyping, early development

### Approach 2: Use Migrations (Recommended)

**Pros:**
- ✅ Production-safe
- ✅ Version controlled
- ✅ Can rollback
- ✅ Team collaboration

**Cons:**
- ❌ Extra step for changes
- ❌ Need to manage files

**When to use:** Production, team projects, stable features

## Getting Started with Migrations

### Step 1: Generate Initial Migration

This creates a migration with all your current entities:

```bash
make migration-generate
# Enter name: InitialSchema
```

This will create: `apps/backend/src/migrations/1234567890-InitialSchema.ts`

### Step 2: Review the Migration

```bash
# Check what SQL will be executed
cat apps/backend/src/migrations/*-InitialSchema.ts
```

You'll see SQL for creating all tables:
- users
- sites
- campaigns
- placements
- interactions

### Step 3: Run the Migration

```bash
make migration-run
```

Output:
```
Migration InitialSchema1234567890 has been executed successfully.
```

### Step 4: Verify

```bash
# Check database
make shell-db
\dt  # List tables
\d users  # Describe users table
```

## Common Workflows

### Adding a New Field

1. **Update Entity**
   ```typescript
   // apps/backend/src/entities/user.entity.ts
   @Column({ nullable: true })
   phoneNumber: string;
   ```

2. **Generate Migration**
   ```bash
   make migration-generate
   # Name: AddPhoneToUser
   ```

3. **Run Migration**
   ```bash
   make migration-run
   ```

### Rollback Last Change

```bash
make migration-revert
```

### Run Migrations in Docker

After deploying:

```bash
make migration-docker
```

## Commands Reference

```bash
# Generate new migration
make migration-generate

# Run pending migrations
make migration-run

# Rollback last migration
make migration-revert

# Run migrations in Docker
make migration-docker

# Test database connection
make test-db

# Access database shell
make shell-db

# View all commands
make help
```

## What Happens When?

### Development (NODE_ENV=development)

- `synchronize: true` - Tables auto-created/updated
- Migrations optional but recommended
- Fast iteration

### Production (NODE_ENV=production)

- `synchronize: false` - No auto-sync
- Migrations required
- Safe and controlled

## Current Status

Since you just set up the database:

1. ✅ Database exists and is connected
2. ⚠️ No tables yet (or auto-created by synchronize)
3. ⚠️ No migrations generated

## Recommended Next Steps

### Option A: Start with Migrations (Recommended)

```bash
# 1. Generate initial schema
make migration-generate
# Name: InitialSchema

# 2. Run it
make migration-run

# 3. Verify
make shell-db
\dt
```

### Option B: Keep Auto-Sync for Now

```bash
# Just start the backend
cd apps/backend
pnpm start:dev

# Tables will be created automatically
# Generate migrations later when ready
```

## When to Generate Migrations

Generate a migration whenever you:
- ✅ Add/remove entity fields
- ✅ Change column types
- ✅ Add/remove entities
- ✅ Add indexes
- ✅ Add constraints
- ✅ Seed data

## Migration Files Location

```
apps/backend/src/migrations/
├── 1234567890-InitialSchema.ts
├── 1234567891-AddPhoneToUser.ts
└── 1234567892-AddIndexes.ts
```

## Troubleshooting

### "No changes in database schema"

Database already matches entities. Either:
- Tables were auto-created by synchronize
- Migration already applied

### "Cannot find module"

Build first:
```bash
cd apps/backend
pnpm build
pnpm migration:run
```

### "Connection refused"

Test connection:
```bash
make test-db
```

## Need More Details?

Read the complete guide:
```bash
cat MIGRATIONS_GUIDE.md
```

Or check package.json scripts:
```bash
cat apps/backend/package.json | grep migration
```

---

## Quick Decision Tree

**Are you in early development?**
- Yes → Keep auto-sync, generate migrations later
- No → Generate migrations now

**Do you have a team?**
- Yes → Use migrations for collaboration
- No → Auto-sync is fine for solo dev

**Going to production soon?**
- Yes → Generate migrations now
- No → Can wait

**Want version control for schema?**
- Yes → Use migrations
- No → Auto-sync is simpler

---

## Your Next Command

Based on your setup, run this:

```bash
# Generate your first migration
make migration-generate
```

Then enter a name like: `InitialSchema`

That's it! 🚀
