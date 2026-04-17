# Docker Containers Running Successfully

## Status

All containers are now running successfully on Docker:

### Container Status
```
NAME             STATUS                    PORTS
adryx-backend    Up (healthy)             0.0.0.0:3001->3001/tcp
adryx-frontend   Up                       0.0.0.0:3000->3000/tcp
adryx-mongodb    Up (healthy)             0.0.0.0:27017->27017/tcp
```

## What Was Fixed

### bcrypt Native Module Issue
The backend was failing to start due to bcrypt's native bindings not being compatible with the Docker Alpine Linux environment. 

**Solution**: Replaced `bcrypt` with `bcryptjs`, a pure JavaScript implementation that doesn't require native compilation.

Changes made:
1. Removed `bcrypt` and `@types/bcrypt` packages
2. Added `bcryptjs` package
3. Updated `apps/backend/src/modules/auth/auth.service.ts` to import from `bcryptjs` instead of `bcrypt`
4. Simplified Dockerfile to single-stage build

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **MongoDB**: localhost:27017

## API Endpoints

The backend is running with all routes mapped:

### Authentication
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/wallet-login`
- POST `/api/v1/auth/refresh`

### Campaigns
- GET `/api/v1/campaigns`
- POST `/api/v1/campaigns`
- GET `/api/v1/campaigns/:id`
- PATCH `/api/v1/campaigns/:id`
- DELETE `/api/v1/campaigns/:id`

### Sites
- GET `/api/v1/sites`
- POST `/api/v1/sites`
- GET `/api/v1/sites/:id`
- PATCH `/api/v1/sites/:id`
- DELETE `/api/v1/sites/:id`

### Placements
- GET `/api/v1/placements`
- POST `/api/v1/placements`
- GET `/api/v1/placements/:id`
- PATCH `/api/v1/placements/:id`
- DELETE `/api/v1/placements/:id`

### Solana Integration
- GET `/api/v1/solana/info`
- POST `/api/v1/solana/create-campaign`
- POST `/api/v1/solana/fund-campaign`
- POST `/api/v1/solana/withdraw-campaign`
- POST `/api/v1/solana/pay-publisher`
- POST `/api/v1/solana/claim-earnings`
- POST `/api/v1/solana/process-pending-payments`
- POST `/api/v1/solana/retry-failed-payments`

### Interactions
- POST `/api/v1/interactions/impression`
- POST `/api/v1/interactions/click`
- GET `/api/v1/interactions/:id`
- GET `/api/v1/interactions/campaign/:campaignId`
- GET `/api/v1/interactions/placement/:placementId`

### Analytics
- GET `/api/v1/analytics/advertiser/dashboard`
- GET `/api/v1/analytics/publisher/dashboard`
- GET `/api/v1/analytics/campaign/:id`
- GET `/api/v1/analytics/site/:id`
- GET `/api/v1/analytics/top-campaigns`
- GET `/api/v1/analytics/top-sites`

## Solana Configuration

The backend is configured for Solana devnet:
- **Wallet**: 5Dng86bP999hyv2NGD1eGGU4HrRQFD4S7L8wbMfQw7vx
- **Program ID**: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

## Next Steps

1. Test the frontend at http://localhost:3000
2. Test API endpoints using curl or Postman
3. Connect a Solana wallet (Phantom, Solflare, etc.) to test wallet authentication
4. Create campaigns and test the full flow

## Commands

Start all services:
```bash
docker compose up -d
```

Stop all services:
```bash
docker compose down
```

View logs:
```bash
docker compose logs -f
docker compose logs backend -f
docker compose logs frontend -f
```

Rebuild after code changes:
```bash
docker compose build
docker compose up -d
```
