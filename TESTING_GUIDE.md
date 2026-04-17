# Testing Guide

Complete guide for testing the Adryx platform locally and in production.

## Quick Test Commands

```bash
# Test backend health
curl http://localhost:3001/api/v1/solana/info

# Test frontend
open http://localhost:3000

# Test database connection
docker compose logs mongodb

# Test all services
docker compose ps
```

## Local Testing (Docker)

### 1. Start Services
```bash
docker compose up -d
```

### 2. Verify Services Running
```bash
docker compose ps

# Expected output:
# NAME             STATUS
# adryx-backend    Up (healthy)
# adryx-frontend   Up
# adryx-mongodb    Up (healthy)
```

### 3. Test Backend API

#### Health Check
```bash
curl http://localhost:3001/api/v1/solana/info
```

Expected response:
```json
{
  "wallet": "5Dng86bP999hyv2NGD1eGGU4HrRQFD4S7L8wbMfQw7vx",
  "programId": "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS",
  "platformPda": "..."
}
```

#### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User",
    "role": "advertiser"
  }'
```

Expected response:
```json
{
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "advertiser"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Test Campaign Creation
```bash
# Save the access token from registration
TOKEN="your-access-token"

# Create a campaign
curl -X POST http://localhost:3001/api/v1/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Campaign",
    "description": "Testing campaign creation",
    "budget": 1000,
    "dailyBudget": 100,
    "startDate": "2026-04-20T00:00:00Z",
    "endDate": "2026-05-20T00:00:00Z",
    "targetUrl": "https://example.com",
    "status": "draft"
  }'
```

### 4. Test Frontend

#### Open in Browser
```bash
open http://localhost:3000
```

#### Manual Tests
1. **Homepage**
   - [ ] Page loads without errors
   - [ ] Navigation works
   - [ ] Wallet connect button visible

2. **Advertiser Dashboard**
   - [ ] Navigate to `/dashboard`
   - [ ] Login/register works
   - [ ] Dashboard displays
   - [ ] Create campaign button works

3. **Publisher Dashboard**
   - [ ] Navigate to `/publishers`
   - [ ] Dashboard displays
   - [ ] Sites page works
   - [ ] Analytics display

4. **Wallet Connection**
   - [ ] Click "Connect Wallet"
   - [ ] Phantom/Solflare popup appears
   - [ ] Connection successful
   - [ ] Wallet address displays

### 5. Test Database

#### Check MongoDB Connection
```bash
docker compose logs mongodb | grep "Waiting for connections"
```

#### Connect to MongoDB
```bash
docker exec -it adryx-mongodb mongosh mongodb://localhost:27017/adryx
```

#### Query Data
```javascript
// List all users
db.users.find().pretty()

// List all campaigns
db.campaigns.find().pretty()

// Count documents
db.users.countDocuments()
db.campaigns.countDocuments()
```

## Production Testing (Render)

### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/api/v1/solana/info
```

### 2. Test Frontend

Open in browser:
```
https://your-frontend.onrender.com
```

### 3. Test API Integration

```bash
# Test from frontend to backend
# Open browser console on frontend
fetch('https://your-backend.onrender.com/api/v1/solana/info')
  .then(r => r.json())
  .then(console.log)
```

### 4. Test CORS

```bash
curl -H "Origin: https://your-frontend.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://your-backend.onrender.com/api/v1/campaigns
```

Expected: Should return CORS headers

## Integration Testing

### End-to-End Campaign Flow

1. **Register User**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "advertiser@test.com",
       "password": "Test123!",
       "name": "Test Advertiser",
       "role": "advertiser"
     }'
   ```

2. **Create Campaign**
   ```bash
   curl -X POST http://localhost:3001/api/v1/campaigns \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "name": "E2E Test Campaign",
       "budget": 1000,
       "dailyBudget": 100,
       "startDate": "2026-04-20T00:00:00Z",
       "endDate": "2026-05-20T00:00:00Z"
     }'
   ```

3. **Get Campaign**
   ```bash
   curl http://localhost:3001/api/v1/campaigns/$CAMPAIGN_ID \
     -H "Authorization: Bearer $TOKEN"
   ```

4. **Update Campaign**
   ```bash
   curl -X PATCH http://localhost:3001/api/v1/campaigns/$CAMPAIGN_ID \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"status": "active"}'
   ```

### Publisher Flow

1. **Register Publisher**
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "publisher@test.com",
       "password": "Test123!",
       "name": "Test Publisher",
       "role": "publisher"
     }'
   ```

2. **Create Site**
   ```bash
   curl -X POST http://localhost:3001/api/v1/sites \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "name": "Test Site",
       "url": "https://testsite.com",
       "category": "technology"
     }'
   ```

3. **Create Placement**
   ```bash
   curl -X POST http://localhost:3001/api/v1/placements \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "siteId": "$SITE_ID",
       "name": "Header Banner",
       "format": "banner",
       "size": "728x90"
     }'
   ```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test backend endpoint
ab -n 1000 -c 10 http://localhost:3001/api/v1/solana/info

# Test with authentication
ab -n 100 -c 5 -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/campaigns
```

