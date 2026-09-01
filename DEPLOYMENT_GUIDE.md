# 🚀 AquaLink Free Deployment Guide

## Option 1: Deploy Frontend to Vercel (Recommended)

### Step 1: Push Code to GitHub
```bash
cd /workspace
git init
git add .
git commit -m "Ready for deployment"
# Create a new repo on GitHub, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy Frontend
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: Leave blank (frontend is in root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Click "Deploy"

### Step 3: Set Environment Variables in Vercel
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Option 2: Deploy Backend to Render (Free MongoDB Included)

### Step 1: Create MongoDB Atlas (Free)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string: `mongodb+srv://username:password@cluster...`

### Step 2: Deploy Backend to Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: aqualink-api
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   PORT=4000
   ```
6. Click "Create Web Service"

---

## Option 3: Deploy Both to Railway (Simplest)

### Railway Setup
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Railway will auto-detect frontend and backend
5. Add environment variables as needed

---

## Alternative: Netlify + Render

### Frontend on Netlify
1. Go to https://netlify.com
2. Drag & drop your `build` folder OR connect GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Add redirect rule in `public/_redirects`:
   ```
   /*  /index.html  200
   ```

### Backend on Render (as above)

---

## Post-Deployment Checklist

✅ Update `VITE_API_URL` in frontend to point to deployed backend
✅ Enable CORS for your frontend domain in backend
✅ Test all features: login, products, orders
✅ Monitor logs for errors
✅ Set up custom domain (optional)

---

## Quick Start Commands

```bash
# Build frontend
npm run build

# Test production build locally
npx serve -s build -l 3000

# Check backend health
curl http://localhost:4000/api/health
```

---

## Troubleshooting

**Frontend shows "Demo Mode":**
- Backend URL not set correctly in environment variables
- CORS issue - check backend CORS settings

**Backend won't start:**
- Check MongoDB connection string
- Verify all dependencies installed
- Check logs in hosting dashboard

**API calls fail:**
- Ensure `VITE_API_URL` is set
- Check browser console for CORS errors
- Verify backend is running

---

## Free Hosting Comparison

| Platform | Frontend | Backend | Database | Notes |
|----------|----------|---------|----------|-------|
| Vercel | ✅ Excellent | ⚠️ Serverless | ❌ | Best for React |
| Netlify | ✅ Excellent | ⚠️ Functions | ❌ | Easy setup |
| Render | ✅ Good | ✅ Excellent | ✅ Free Mongo | All-in-one |
| Railway | ✅ Good | ✅ Excellent | ✅ Add-on | Simple |
| Heroku | ⚠️ Limited Free | ⚠️ Paid | ❌ | Not recommended |

**Recommended Stack:** Vercel (Frontend) + Render (Backend + MongoDB)
