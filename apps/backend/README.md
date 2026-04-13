# Adryx Backend API

NestJS backend for the Adryx decentralized advertising network.

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm 10+

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb adryx
```

### 3. Environment Variables

Copy the example env file and configure:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials and other settings.

### 4. Run Migrations

```bash
pnpm migration:run
```

## Development

Start the development server:

```bash
pnpm start:dev
```

The API will be available at:
- API: http://localhost:3001/api/v1
- Swagger Docs: http://localhost:3001/api/docs

## Database Entities

### User
- Manages both advertisers and publishers
- Roles: `advertiser`, `publisher`, `admin`
- Wallet integration for Solana payments

### Site
- Publisher's websites and mobile apps
- Verification system (meta tag or DNS)
- Tracks verification status

### Placement
- Ad units on publisher sites
- Supports: Banner, Native, Video, Interstitial
- Linked to specific sites

### Campaign
- Advertiser campaigns
- Budget tracking and status management
- Solana transaction integration

### Interaction
- Tracks impressions, clicks, conversions
- Links campaigns to placements
- Stores Solana transaction hashes for rewards

## API Endpoints

### Sites (Publishers)
- `POST /api/v1/sites` - Create site/app
- `GET /api/v1/sites` - List all sites
- `GET /api/v1/sites/:id` - Get site details
- `PATCH /api/v1/sites/:id` - Update site
- `DELETE /api/v1/sites/:id` - Delete site
- `POST /api/v1/sites/:id/verify` - Verify site ownership

### Campaigns (Advertisers)
- Coming soon

### Placements
- Coming soon

### Interactions
- Coming soon

### Analytics
- Coming soon

## Scripts

```bash
# Development
pnpm start:dev          # Start with hot reload
pnpm start:debug        # Start with debugger

# Build
pnpm build              # Build for production
pnpm start:prod         # Run production build

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Generate coverage report
pnpm test:e2e           # Run e2e tests

# Database
pnpm migration:generate # Generate migration from entities
pnpm migration:run      # Run pending migrations
pnpm migration:revert   # Revert last migration

# Code Quality
pnpm lint               # Lint and fix
pnpm format             # Format code
```

## Project Structure

```
src/
├── common/
│   └── enums/          # Shared enums
├── config/             # Configuration files
├── entities/           # TypeORM entities
├── modules/
│   ├── auth/          # Authentication
│   ├── users/         # User management
│   ├── sites/         # Publisher sites
│   ├── placements/    # Ad placements
│   ├── campaigns/     # Advertiser campaigns
│   ├── interactions/  # Tracking
│   └── analytics/     # Reporting
├── app.module.ts
└── main.ts
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DB_*` - Database connection
- `JWT_SECRET` - JWT signing key
- `SOLANA_*` - Solana blockchain config
- `CORS_ORIGIN` - Frontend URL

## TODO

- [ ] Implement JWT authentication
- [ ] Add user registration/login
- [ ] Complete placements CRUD
- [ ] Complete campaigns CRUD
- [ ] Implement interaction tracking
- [ ] Add analytics endpoints
- [ ] Integrate Solana program
- [ ] Add rate limiting
- [ ] Implement caching (Redis)
- [ ] Add email verification
- [ ] Implement site verification logic
- [ ] Add webhook support

## License

MIT
