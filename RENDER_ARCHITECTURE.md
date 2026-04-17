# Render Deployment Architecture

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
         ┌───────────────┴───────────────┐
         │                               │
         │                               │
┌────────▼─────────┐           ┌────────▼─────────┐
│                  │           │                  │
│  Render Frontend │           │  Render Backend  │
│   (Next.js)      │◄─────────►│   (NestJS)       │
│                  │   API     │                  │
│  Port: 3000      │  Calls    │  Port: 3001      │
│                  │           │                  │
└──────────────────┘           └────────┬─────────┘
                                        │
                                        │ MongoDB
                                        │ Protocol
                                        │
                               ┌────────▼─────────┐
                               │                  │
                               │  MongoDB Atlas   │
                               │   (Database)     │
                               │                  │
                               │  Port: 27017     │
                               │                  │
                               └──────────────────┘
                                        │
                                        │
                               ┌────────▼─────────┐
                               │                  │
                               │  Solana Network  │
                               │   (Blockchain)   │
                               │                  │
                               │  Devnet/Mainnet  │
                               │                  │
                               └──────────────────┘
```

## Service Details

### Frontend Service (adryx-frontend)
- **Type**: Web Service
- **Runtime**: Docker
- **Port**: 3000
- **Framework**: Next.js 15
- **Build Time**: ~5-8 minutes
- **Memory**: 512MB (free tier)
- **Auto-deploy**: On git push

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NEXT_PUBLIC_SOLANA_NETWORK` - Solana network (devnet/mainnet)
- `NEXT_PUBLIC_SOLANA_RPC_URL` - Solana RPC endpoint
- `NEXT_PUBLIC_SOLANA_PROGRAM_ID` - Smart contract address

### Backend Service (adryx-backend)
- **Type**: Web Service
- **Runtime**: Docker
- **Port**: 3001
- **Framework**: NestJS
- **Build Time**: ~7-10 minutes
- **Memory**: 512MB (free tier)
- **Auto-deploy**: On git push

**Environment Variables:**
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Authentication secret
- `SOLANA_PRIVATE_KEY` - Wallet private key
- `SOLANA_NETWORK` - Network selection
- `CORS_ORIGIN` - Frontend URL for CORS

### Database (MongoDB Atlas)
- **Type**: Managed Database
- **Provider**: MongoDB Atlas
- **Tier**: M0 (Free) or M2 (Paid)
- **Storage**: 512MB (free) / 2GB (paid)
- **Backups**: Automatic (paid tier)
- **Region**: Choose closest to Render services

### Blockchain (Solana)
- **Network**: Devnet (testing) or Mainnet (production)
- **RPC**: Public endpoint or private RPC provider
- **Program**: Deployed smart contract
- **Wallet**: Service wallet for transactions

## Data Flow

### User Request Flow
1. User visits frontend URL (e.g., `adryx-frontend.onrender.com`)
2. Frontend loads from Render CDN
3. User interacts with UI (e.g., creates campaign)
4. Frontend makes API call to backend
5. Backend validates request and checks database
6. Backend interacts with Solana blockchain if needed
7. Backend returns response to frontend
8. Frontend updates UI

### Campaign Creation Flow
```
User → Frontend → Backend → MongoDB (save campaign)
                    ↓
                 Solana (create on-chain campaign)
                    ↓
                 MongoDB (update with blockchain data)
                    ↓
                 Frontend (show success)
```

### Payment Processing Flow
```
Backend Cron Job → Check pending payments
                    ↓
                 Solana (execute payment transaction)
                    ↓
                 MongoDB (update payment status)
                    ↓
                 Webhook/Notification (optional)
```

## Network Configuration

### Ports
- Frontend: 3000 (internal), 443 (external HTTPS)
- Backend: 3001 (internal), 443 (external HTTPS)
- MongoDB: 27017 (internal only)

### DNS
- Frontend: `<service-name>.onrender.com` or custom domain
- Backend: `<service-name>.onrender.com` or custom domain

### SSL/TLS
- Automatic HTTPS on all Render services
- Free SSL certificates from Let's Encrypt
- Auto-renewal

## Security

### Network Security
- All traffic encrypted with TLS 1.3
- Render provides DDoS protection
- MongoDB Atlas has built-in security

### Application Security
- CORS configured to allow only frontend domain
- JWT tokens for authentication
- Environment variables for secrets
- No secrets in code or git

### Database Security
- MongoDB authentication required
- IP whitelist (0.0.0.0/0 for Render)
- Encrypted connections
- Regular backups (paid tier)

## Scaling Strategy

### Horizontal Scaling
- Render supports multiple instances
- Load balancing automatic
- Session management via JWT (stateless)

### Vertical Scaling
- Upgrade instance types in Render dashboard
- More CPU and memory
- Better performance

### Database Scaling
- MongoDB Atlas auto-scaling
- Upgrade to larger clusters
- Add read replicas

## Monitoring

### Render Dashboard
- Real-time logs
- Resource usage graphs
- Deploy history
- Health checks

### MongoDB Atlas
- Database metrics
- Query performance
- Connection stats
- Alerts

### Recommended Tools
- **Logging**: Papertrail, LogDNA
- **Errors**: Sentry
- **Uptime**: UptimeRobot
- **Analytics**: Google Analytics, Mixpanel

## Backup Strategy

### Code
- Git repository (GitHub/GitLab)
- Automatic versioning
- Easy rollback

### Database
- MongoDB Atlas automatic backups (paid tier)
- Point-in-time recovery
- Manual exports

### Environment Variables
- Document in secure location
- Use password manager
- Keep `.render-secrets` file locally (not in git)

## Disaster Recovery

### Service Failure
1. Check Render status page
2. Review logs in dashboard
3. Rollback to previous deploy if needed
4. Contact Render support

### Database Failure
1. Check MongoDB Atlas status
2. Restore from backup
3. Update connection string if needed

### Blockchain Issues
1. Check Solana status
2. Switch RPC endpoint if needed
3. Retry failed transactions

## Cost Optimization

### Free Tier Strategy
- Use free tier for development/testing
- Services spin down after 15 minutes
- 750 hours/month per service

### Production Strategy
- Upgrade to Starter ($7/month per service)
- No spin-down
- Better performance
- More resources

### Database Strategy
- Start with M0 (free)
- Upgrade to M2 ($9/month) for production
- Monitor usage and scale as needed

## Deployment Checklist

- [ ] Code pushed to Git
- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] JWT secret generated
- [ ] Solana wallet created
- [ ] Services created in Render
- [ ] Environment variables set
- [ ] First deploy successful
- [ ] Backend health check passing
- [ ] Frontend loading correctly
- [ ] API calls working
- [ ] Wallet connection working
- [ ] Database queries working
- [ ] Solana transactions working

## Maintenance

### Regular Tasks
- Monitor logs for errors
- Check resource usage
- Review database performance
- Update dependencies
- Rotate secrets periodically

### Updates
- Git push triggers auto-deploy
- Review deploy logs
- Test after deployment
- Rollback if issues

### Scaling
- Monitor traffic patterns
- Upgrade plans as needed
- Optimize database queries
- Add caching if needed
