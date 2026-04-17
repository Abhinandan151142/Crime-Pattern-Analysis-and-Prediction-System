# 🚀 Deployment Guide - Render.com

Complete guide to deploy the Crime Analysis Dashboard backend on Render.

## 📋 Prerequisites

1. GitHub account
2. Render account (free tier works)
3. MySQL database (you can use Render's managed MySQL or external service)

## 🗄️ Step 1: Database Setup

### Option A: Use Render PostgreSQL (Free)
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: `crime-analytics-db`
3. Note down the connection details

### Option B: Use External MySQL (Recommended)
Use services like:
- **Railway** (Free MySQL)
- **PlanetScale** (Free MySQL)
- **Aiven** (Free MySQL)

Get your connection details:
- Host
- Username
- Password
- Database name
- Port (usually 3306)

## 📤 Step 2: Push Code to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 🌐 Step 3: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:

### Build & Deploy Settings:
- **Name**: `crime-analytics-api`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend` (if backend is in subfolder)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Environment Variables:
Add these in Render dashboard:

```
DB_HOST=your-mysql-host.com
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=crime_analysis_db
DB_PORT=3306
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
```

5. Click "Create Web Service"

## ⏳ Step 4: Wait for Deployment

Render will:
1. Clone your repository
2. Install dependencies
3. Start your server
4. Provide you with a URL like: `https://crime-analytics-api.onrender.com`

## ✅ Step 5: Verify Deployment

Test your API:

```bash
# Health check
curl https://YOUR-RENDER-URL.onrender.com/health

# Expected response:
# {"status":"OK","message":"Crime Analytics API is running","timestamp":"2024-XX-XX..."}
```

## 🔧 Step 6: Setup Database Tables

1. Connect to your MySQL database using a client (MySQL Workbench, DBeaver, etc.)
2. Run the SQL script from `database/schema.sql`
3. Verify tables are created

## 🎯 Step 7: Update Frontend

In your frontend `.env` file:

```env
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com
```

Update `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## 🐛 Troubleshooting

### Deployment fails:
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `package.json` has correct start script

### Database connection fails:
- Verify DB credentials in environment variables
- Check if database allows external connections
- Verify IP whitelist (if applicable)

### 502 Bad Gateway:
- Server might be starting up (wait 1-2 minutes)
- Check if PORT is using `process.env.PORT`

### CORS errors:
- Set `CORS_ORIGIN` to your frontend URL
- Or use `*` to allow all origins (development only)

## 🔄 Updating Your Deployment

Just push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push
```

Render will automatically redeploy!

## 💡 Tips

1. **Free tier limitations**: 
   - Server spins down after 15 min of inactivity
   - First request after sleep takes ~30 seconds

2. **Keep it alive**:
   - Use a cron job to ping `/health` every 10 minutes
   - Or upgrade to paid plan ($7/month for always-on)

3. **Logs**:
   - Access logs in Render dashboard → "Logs" tab
   - Use for debugging

4. **Environment variables**:
   - Never commit `.env` file
   - Always use Render's environment variables section

## 🎉 Success!

Your backend is now live at:
```
https://YOUR-APP-NAME.onrender.com
```

API endpoints:
- `GET /health`
- `GET /api/crimes`
- `GET /api/dashboard/summary`
- `GET /api/predictions/hotspots`
- And all others!

## 📱 Connect Frontend

Update frontend to point to your Render URL and you're done! 🚀
