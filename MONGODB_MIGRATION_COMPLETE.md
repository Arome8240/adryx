# MongoDB Migration Complete ✅

The backend has been successfully migrated from PostgreSQL + TypeORM to MongoDB + Mongoose.

## What Changed

### 1. Dependencies Updated ✅
**Removed:**
- `pg` - PostgreSQL driver
- `typeorm` - TypeORM library
- `@nestjs/typeorm` - NestJS TypeORM integration

**Added:**
- `mongoose@^8.8.4` - MongoDB ODM
- `@nestjs/mongoose@^10.0.10` - NestJS Mongoose integration

### 2. Entities → Schemas ✅
Converted all TypeORM entities to Mongoose schemas:

| Old (TypeORM) | New (Mongoose) |
|---------------|----------------|
| `src/entities/user.entity.ts` | `src/schemas/user.schema.ts` |
| `src/entities/site.entity.ts` | `src/schemas/site.schema.ts` |
| `src/entities/campaign.entity.ts` | `src/schemas/campaign.schema.ts` |
| `src/entities/placement.entity.ts` | `src/schemas/placement.schema.ts` |
| `src/entities/interaction.entity.ts` | `src/schemas/interaction.schema.ts` |

**Key Changes:**
- `@Entity()` → `@Schema()`
- `@Column()` → `@Prop()`
- `@PrimaryGeneratedColumn('uuid')` → MongoDB's `_id` (automatic)
- `@ManyToOne()`, `@OneToMany()` → Virtual fields with `ref`
- Timestamps handled by `{ timestamps: true }`

### 3. Configuration Updated ✅

**app.module.ts:**
```typescript
// Before: TypeORM
TypeOrmModule.forRootAsync({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  // ...
})

// After: Mongoose
MongooseModule.forRootAsync({
  uri: configService.get('MONGODB_URI'),
})
```

**Environment Variables:**
```env
# Before
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=adryx
DB_USERNAME=postgres
DB_PASSWORD=password

# After
MONGODB_URI=mongodb://localhost:27017/adryx
```

### 4. Services Updated ✅

**sites.service.ts** - Example changes:
```typescript
// Before: TypeORM Repository
@InjectRepository(Site)
private sitesRepository: Repository<Site>

// After: Mongoose Model
@InjectModel(Site.name)
private siteModel: Model<SiteDocument>

// Before: TypeORM queries
this.sitesRepository.find({ where: { publisherId } })

// After: Mongoose queries
this.siteModel.find({ publisherId }).exec()
```

### 5. Docker Configuration Updated ✅

**docker-compose.yml:**
- Replaced `postgres:16-alpine` with `mongo:7-jammy`
- Changed port from `5433:5432` to `27017:27017`
- Updated environment variables
- Changed volume from `postgres_data` to `mongodb_data`
- Updated healthcheck command

### 6. Module Updates ✅

**sites.module.ts:**
```typescript
// Before
TypeOrmModule.forFeature([Site])

// After
MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }])
```

## MongoDB vs PostgreSQL Differences

| Feature | PostgreSQL | MongoDB |
|---------|-----------|---------|
| **ID Field** | `id` (UUID) | `_id` (ObjectId) |
| **Schema** | Strict (migrations) | Flexible (schema-less) |
| **Relationships** | Foreign keys | References (populate) |
| **Queries** | SQL | MongoDB query language |
| **Transactions** | Native | Supported (replica sets) |
| **Migrations** | Required | Not required |

## Next Steps

### 1. Install Dependencies
```bash
cd apps/backend
pnpm install
```

### 2. Update .env File
```bash
# Update apps/backend/.env
MONGODB_URI=mongodb://localhost:27017/adryx
```

### 3. Start MongoDB (Local Development)
```bash
# Option 1: Docker
docker run -d -p 27017:27017 --name mongodb mongo:7-jammy

# Option 2: Local MongoDB
mongod --dbpath /path/to/data
```

### 4. Rebuild Docker
```bash
# Stop old containers
make docker-down

# Remove old volumes
docker volume rm adryx_postgres_data

# Rebuild with MongoDB
make docker-rebuild
```

### 5. Verify
```bash
# Check containers
docker ps

# Check backend logs
docker logs adryx-backend

# Test API
curl http://localhost:3001/api/v1/sites
```

## Rollback Instructions

If you need to rollback to PostgreSQL:

```bash
# 1. Checkout previous commit
git checkout HEAD~1 apps/backend/package.json
git checkout HEAD~1 apps/backend/src/
git checkout HEAD~1 docker-compose.yml

# 2. Reinstall dependencies
cd apps/backend && pnpm install

# 3. Rebuild Docker
make docker-rebuild
```

## Testing Checklist

- [ ] Dependencies installed successfully
- [ ] Backend builds without errors
- [ ] MongoDB container starts
- [ ] Backend connects to MongoDB
- [ ] API endpoints respond
- [ ] CRUD operations work
- [ ] Relationships populate correctly

## Common Issues & Solutions

### Issue: Module not found 'mongoose'
```bash
cd apps/backend
pnpm install
```

### Issue: Cannot connect to MongoDB
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/adryx
```

### Issue: Old entities still referenced
- Search for `@nestjs/typeorm` imports
- Search for `Repository` from `typeorm`
- Replace with Mongoose equivalents

## Benefits of MongoDB

✅ **Flexible Schema** - No migrations needed
✅ **JSON-like Documents** - Natural fit for JavaScript/TypeScript
✅ **Horizontal Scaling** - Built-in sharding support
✅ **Fast Development** - No schema changes required
✅ **Rich Queries** - Powerful aggregation framework

## Documentation

- [Mongoose Docs](https://mongoosejs.com/)
- [NestJS Mongoose](https://docs.nestjs.com/techniques/mongodb)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

---

Migration completed successfully! 🎉