### Expected Performance
- Response time: < 200ms (p95)
- Throughput: > 100 req/s
- Error rate: < 0.1%

## Security Testing

### 1. Test Authentication

```bash
# Try accessing protected endpoint without token
curl http://localhost:3001/api/v1/campaigns

# Expected: 401 Unauthorized
```

### 2. Test CORS

```bash
# Try from unauthorized origin
curl -H "Origin: https://evil.com" \
  http://localhost:3001/api/v1/campaigns

# Expected: CORS error
```

### 3. Test Input Validation

```bash
# Try invalid email
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid", "password": "test"}'

# Expected: 400 Bad Request with validation errors
```

## Solana Integration Testing

### 1. Check Wallet Balance

```bash
solana balance 5Dng86bP999hyv2NGD1eGGU4HrRQFD4S7L8wbMfQw7vx --url devnet
```

### 2. Test Campaign Creation on Solana

```bash
curl -X POST http://localhost:3001/api/v1/solana/create-campaign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "campaignId": "$CAMPAIGN_ID",
    "budget": 1000000000
  }'
```

### 3. Verify Transaction

```bash
# Check transaction on Solscan
open "https://solscan.io/tx/$TRANSACTION_SIGNATURE?cluster=devnet"
```

## Automated Testing

### Backend Unit Tests

```bash
cd apps/backend
pnpm test
```

### Frontend Tests

```bash
cd apps/frontend
pnpm test
```

### Smart Contract Tests

```bash
anchor test
```

## Monitoring & Logging

### View Logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100 backend
```

### Check Resource Usage

```bash
docker stats
```

## Troubleshooting Tests

### Backend Not Responding

1. Check if service is running:
   ```bash
   docker compose ps backend
   ```

2. Check logs:
   ```bash
   docker compose logs backend
   ```

3. Restart service:
   ```bash
   docker compose restart backend
   ```

### Database Connection Failed

1. Check MongoDB status:
   ```bash
   docker compose ps mongodb
   ```

2. Test connection:
   ```bash
   docker exec -it adryx-mongodb mongosh
   ```

3. Check connection string in backend logs

### Frontend Can't Connect to Backend

1. Check CORS configuration
2. Verify API URL in frontend env
3. Check network tab in browser DevTools
4. Verify backend is accessible

## Test Checklist

### Before Deployment
- [ ] All Docker services start successfully
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Database connection works
- [ ] Authentication flow works
- [ ] Campaign CRUD operations work
- [ ] Solana integration works
- [ ] No console errors
- [ ] No security vulnerabilities

### After Deployment
- [ ] Production backend accessible
- [ ] Production frontend accessible
- [ ] API calls work from frontend
- [ ] CORS configured correctly
- [ ] Database connected
- [ ] Wallet connection works
- [ ] SSL certificates valid
- [ ] No errors in logs

## Performance Benchmarks

### Expected Metrics

| Metric | Target | Acceptable |
|--------|--------|------------|
| API Response Time (p95) | < 200ms | < 500ms |
| Frontend Load Time | < 2s | < 5s |
| Database Query Time | < 50ms | < 100ms |
| Solana Transaction Time | < 5s | < 10s |
| Uptime | > 99.9% | > 99% |

## Continuous Testing

### Set Up Monitoring

1. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Monitor backend health endpoint
   - Monitor frontend homepage

2. **Error Tracking**
   - Set up Sentry
   - Track frontend errors
   - Track backend exceptions

3. **Performance Monitoring**
   - Use Render metrics
   - Monitor response times
   - Track resource usage

### Automated Tests

Set up GitHub Actions or similar for:
- Run tests on every commit
- Deploy to staging on PR
- Deploy to production on merge

## Support

If tests fail:
1. Check logs first
2. Review error messages
3. Consult troubleshooting section
4. Check documentation
5. Create GitHub issue

---

Happy Testing! 🧪
