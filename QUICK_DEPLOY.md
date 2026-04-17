# 🚀 Quick Deployment Reference

## ⚡ 5-Minute Netlify Deploy

### **1. Push to GitHub**
```bash
git add .
git commit -m "Deploy to Netlify"
git push origin main
```

### **2. Netlify Setup**
1. Go to [netlify.com](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import project"**
3. Select your GitHub repo
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### **3. Environment Variables**
Go to: **Site settings** → **Environment variables**

Add:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_ENV=production
```

### **4. Deploy**
Click **"Deploy site"** → Wait 2-3 minutes → Done! 🎉

---

## 📝 Quick Checklist

✅ Code pushed to GitHub  
✅ Netlify site created  
✅ Build settings configured  
✅ Environment variables set  
✅ Site deployed  

---

## 🔗 Files That Make It Work

- `netlify.toml` - Build configuration
- `public/_redirects` - SPA routing
- `.env.example` - Environment template
- `src/config/api.config.ts` - API configuration

---

## 🐛 Quick Fixes

**Build fails?**
```bash
npm run build  # Test locally first
```

**Blank page?**
- Check environment variables in Netlify

**API not working?**
- Set `VITE_API_URL` in Netlify
- Configure CORS on backend

---

## 🎯 Done!

Your site is live at: `https://your-app.netlify.app`

**Next:** Deploy backend to Render and connect the APIs.
