# Deploy Layover App to Railway

## Quick Deploy (5 minutes)

### 1. Prerequisites
- GitHub account
- Railway account (sign up at https://railway.app)

### 2. Push to GitHub

```bash
cd /Users/simeong/Desktop/Projects/layover-app

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Layover app with retro Southwest design"

# Create a new GitHub repo and push
# (Or connect to existing repo)
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3. Deploy on Railway

#### Option A: One-Click Deploy (Easiest)

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your `layover-app` repository
4. Railway will detect it's a monorepo

#### Option B: Manual Setup

1. **Create New Project** on Railway
2. **Add Redis Service**:
   - Click "+ New"
   - Select "Database" → "Redis"
   - Note the connection URL

3. **Deploy Backend**:
   - Click "+ New" → "GitHub Repo"
   - Select your repo
   - Set Root Directory: `backend`
   - Add environment variables:
     ```
     PORT=3001
     REDIS_URL=${{Redis.REDIS_URL}}
     NODE_ENV=production
     CORS_ORIGIN=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
     APP_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
     ```
   - Deploy!

4. **Deploy Frontend**:
   - Click "+ New" → "GitHub Repo"  
   - Select your repo again
   - Set Root Directory: `frontend`
   - Add environment variables:
     ```
     VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api
     VITE_SOCKET_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}
     ```
   - Deploy!

### 4. Get Your Public URL

After deployment:
- Backend: `https://layover-backend-production.up.railway.app`
- Frontend: `https://layover-frontend-production.up.railway.app`

Share the **frontend URL** with your friend! 🎉

## Environment Variables Summary

### Backend (.env)
```env
PORT=3001
REDIS_URL=${{Redis.REDIS_URL}}
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.railway.app
APP_URL=https://your-frontend-url.railway.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_SOCKET_URL=https://your-backend-url.railway.app
```

## Troubleshooting

### Backend won't start
- Check Redis is provisioned and connected
- Verify `REDIS_URL` environment variable is set

### Frontend can't connect to backend
- Update `CORS_ORIGIN` in backend to match frontend URL
- Check `VITE_API_URL` points to backend URL
- Redeploy both services after updating env vars

### WebSocket connection fails
- Ensure `VITE_SOCKET_URL` is set correctly
- Check backend allows WebSocket connections
- Verify no trailing slashes in URLs

## Cost
- Railway offers $5 free credit per month
- This app should run within free tier limits
- Redis and two services = ~$3-4/month usage

## Custom Domain (Optional)
1. Go to your frontend service settings
2. Click "Generate Domain" for free Railway subdomain
3. Or add your own custom domain

---

**Need help?** Check Railway docs: https://docs.railway.app
