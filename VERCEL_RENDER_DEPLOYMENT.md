# Vercel + Render Deployment Guide

## 🚀 Step-by-Step Deployment

### Step 1: Deploy Backend to Render

1. **Go to [render.com](https://render.com) and sign up/login**

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose your repository

3. **Configure Render Settings:**
   ```
   Name: olympia-backend (or your preferred name)
   Root Directory: server
   Environment: Node
   Build Command: npm run build
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   - Go to Environment tab
   - Add: `NODE_ENV` = `production`
   - `PORT` is set automatically by Render

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the URL (e.g., `https://olympia-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com) and sign up/login**

2. **Import Project:**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Vercel Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build:prod
   Output Directory: dist
   ```

4. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_SERVER_URL` = `https://your-render-backend-url.onrender.com`
   - (Use the URL from Step 1)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at the Vercel URL

## 🔧 Configuration Files

### vercel.json (Already created)
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_SERVER_URL": "@vite_server_url"
  }
}
```

## 🌐 URLs After Deployment

- **Frontend (Vercel):** `https://your-app-name.vercel.app`
- **Backend (Render):** `https://your-backend-name.onrender.com`

## 🔍 Troubleshooting

### Common Issues:

1. **Socket Connection Fails:**
   - Check `VITE_SERVER_URL` in Vercel environment variables
   - Ensure it matches your Render backend URL exactly

2. **Build Fails on Vercel:**
   - Check that `npm run build:prod` works locally
   - Ensure all dependencies are in `package.json`

3. **Build Fails on Render:**
   - Check that `npm run build` works in the `server` directory
   - Ensure `server/package.json` has the correct scripts

4. **CORS Issues:**
   - Render backend is configured to allow all origins
   - If issues persist, check the CORS settings in `server/server.js`

### Testing Locally:

```bash
# Test frontend with production backend
VITE_SERVER_URL=https://your-backend.onrender.com npm run dev

# Test backend locally
cd server && npm start
```

## 📝 Environment Variables Summary

### Vercel (Frontend):
- `VITE_SERVER_URL` = `https://your-backend.onrender.com`

### Render (Backend):
- `NODE_ENV` = `production`
- `PORT` = (automatically set by Render)

## 🎯 Next Steps After Deployment

1. Test the connection between frontend and backend
2. Verify socket.io connections work
3. Test all game functionality
4. Set up custom domains if needed
5. Configure SSL certificates (handled automatically by both platforms)
