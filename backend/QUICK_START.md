# ⚡ Quick Start Guide

Get your backend running in 5 minutes!

## 🚀 Local Development

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crime_analysis_db
```

### Step 3: Setup Database
Run `database/schema.sql` in your MySQL client:
```bash
mysql -u root -p < database/schema.sql
```

### Step 4: Start Server
```bash
npm run dev
```

✅ Server running at: `http://localhost:3000`

---

## 🌐 Render Deployment

### Step 1: Create MySQL Database
Use Railway, PlanetScale, or Aiven (all have free tiers)

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Backend ready"
git push origin main
```

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Set environment variables
5. Deploy!

### Step 4: Set Environment Variables in Render
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=crime_analysis_db
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
```

✅ Live at: `https://your-app.onrender.com`

---

## 🧪 Test Your API

### Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "message": "Crime Analytics API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Get Crimes
```bash
curl http://localhost:3000/api/crimes
```

### Dashboard Summary
```bash
curl http://localhost:3000/api/dashboard/summary
```

---

## 📝 Common Issues

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `.env`
- Check firewall/port 3306

### Port Already in Use
```bash
# Change PORT in .env to 3001 or 5000
```

### Cannot Find Module
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ You're Ready!

Backend is running successfully. Now:
1. Test API endpoints
2. Connect frontend
3. Deploy to production

**Need help?** Check `README.md` or `DEPLOYMENT.md`
