# Database Migrations Guide

Complete guide for managing database migrations with TypeORM in Adryx.

## Quick Start

```bash
# 1. Generate a migration (compares entities with database)
make migration-generate
# Enter migration name when prompted (e.g., "InitialSchema")

# 2. Run migrations
make migration-run

# 3. If needed, revert last migration
make migration-revert
```

## Understanding Migrations

### What are Migrations?

Migrations are version control for your database schema. They allow you to:
- Track database changes over time
- Apply schema changes consistently across environments
- Rollback changes if needed
- Collaborate with team members safely

### Synchronize vs Migrations

**Synchronize (Current Setup):**
- Enabled in development: `synchronize: true`
- Automatically updates database schema
- Good for rapid development
- ⚠️ Dangerous in production (can lose data)

**Migrations (Recommended for Production):**
- Explicit, versioned schema changes
- Safe for production
- Allows review before applying
- Can be rolled back

## Migration Commands

### 1. Generate Migration

Creates a new migration by comparing your entities with the current database schema.

```bash
# Using Make
make migration-generate
# Enter name: InitialSchema

# Or directly
cd apps/backend
pnpm migration:generate src/migrations/InitialSchema
```

**What it does:**
- Compares entity definitions with database
- Generates SQL for changes
- Creates timestamped migration file

**Example output:**
```
Migration /path/to/migrations/1234567890-InitialSchema.ts has been generated successfully.
```

### 2. Run Migrations

Applies all pending migrations to the database.

```bash
# Using Make
make migration-run

# Or directly
cd apps/backend
pnpm migration:run
```

**What it does:**
- Checks which migrations haven't been run
- Executes them in order
- Records them in `migrations` table

**Example output:**
```
query: SELECT * FROM "migrations" "migrations"
query: BEGIN TRANSACTION
query: CREATE TABLE "users" (...)
query: INSERT INTO "migrations"("timestamp", "name") VALUES (...)
query: COMMIT
Migration InitialSchema1234567890 has been executed successfully.
```

### 3. Revert Migration

Rolls back the last applied migration.

```bash
# Using Make
make migration-revert

# Or directly
cd apps/backend
pnpm migration:revert
```

**What it does:**
- Runs the `down` method of last migration
- Removes entry from `migrations` table
- Reverts database changes

### 4. Run Migrations in Docker

Applies migrations inside the Docker container.

```bash
make migration-docker
```

**When to use:**
- After deploying new code to Docker
- When database is only accessible from container
- For production deployments

## Migration Workflow

### Development Workflow

1. **Create/Modify Entities**
   ```typescript
   // apps/backend/src/entities/user.entity.ts
   @Entity('users')
   export class User {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column()
     email: string;
     
     // Add new field
     @Column({ nullable: true })
     phoneNumber: string;
   }
   ```

2. **Generate Migration**
   ```bash
   make migration-generate
   # Name: AddPhoneNumberToUser
   ```

3. **Review Generated Migration**
   ```typescript
   // apps/backend/src/migrations/1234567890-AddPhoneNumberToUser.ts
   export class AddPhoneNumberToUser1234567890 implements MigrationInterface {
     public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(
         `ALTER TABLE "users" ADD "phoneNumber" varchar`
       );
     }
     
     public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(
         `ALTER TABLE "users" DROP COLUMN "phoneNumber"`
       );
     }
   }
   ```

4. **Run Migration**
   ```bash
   make migration-run
   ```

5. **Test Changes**
   ```bash
   # Start backend and test
   cd apps/backend
   pnpm start:dev
   ```

### Production Workflow

1. **Test Migrations Locally**
   ```bash
   # Generate and test
   make migration-generate
   make migration-run
   
   # Test application
   make test
   ```

2. **Commit Migration Files**
   ```bash
   git add apps/backend/src/migrations/
   git commit -m "Add phone number to users"
   ```

3. **Deploy to Production**
   ```bash
   # Pull latest code
   git pull
   
   # Rebuild Docker
   make docker-rebuild
   
   # Run migrations in Docker
   make migration-docker
   ```

4. **Verify**
   ```bash
   # Check logs
   docker logs adryx-backend
   
   # Check database
   make shell-db
   \d users
   ```

## Manual Migration Creation

Sometimes you need to write migrations manually:

