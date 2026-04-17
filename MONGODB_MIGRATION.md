# PostgreSQL to MongoDB Migration Guide

## Overview

This guide documents the migration from PostgreSQL + TypeORM to MongoDB + Mongoose for the Adryx backend.

## Changes Required

### 1. Dependencies
- Remove: `pg`, `typeorm`, `@nestjs/typeorm`
- Add: `mongoose`, `@nestjs/mongoose`

### 2. Entities → Schemas
- Convert TypeORM entities to Mongoose schemas
- Change decorators from `@Entity`, `@Column` to `@Schema`, `@Prop`
- Update relationships (OneToMany, ManyToOne → refs)

### 3. Configuration
- Replace TypeORM config with Mongoose config
- Update environment variables
- Change Docker compose from PostgreSQL to MongoDB

### 4. Services
- Update repository pattern to Mongoose models
- Change query syntax from TypeORM to Mongoose

### 5. Docker
- Replace postgres service with mongodb
- Update ports and volumes
- Update backend environment variables

## Migration Steps

1. ✅ Update package.json dependencies
2. ✅ Convert entities to schemas
3. ✅ Update app.module.ts configuration
4. ✅ Update services to use Mongoose
5. ✅ Update Docker configuration
6. ✅ Update environment variables
7. ✅ Test and rebuild

## Rollback Plan

If needed, revert by:
1. Restore package.json from git
2. Restore entities
3. Restore app.module.ts
4. Restore docker-compose.yml
5. Run `pnpm install` and rebuild

## Notes

- MongoDB uses `_id` instead of `id`
- No migrations needed (schema-less)
- Relationships are handled differently
- Queries use Mongoose syntax
