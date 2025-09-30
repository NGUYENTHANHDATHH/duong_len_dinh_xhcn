# Deployment Guide

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Local Development

1. Install dependencies:
```bash
npm install
cd server && npm install
```

2. Start development servers:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

## Production Deployment

### Option 1: Deploy to Render.com

1. Connect your repository to Render
2. Set up a Web Service with these settings:
   - Build Command: `cd server && npm run build`
   - Start Command: `cd server && npm start`
   - Environment: Node.js

3. Set environment variables in Render dashboard:
   - `NODE_ENV=production`
   - `VITE_SERVER_URL=https://your-app-name.onrender.com`

### Option 2: Deploy to Vercel/Netlify (Frontend) + Railway/Heroku (Backend)

#### Frontend (Vercel/Netlify):
1. Build command: `npm run build:prod`
2. Output directory: `dist`
3. Environment variables:
   - `VITE_SERVER_URL=https://your-backend-url.com`

#### Backend (Railway/Heroku):
1. Deploy the `server` folder
2. Build command: `npm run build`
3. Start command: `npm start`

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SERVER_URL=https://your-backend-url.com
GEMINI_API_KEY=your_api_key_here
```

## Build Commands

- `npm run build:prod` - Build for production
- `npm run start` - Start production server
- `cd server && npm run deploy` - Build frontend and start backend

## Troubleshooting

### Common Issues:

1. **Socket connection fails**: Check `VITE_SERVER_URL` environment variable
2. **Build fails**: Ensure all dependencies are installed
3. **Port conflicts**: Server uses `process.env.PORT` or defaults to 3001
4. **Static files not served**: Ensure `dist` folder exists after build

### Development vs Production:

- **Development**: Frontend on port 3000, backend on port 3001
- **Production**: Single server serves both frontend and backend
