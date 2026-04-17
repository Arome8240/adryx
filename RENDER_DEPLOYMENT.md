# Deploying Adryx to Render

This guide walks you through deploying the Adryx platform to Render.com.

## Architecture Overview

You'll deploy three services on Render:
1. **MongoDB** - Database (using Render's MongoDB service or external MongoDB Atlas)
2. **Backend API** - NestJS application
3. **Frontend** - Next.js application

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A Solana wallet private key for production (or use devnet for testing)

## Step 1: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/adryx`)
4. Whitelist all IPs (0.0.0.0/0) for Render to connect

### Option B: Render MongoDB (if available in your region)
1. In Render dashboard, click "New +"
2. Select "MongoDB"
3. Choose a name (e.g., "adryx-mongodb")
4. Select the free tier
5. Click "Create Database"
6. Copy the Internal Connection String

## Step 2: Deploy Backend API

1. **Create Web Service**
   - In Render dashboard, click "New +"
   - Select "Web Service"
   - Connect your Git repository
   - Configure:
     - **Name**: `adryx-backend`
     - **Region**: Choose closest to your users
     - **Branch**: `main` (or your default branch)
     - **Root Directory**: `apps/backend`
     - **Runtime**: `Docker`
     - **Instance Type**: Free (or paid for production)

2. **Environment Variables**
   Add these in the Render dashboard under "Environment":
   
   ```
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-a-secure-random-string>
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   SOLANA_NETWORK=devnet
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
   SOLANA_PRIVATE_KEY=<your-solana-wallet-private-key-base58>
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy using the Dockerfile

## Step 3: Deploy Frontend

1. **Create Web Service**
   - In Render dashboard, click "New +"
   - Select "Web Service"
   - Connect your Git repository
   - Configure:
     - **Name**: `adryx-frontend`
     - **Region**: Same as backend
     - **Branch**: `main`
     - **Root Directory**: `apps/frontend`
     - **Runtime**: `Docker`
     - **Instance Type**: Free (or paid for production)

2. **Environment Variables**
   Add these in the Render dashboard:
   
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://adryx-backend.onrender.com/api/v1
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy

## Step 4: Update CORS Settings

After frontend is deployed:
1. Go to backend service settings
2. Update `CORS_ORIGIN` environment variable with your actual frontend URL
3. Trigger a manual deploy

## Step 5: Verify Deployment

1. **Check Backend Health**
   ```bash
   curl https://adryx-backend.onrender.com/api/v1/solana/info
   ```

2. **Check Frontend**
   - Visit your frontend URL in a browser
   - Try connecting a Solana wallet
   - Test creating a campaign

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)

### Production Recommendations
1. **Upgrade to Paid Plans** for:
   - No spin-down
   - Better performance
   - More resources

2. **Use MongoDB Atlas** instead of Render MongoDB for:
   - Better reliability
   - Automatic backups
   - Better performance

3. **Set Up Custom Domain**:
   - Add custom domain in Render dashboard
   - Update CORS_ORIGIN and NEXT_PUBLIC_API_URL

4. **Enable Auto-Deploy**:
   - Render auto-deploys on git push by default
   - Disable if you want manual control

5. **Set Up Health Checks**:
   - Backend: `/api/v1/solana/info`
   - Frontend: `/`

## Troubleshooting

### Backend Won't Start
- Check logs in Render dashboard
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Can't Connect to Backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS_ORIGIN in backend matches frontend URL
- Check backend logs for CORS errors

### Database Connection Issues
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Solana Integration Issues
- Verify SOLANA_PRIVATE_KEY is in base58 format
- Check SOLANA_NETWORK matches RPC URL
- Ensure program is deployed to correct network

## Monitoring

1. **Render Dashboard**
   - View logs in real-time
   - Monitor resource usage
   - Check deployment history

2. **Set Up Alerts**
   - Configure email notifications for:
     - Deploy failures
     - Service crashes
     - High resource usage

## Scaling

When you're ready to scale:
1. Upgrade to paid plans
2. Enable auto-scaling
3. Add Redis for caching
4. Set up CDN for frontend assets
5. Use connection pooling for MongoDB

## Cost Estimate

### Free Tier
- Backend: Free (with spin-down)
- Frontend: Free (with spin-down)
- MongoDB Atlas: Free (512MB)
- **Total**: $0/month

### Production (Recommended)
- Backend: $7/month (Starter)
- Frontend: $7/month (Starter)
- MongoDB Atlas: $9/month (M2)
- **Total**: ~$23/month

## Security Checklist

- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Rotate Solana private keys regularly
- [ ] Enable HTTPS (automatic on Render)
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Whitelist only necessary IPs
- [ ] Set up rate limiting
- [ ] Enable Render's DDoS protection

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domain
3. Set up CI/CD pipeline
4. Add database backups
5. Implement logging service (e.g., LogDNA, Papertrail)
6. Set up error tracking (e.g., Sentry)
