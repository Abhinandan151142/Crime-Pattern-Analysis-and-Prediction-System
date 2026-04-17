# Netlify Deployment Guide

## 📋 Pre-Deployment Checklist

✅ Build script configured (`vite build`)  
✅ Environment variables template created (`.env.example`)  
✅ API calls use environment variables  
✅ SPA routing configured (`_redirects` file)  
✅ Console logs removed (production mode)  
✅ No hardcoded localhost URLs  

---

## 🚀 Deployment Steps

### **Step 1: Prepare Your Repository**

1. Push your code to GitHub:
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### **Step 2: Connect to Netlify**

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your repository
5. Configure build settings:

   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### **Step 3: Set Environment Variables**

In Netlify dashboard, go to:
**Site settings** → **Environment variables** → **Add a variable**

Add these variables:

```
VITE_API_URL=https://your-backend-api.onrender.com/api
VITE_SOCKET_URL=https://your-backend-api.onrender.com
VITE_ENV=production
```

**Replace** `your-backend-api.onrender.com` with your actual backend URL.

### **Step 4: Deploy**

1. Click **"Deploy site"**
2. Wait for build to complete (~2-3 minutes)
3. Your site will be live at: `https://random-name.netlify.app`

### **Step 5: Custom Domain (Optional)**

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

---

## 🔧 Local Testing Before Deployment

Test the production build locally:

```bash
# Create .env file
cp .env.example .env

# Edit .env with your backend URL
# VITE_API_URL=http://localhost:3000/api

# Build the project
npm run build

# Preview the build
npm run preview
```

Visit: `http://localhost:4173`

---

## 📝 Important Notes

### **Environment Variables**
- All environment variables MUST start with `VITE_` to be accessible in the frontend
- Set them in Netlify dashboard, not in code
- They are embedded at build time, not runtime

### **API URLs**
- In development: uses `http://localhost:3000/api`
- In production: uses the URL from `VITE_API_URL` environment variable
- Make sure your backend has CORS configured to allow your Netlify domain

### **Routing**
- The `_redirects` file ensures all routes work (Dashboard, Predictions, Reports, Settings)
- Do NOT remove the `_redirects` file

### **Build Errors**
If build fails:
1. Check Netlify build logs
2. Verify all dependencies are in `package.json`
3. Ensure TypeScript has no errors
4. Test build locally first

---

## 🔄 Continuous Deployment

Netlify automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Netlify will auto-deploy
```

---

## 🌐 Backend Connection

### **Configure Backend CORS**

Your Node.js backend needs to allow your Netlify domain:

```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Local development
    'https://your-app.netlify.app'     // Production
  ],
  credentials: true
}));
```

### **Environment Variables in Backend**

Set these in Render (backend platform):
- `FRONTEND_URL=https://your-app.netlify.app`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, etc.

---

## 🐛 Troubleshooting

### **Issue: Blank page after deployment**
**Solution**: Check browser console for errors. Likely missing environment variables.

### **Issue: 404 on refresh**
**Solution**: Ensure `_redirects` file exists in `public/` folder.

### **Issue: API calls failing**
**Solution**: 
- Check `VITE_API_URL` is set correctly
- Verify backend CORS configuration
- Check backend is running and accessible

### **Issue: Build fails**
**Solution**:
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are installed

---

## 📊 Performance Optimization

Netlify automatically provides:
- ✅ Global CDN
- ✅ HTTP/2
- ✅ Gzip compression
- ✅ Asset caching
- ✅ Instant rollbacks

---

## 🔐 Security Headers

Configured in `netlify.toml`:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Site loads successfully
- [ ] All routes work (Dashboard, Predictions, Reports, Settings)
- [ ] API calls work (when backend is ready)
- [ ] Socket.IO connects (when backend is ready)
- [ ] Theme persists after refresh
- [ ] Settings save to localStorage
- [ ] Export functions work (CSV, PDF)
- [ ] Maps render correctly
- [ ] Charts display data

---

## 🎉 You're Done!

Your Crime Analytics Dashboard is now live on Netlify!

**Share your demo:** `https://your-app.netlify.app`

---

## 📞 Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console
3. Review this guide
4. Check Netlify community forums

---

**Created by:** Crime Analytics Team  
**Last Updated:** 2024
