# Render Deployment - Quick Start

Deploy Adryx to Render in 10 minutes.

## Prerequisites

- [ ] Render account (https://render.com)
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] MongoDB Atlas account (free tier works)

## Step 1: Prepare MongoDB (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create account
3. Create a free M0 cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Add `/adryx` at the end: `mongodb+srv://username:password@cluster.mongodb.net/adryx`
8. In "Network Access", add IP `0.0.0.0/0` (allow from anywhere)

## Step 2: Generate Secrets

Run this command to generate a JWT secret:
```bash
openssl rand -base64 32
```

Save this value - you'll need it in Step 4.

## Step 3: Deploy to Render (3 minutes)

### Option A: Using Blueprint (Easiest)

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your Git repository
4. Render will detect `render.yaml` and show 2 services
5. Click "Apply"

### Option B: Manual Setup

**Backend:**
1. Click "New +" → "Web Service"
2. Connect repository
3. Settings:
   - Name: `adryx-backend`
   - Root Directory: `apps/backend`
   - Runtime: Docker
   - Plan: Free
4. Click "Create Web Service"

**Frontend:**
1. Click "New +" → "Web Service"
2. Connect repository
3. Settings:
   - Name: `adryx-frontend`
   - Root Directory: `apps/frontend`
   - Runtime: Docker
   - Plan: Free
4. Click "Create Web Service"

## Step 4: Configure Environment Variables (2 minutes)

### Backend Environment Variables

Go to backend service → Environment → Add:

```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adryx
JWT_SECRET=<your-generated-secret-from-step-2>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
CORS_ORIGIN=https://adryx-frontend.onrender.com
```

**Note:** Replace `adryx-frontend` with your actual frontend service name.

### Frontend Environment Variables

Go to frontend service → Environment → Add:

```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://adryx-backend.onrender.com/api/v1
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
```

**Note:** Replace `adryx-backend` with your actual backend service name.

## Step 5: Deploy

Both services will automatically deploy. Wait 5-10 minutes for the first build.

## Step 6: Verify

1. Check backend: `https://your-backend.onrender.com/api/v1/solana/info`
2. Check frontend: `https://your-frontend.onrender.com`

## Troubleshooting

### Backend fails to start
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend can't connect to backend
- Update `NEXT_PUBLIC_API_URL` with correct backend URL
- Update `CORS_ORIGIN` in backend with correct frontend URL
- Redeploy both services

### Services are slow
- Free tier spins down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan ($7/month) to keep services always on

## Production Checklist

For production deployment:

- [ ] Upgrade to paid plans (no spin-down)
- [ ] Add custom domain
- [ ] Generate production Solana keypair
- [ ] Set `SOLANA_NETWORK=mainnet-beta`
- [ ] Update `SOLANA_RPC_URL` to mainnet
- [ ] Deploy Solana program to mainnet
- [ ] Update `SOLANA_PROGRAM_ID` with mainnet program
- [ ] Set up monitoring and alerts
- [ ] Enable auto-deploy on git push
- [ ] Set up database backups

## Costs

**Free Tier:**
- Backend: Free (with spin-down)
- Frontend: Free (with spin-down)
- MongoDB: Free (512MB)
- Total: $0/month

**Production:**
- Backend: $7/month (Starter)
- Frontend: $7/month (Starter)
- MongoDB: $9/month (M2)
- Total: $23/month

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Adryx Issues: https://github.com/your-repo/issues

## Next Steps

1. Set up custom domain
2. Configure production Solana wallet
3. Deploy to mainnet
4. Set up monitoring
5. Add error tracking (Sentry)
