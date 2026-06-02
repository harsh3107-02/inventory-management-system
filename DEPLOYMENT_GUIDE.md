# Deployment Guide

Complete step-by-step instructions for deploying the Inventory Management System.

## Prerequisites

- GitHub account
- Render account (free tier)
- Netlify account (free tier)
- Git installed locally

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - Name: `inventory-management-system` (or your preferred name)
   - Description: `Full-stack inventory and order management system`
   - Choose Public or Private
   - Do NOT initialize with README (we already have one)
   - Click "Create repository"

3. Copy the repository URL (e.g., `https://github.com/yourusername/inventory-management-system.git`)

### 1.2 Push Project to GitHub

```bash
cd e:\Project
git add .
git commit -m "Initial commit: Full-stack inventory management system"
git branch -M main
git remote add origin https://github.com/yourusername/inventory-management-system.git
git push -u origin main
```

After running these commands, your code will be on GitHub.

---

## Step 2: Deploy Backend to Render

### 2.1 Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Fill in the form:
   - **Name**: `inventory-db`
   - **Database**: `inventory`
   - **User**: `postgres`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click "Create Database"
5. Wait for database to be created (2-3 minutes)
6. Copy the **Internal Database URL** (looks like `postgresql://user:password@host:5432/dbname`)

### 2.2 Create Web Service for Backend

1. Click "New +" → "Web Service"
2. Select "Deploy from a Git repository"
3. Connect your GitHub account and select your repository
4. Fill in the form:
   - **Name**: `inventory-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r Backend/requirements.txt`
   - **Start Command**: `cd Backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. Click "Create Web Service"

### 2.3 Configure Environment Variables

1. In Render dashboard, open your `inventory-backend` service
2. Go to "Environment" tab
3. Add these environment variables:
   - **Key**: `DATABASE_URL`
     **Value**: `postgresql://postgres:[PASSWORD]@[HOST]/inventory`
     (Use the Internal Database URL from Step 2.1, but replace the host with your database's internal hostname)

4. Click "Save" and the service will redeploy
5. Wait for deployment to complete (5-10 minutes)
6. Note the URL (e.g., `https://inventory-backend.onrender.com`)

### 2.4 Test Backend Deployment

1. Visit `https://inventory-backend.onrender.com/docs` to see API documentation
2. Test the `/dashboard` endpoint by visiting the URL in your browser
3. You should see JSON response with dashboard data

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Build Frontend Locally

```bash
cd e:\Project\Frontend
npm install
npm run build
```

This creates a `dist` folder with production-ready files.

### 3.2 Deploy to Netlify

**Option A: Using Netlify Dashboard (Recommended)**

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub" and authorize
4. Choose your repository
5. Fill in deployment settings:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

6. Before clicking "Deploy", add environment variable:
   - Click "Advanced settings" → "New variable"
   - **Key**: `VITE_API_URL`
   - **Value**: `https://inventory-backend.onrender.com/api` (use your backend URL)

7. Click "Deploy site"
8. Wait for deployment to complete
9. Note the URL (e.g., `https://your-site-name.netlify.app`)

**Option B: Using Netlify CLI**

```bash
npm install -g netlify-cli
cd e:\Project
netlify login
netlify deploy --prod --dir Frontend/dist \
  --env VITE_API_URL=https://inventory-backend.onrender.com/api
```

### 3.3 Configure Production Environment

1. In Netlify dashboard, go to "Site settings" → "Build & deploy" → "Environment"
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://inventory-backend.onrender.com/api`

3. Trigger a rebuild by clicking "Trigger deploy"

---

## Step 4: Test the Deployment

1. **Open Frontend**: Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
2. **Test Dashboard**: Should load and show statistics
3. **Add a Product**:
   - Go to Products tab
   - Fill in: Name, SKU, Price, Quantity
   - Click "Add Product"
   - Product should appear in the list

4. **Add a Customer**:
   - Go to Customers tab
   - Fill in: Full name, Email, Phone
   - Click "Add Customer"
   - Customer should appear in the list

5. **Check Network**: Open Browser DevTools (F12) → Network tab
   - Verify API calls go to your backend URL
   - Check for any CORS errors

---

## Step 5: Final Deliverables

Collect and document:

1. **GitHub Repository URL**
   - Example: `https://github.com/yourusername/inventory-management-system`

2. **Backend API URL (Render)**
   - Example: `https://inventory-backend.onrender.com`
   - Test it: Visit `/docs` endpoint

3. **Frontend URL (Netlify)**
   - Example: `https://inventory-frontend.netlify.app`

4. **Docker Hub Image** (Optional)
   ```bash
   docker build -t yourusername/inventory-backend:latest ./Backend
   docker login
   docker push yourusername/inventory-backend:latest
   ```
   - URL: `https://hub.docker.com/r/yourusername/inventory-backend`

---

## Troubleshooting

### Frontend shows "Failed to fetch"
- **Solution**: Check that `VITE_API_URL` environment variable is set correctly in Netlify
- Verify backend URL is correct and accessible
- Check browser console for CORS errors

### Backend API returns 404
- **Solution**: Ensure routes have trailing slashes (e.g., `/api/products/` not `/api/products`)
- Check that Build Command and Start Command are correct in Render

### Database connection error on backend
- **Solution**: Verify `DATABASE_URL` in Render environment variables
- Make sure database has been fully created before deploying backend
- Check that the Internal Database URL format is correct

### Deployment hangs or fails
- **Solution**: Check Render/Netlify build logs for errors
- Ensure all files are committed and pushed to GitHub
- Try triggering a manual rebuild

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [React/Vite Deployment Guide](https://vitejs.dev/guide/build.html)

---

## Support

If you encounter issues:
1. Check the logs in Render/Netlify dashboard
2. Review this guide's troubleshooting section
3. Check the main README.md for local development setup
