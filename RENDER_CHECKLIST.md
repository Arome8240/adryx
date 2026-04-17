# Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment (15 minutes)

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] Tests passing locally
- [ ] Docker builds successfully
- [ ] No secrets in code
- [ ] `.gitignore` includes `.render-secrets`

### 2. Git Repository
- [ ] Repository created on GitHub/GitLab/Bitbucket
- [ ] Code pushed to main branch
- [ ] Repository is accessible
- [ ] README.md updated

### 3. MongoDB Setup
- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created
- [ ] Connection string copied
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Database name is `adryx`

### 4. Secrets Generation
- [ ] JWT secret generated: `openssl rand -base64 32`
- [ ] Solana keypair created (if needed)
- [ ] Private key in base58 format
- [ ] Secrets saved securely (not in Git)

## Render Setup (10 minutes)

### 5. Render Account
- [ ] Account created at https://render.com
- [ ] Email verified
- [ ] Payment method added (for paid plans)

### 6. Backend Service
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Settings configured:
  - [ ] Name: `adryx-backend`
  - [ ] Root Directory: `apps/backend`
  - [ ] Runtime: Docker
  - [ ] Region selected
  - [ ] Plan selected (Free or Starter)

### 7. Backend Environment Variables
Add these in Render dashboard:
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `MONGODB_URI=<your-connection-string>`
- [ ] `JWT_SECRET=<your-generated-secret>`
- [ ] `JWT_EXPIRES_IN=1h`
- [ ] `JWT_REFRESH_EXPIRES_IN=7d`
- [ ] `SOLANA_NETWORK=devnet`
- [ ] `SOLANA_RPC_URL=https://api.devnet.solana.com`
- [ ] `SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`
- [ ] `SOLANA_PRIVATE_KEY=<optional-for-devnet>`
- [ ] `CORS_ORIGIN=<will-update-after-frontend>`

### 8. Frontend Service
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Settings configured:
  - [ ] Name: `adryx-frontend`
  - [ ] Root Directory: `apps/frontend`
  - [ ] Runtime: Docker
  - [ ] Region selected (same as backend)
  - [ ] Plan selected (Free or Starter)

### 9. Frontend Environment Variables
Add these in Render dashboard:
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_API_URL=<backend-url>/api/v1`
- [ ] `NEXT_PUBLIC_SOLANA_NETWORK=devnet`
- [ ] `NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com`
- [ ] `NEXT_PUBLIC_SOLANA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

## First Deploy (10 minutes)

### 10. Deploy Services
- [ ] Backend deploy triggered
- [ ] Backend build successful (check logs)
- [ ] Backend service running
- [ ] Frontend deploy triggered
- [ ] Frontend build successful (check logs)
- [ ] Frontend service running

### 11. Update CORS
- [ ] Copy frontend URL from Render
- [ ] Update backend `CORS_ORIGIN` environment variable
- [ ] Trigger backend redeploy

## Verification (5 minutes)

### 12. Backend Health Check
Test these endpoints:
- [ ] `https://your-backend.onrender.com/api/v1/solana/info` returns JSON
- [ ] Response includes wallet and programId
- [ ] No errors in logs

### 13. Frontend Check
- [ ] `https://your-frontend.onrender.com` loads
- [ ] Homepage displays correctly
- [ ] No console errors
- [ ] Wallet connect button visible

### 14. Integration Test
- [ ] Frontend can connect to backend
- [ ] API calls work (check Network tab)
- [ ] Wallet connection works
- [ ] No CORS errors

## Post-Deployment (Optional)

### 15. Custom Domain (Optional)
- [ ] Domain purchased
- [ ] DNS configured
- [ ] Domain added in Render
- [ ] SSL certificate issued
- [ ] Environment variables updated with new domain

### 16. Monitoring Setup (Recommended)
- [ ] Render email notifications enabled
- [ ] UptimeRobot monitoring added
- [ ] Error tracking (Sentry) configured
- [ ] Analytics (Google Analytics) added

### 17. Production Preparation (For Mainnet)
- [ ] Production Solana wallet created
- [ ] Wallet funded with SOL
- [ ] Smart contract deployed to mainnet
- [ ] Environment variables updated:
  - [ ] `SOLANA_NETWORK=mainnet-beta`
  - [ ] `SOLANA_RPC_URL=https://api.mainnet-beta.solana.com`
  - [ ] `SOLANA_PROGRAM_ID=<mainnet-program-id>`
  - [ ] `SOLANA_PRIVATE_KEY=<production-wallet>`
- [ ] Services redeployed

## Troubleshooting

### If Backend Fails
1. [ ] Check logs in Render dashboard
2. [ ] Verify MongoDB connection string
3. [ ] Ensure all environment variables are set
4. [ ] Check MongoDB Atlas IP whitelist
5. [ ] Try manual redeploy

### If Frontend Fails
1. [ ] Check logs in Render dashboard
2. [ ] Verify `NEXT_PUBLIC_API_URL` is correct
3. [ ] Check for build errors
4. [ ] Verify all environment variables are set
5. [ ] Try manual redeploy

### If CORS Errors
1. [ ] Verify `CORS_ORIGIN` in backend matches frontend URL
2. [ ] Include protocol (https://)
3. [ ] No trailing slash
4. [ ] Redeploy backend after changes

### If Database Connection Fails
1. [ ] Test connection string locally
2. [ ] Check MongoDB Atlas status
3. [ ] Verify IP whitelist includes `0.0.0.0/0`
4. [ ] Check database user permissions
5. [ ] Verify password doesn't have special characters

## Success Criteria

Your deployment is successful when:
- [ ] Backend returns 200 on health check
- [ ] Frontend loads without errors
- [ ] API calls work from frontend
- [ ] Wallet connection works
- [ ] No errors in logs
- [ ] Services stay running

## Next Steps After Successful Deployment

1. [ ] Share URLs with team
2. [ ] Test all features
3. [ ] Create test campaigns
4. [ ] Monitor for 24 hours
5. [ ] Set up backups
6. [ ] Document any issues
7. [ ] Plan for scaling

## Quick Reference

### URLs to Save
- Backend: `https://adryx-backend.onrender.com`
- Frontend: `https://adryx-frontend.onrender.com`
- MongoDB: `mongodb+srv://...`
- Render Dashboard: `https://dashboard.render.com`

### Important Commands
```bash
# Generate JWT secret
openssl rand -base64 32

# Test backend
curl https://your-backend.onrender.com/api/v1/solana/info

# View logs
# Go to Render dashboard → Service → Logs

# Redeploy
# Go to Render dashboard → Service → Manual Deploy
```

## Support

If you get stuck:
1. Check `RENDER_QUICKSTART.md` for detailed steps
2. Review `RENDER_DEPLOYMENT.md` for troubleshooting
3. Check Render documentation: https://render.com/docs
4. Ask in Render community: https://community.render.com

---

**Estimated Total Time**: 40 minutes
**Difficulty**: Beginner-friendly
**Cost**: Free (with limitations) or $23/month (production)

Good luck! 🚀