```bash
# Create migration file manually
cd apps/backend/src/migrations
touch $(date +%s)-CustomMigration.ts
```

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomMigration1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your SQL here
    await queryRunner.query(`
      CREATE INDEX idx_users_email ON users(email);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes
    await queryRunner.query(`
      DROP INDEX idx_users_email;
    `);
  }
}
```

## Common Migration Tasks

### Add Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users" 
    ADD COLUMN "last_login" TIMESTAMP
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users" 
    DROP COLUMN "last_login"
  `);
}
```

### Create Index

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    CREATE INDEX "idx_users_email" ON "users" ("email")
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    DROP INDEX "idx_users_email"
  `);
}
```

### Add Foreign Key

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "sites" 
    ADD CONSTRAINT "fk_sites_user" 
    FOREIGN KEY ("userId") 
    REFERENCES "users"("id") 
    ON DELETE CASCADE
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "sites" 
    DROP CONSTRAINT "fk_sites_user"
  `);
}
```

### Seed Data

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    INSERT INTO "users" ("email", "role") 
    VALUES ('admin@adryx.com', 'admin')
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    DELETE FROM "users" 
    WHERE "email" = 'admin@adryx.com'
  `);
}
```

## Current Entities

Your application has these entities:

1. **User** (`apps/backend/src/entities/user.entity.ts`)
2. **Site** (`apps/backend/src/entities/site.entity.ts`)
3. **Campaign** (`apps/backend/src/entities/campaign.entity.ts`)
4. **Placement** (`apps/backend/src/entities/placement.entity.ts`)
5. **Interaction** (`apps/backend/src/entities/interaction.entity.ts`)

## Initial Setup

Since you're starting fresh, here's how to create your initial schema:

### Option 1: Let Synchronize Create Tables (Current)

Your app is currently set to `synchronize: true` in development, so tables are created automatically when you start the backend.

```bash
# Tables are created automatically
cd apps/backend
pnpm start:dev
```

### Option 2: Generate Initial Migration

For production-ready setup:

```bash
# 1. Make sure database is empty or matches entities
make test-db

# 2. Generate initial migration
make migration-generate
# Name: InitialSchema

# 3. Review the generated migration
cat apps/backend/src/migrations/*-InitialSchema.ts

# 4. Run migration
make migration-run
```

## Troubleshooting

### Error: No changes in database schema

**Cause:** Database already matches entities

**Fix:**
```bash
# Either database is up to date, or synchronize already created tables
# Check database
make shell-db
\dt
```

### Error: Migration already exists

**Cause:** Migration file already generated

**Fix:**
```bash
# Delete old migration if not needed
rm apps/backend/src/migrations/*-OldMigration.ts

# Or run it
make migration-run
```

### Error: Cannot find module

**Cause:** Migration not compiled

**Fix:**
```bash
# Build first
cd apps/backend
pnpm build

# Then run migration
pnpm migration:run
```

### Error: Connection refused

**Cause:** Database not running or wrong credentials

**Fix:**
```bash
# Test connection
make test-db

# Check .env file
cat apps/backend/.env | grep DB_
```

## Best Practices

1. **Always Review Generated Migrations**
   - Check SQL before running
   - Ensure `down` method properly reverts changes

2. **Test Migrations Locally First**
   - Run on development database
   - Test rollback with `migration-revert`

3. **One Migration Per Feature**
   - Keep migrations focused
   - Easier to review and rollback

4. **Never Edit Applied Migrations**
   - Create new migration instead
   - Editing breaks migration history

5. **Backup Before Production Migrations**
   ```bash
   make backup-db
   ```

6. **Use Transactions**
   - TypeORM wraps migrations in transactions automatically
   - Ensures all-or-nothing execution

## Disable Synchronize for Production

When ready for production:

1. **Update .env**
   ```env
   NODE_ENV=production
   ```

2. **Verify synchronize is disabled**
   ```typescript
   // apps/backend/src/app.module.ts
   synchronize: configService.get('NODE_ENV') === 'development', // false in production
   ```

3. **Use migrations only**
   ```bash
   make migration-docker
   ```

## Quick Reference

| Command | Description |
|---------|-------------|
| `make migration-generate` | Create new migration |
| `make migration-run` | Apply pending migrations |
| `make migration-revert` | Rollback last migration |
| `make migration-docker` | Run migrations in Docker |
| `make test-db` | Test database connection |
| `make shell-db` | Access database shell |

## Next Steps

1. Generate your initial migration:
   ```bash
   make migration-generate
   ```

2. Review and run it:
   ```bash
   make migration-run
   ```

3. Verify tables were created:
   ```bash
   make shell-db
   \dt
   ```

Your database is now under version control! 🎉
