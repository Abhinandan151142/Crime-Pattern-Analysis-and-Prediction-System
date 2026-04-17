# ✅ Render Deployment Checklist

Use this checklist to ensure successful deployment.

---

## 📋 Pre-Deployment Checklist

### Code Requirements
- ✅ `package.json` has `"start": "node server.js"`
- ✅ `server.js` uses `process.env.PORT || 3000`
- ✅ `server.js` binds to `0.0.0.0`
- ✅ CORS is enabled
- ✅ `/health` endpoint exists
- ✅ Database uses environment variables
- ✅ No hardcoded credentials
- ✅ No local file paths
- ✅ `.gitignore` excludes `.env`
- ✅ Error handling implemented
- ✅ Graceful shutdown configured

### Database
- ✅ MySQL database created
- ✅ Connection credentials ready
- ✅ Database schema applied
- ✅ Sample data inserted (optional)

### GitHub
- ✅ Code pushed to GitHub
- ✅ Repository is accessible
- ✅ `.env` is NOT committed

---

## 🌐 Deployment Steps

### 1. Create Web Service
- [ ] Login to Render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Select correct repository

### 2. Configure Service
- [ ] **Name**: `crime-analytics-api`
- [ ] **Environment**: `Node`
- [ ] **Region**: Select closest region
- [ ] **Branch**: `main`
- [ ] **Root Directory**: Leave empty (or `backend` if subfolder)
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`

### 3. Set Environment Variables
Add these in Render dashboard:

- [ ] `PORT` = `3000`
- [ ] `NODE_ENV` = `production`
- [ ] `DB_HOST` = `your-mysql-host`
- [ ] `DB_USER` = `your-db-user`
- [ ] `DB_PASSWORD` = `your-db-password`
- [ ] `DB_NAME` = `crime_analysis_db`
- [ ] `DB_PORT` = `3306`
- [ ] `CORS_ORIGIN` = `*` (or your frontend URL)

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Check logs for "Server running on port 3000"
- [ ] Check logs for "Database connected successfully"

---

## 🧪 Post-Deployment Verification

### Test Endpoints

#### 1. Health Check
```bash
curl https://YOUR-APP.onrender.com/health
```
Expected:
```json
{"status":"OK","message":"Crime Analytics API is running"}
```

#### 2. Root Endpoint
```bash
curl https://YOUR-APP.onrender.com/
```
Expected: API information JSON

#### 3. Crimes Endpoint
```bash
curl https://YOUR-APP.onrender.com/api/crimes
```
Expected: Array of crimes (or empty array)

#### 4. Dashboard Summary
```bash
curl https://YOUR-APP.onrender.com/api/dashboard/summary
```
Expected: Statistics object

### Check Logs
- [ ] No error messages
- [ ] "Database connected successfully" appears
- [ ] "Server running on port XXXX" appears
- [ ] No uncaught exceptions

---

## 🐛 Troubleshooting

### Build Failed
**Problem**: Deployment fails during build  
**Solution**:
- Check `package.json` syntax
- Ensure all dependencies are listed
- Check Node version compatibility

### Database Connection Error
**Problem**: "Database connection failed"  
**Solution**:
- Verify DB credentials in environment variables
- Check database is accessible externally
- Verify IP whitelist settings
- Test connection from local machine

### Server Not Starting
**Problem**: "Application failed to respond"  
**Solution**:
- Ensure `process.env.PORT` is used
- Check start command is `npm start`
- Look for errors in logs
- Verify no syntax errors in `server.js`

### CORS Errors
**Problem**: Frontend can't access API  
**Solution**:
- Set `CORS_ORIGIN` to `*` or specific frontend URL
- Verify CORS middleware is applied before routes
- Check browser console for specific error

### 502 Bad Gateway
**Problem**: Initial requests fail  
**Solution**:
- Wait 1-2 minutes for server to fully start
- Free tier has cold starts (~30 seconds)
- Check logs for actual errors

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push
- [ ] Connected to GitHub ✅
- [ ] Auto-deploy enabled ✅
- [ ] Every push to `main` triggers deployment

### Manual Deploy
- [ ] Can trigger manual deploy from Render dashboard
- [ ] Can rollback to previous deployment

---

## 📊 Monitoring

### What to Monitor
- [ ] Check logs daily for errors
- [ ] Monitor response times
- [ ] Check database connection health
- [ ] Monitor API usage

### Render Dashboard
- [ ] Access at: `https://dashboard.render.com`
- [ ] View logs: Click on service → "Logs" tab
- [ ] View metrics: "Metrics" tab
- [ ] View events: "Events" tab

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ `/health` returns `{"status":"OK"}`
- ✅ Database connection log appears
- ✅ No errors in logs
- ✅ API endpoints return data
- ✅ Frontend can connect successfully
- ✅ Socket.IO connections work
- ✅ Real-time updates function

---

## 🎉 Deployment Complete!

### Your Live URLs:
- **API**: `https://YOUR-APP.onrender.com`
- **Health**: `https://YOUR-APP.onrender.com/health`
- **Docs**: `https://YOUR-APP.onrender.com/`

### Next Steps:
1. ✅ Update frontend `.env` with API URL
2. ✅ Test all features end-to-end
3. ✅ Share with team/recruiters
4. ✅ Add to portfolio/resume

---

## 📝 Notes

### Free Tier Limitations:
- Server spins down after 15 min inactivity
- First request after sleep: ~30 seconds
- 750 hours/month free

### Upgrade Benefits ($7/month):
- Always-on (no spin down)
- Faster performance
- More resources

### Tips:
- Use cron job to keep server alive
- Monitor using UptimeRobot (free)
- Check logs regularly

---

**Need Help?**
- Render Docs: https://render.com/docs
- Backend README: `README.md`
- Deployment Guide: `DEPLOYMENT.md`
