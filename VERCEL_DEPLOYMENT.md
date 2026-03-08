# Vercel Serverless Deployment Guide

## Overview

Your DoneByVoice app is now configured to deploy **both frontend and backend** to Vercel as a single application using serverless functions.

## Architecture

- **Frontend**: Static Vite build served from `/dist/public`
- **Backend**: Serverless functions in `/api` directory
- **Database**: Supabase PostgreSQL (remote)

## Project Structure

```
/api/
├── index.ts       → GET /api (returns API status)
├── health.ts      → GET /api/health (health check)
├── waitlist.ts    → POST/GET /api/waitlist (waitlist operations)
└── referral.ts    → GET /api/referral (referral stats)

/server/          → Shared backend code (db, utils, middleware)
/client/          → Frontend React app
```

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Setup Vercel serverless backend"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`

### 3. Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production
```

**Important:**
- Copy these from your `.env` file
- Make sure to use the correct password and project ID
- Don't include `PORT` (Vercel handles this automatically)

### 4. Deploy

Click **"Deploy"** and wait for the build to complete!

Your app will be available at: `https://your-project.vercel.app`

## API Endpoints

Once deployed, your API will be available at:

- `https://your-project.vercel.app/api` → {"message": "doneByVoice API up"}
- `https://your-project.vercel.app/api/health` → Health check
- `https://your-project.vercel.app/api/waitlist` → Waitlist operations
- `https://your-project.vercel.app/api/referral` → Referral stats

## Testing Your Deployment

### Test API Root
```bash
curl https://your-project.vercel.app/api
# Expected: {"message":"doneByVoice API up"}
```

### Test Waitlist Signup
```bash
curl -X POST https://your-project.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Global Stats
```bash
curl https://your-project.vercel.app/api/waitlist?stats=global
```

## Local Development

You have **two options** for local development:

### Option 1: Using Express Server (Current Setup)

```bash
# Terminal 1 - Backend
pnpm dev:server    # Runs on http://localhost:3009

# Terminal 2 - Frontend
pnpm dev           # Runs on http://localhost:5173
```

The frontend will proxy API requests to `http://localhost:3009/api`

### Option 2: Using Vercel Dev (Recommended for Testing Serverless)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Run Vercel dev server (simulates serverless environment)
vercel dev
```

This will:
- Run serverless functions like in production
- Serve frontend
- Use environment variables from `.env`

## Environment Variables

### Local Development (.env)
```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
PORT=3009
NODE_ENV=development
```

### Production (Vercel Dashboard)
```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
NODE_ENV=production
```

## Differences from Express Setup

### What Changed?

1. **API Routes**
   - **Before**: Express routes in `/server/routes/*.ts`
   - **Now**: Serverless functions in `/api/*.ts`

2. **URL Structure**
   - **Before**: `/api/waitlist/:code` (path params)
   - **Now**: `/api/waitlist?code=XXX` (query params)

3. **Server**
   - **Before**: Long-running Express server
   - **Now**: Serverless functions (cold starts possible)

### What Stayed the Same?

- Database schema and connection
- Business logic
- Frontend React app
- Validation and error handling
- Shared utilities (`/server/db`, `/server/utils`)

## Troubleshooting

### Cold Starts

Serverless functions may have cold starts (1-2 seconds delay) on first request after inactivity.

**Solution**: Vercel Pro includes always-warm functions, or use a cron job to ping your API every 5 minutes.

### Environment Variables Not Working

1. Make sure variables are added in Vercel dashboard
2. Redeploy after adding new variables
3. Check deployment logs for errors

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Supabase connection pooler settings
3. Ensure Supabase project is not paused

### CORS Errors

CORS is configured in each serverless function. If you need to restrict origins:

```typescript
// In api/*.ts files
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

## Custom Domain

To add a custom domain:

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `donebyvoice.com`)
3. Update DNS records as instructed
4. SSL certificate is auto-generated

## Monitoring

View deployment logs and errors:
- **Vercel Dashboard** → Your Project → Deployments → Click deployment → View Logs
- **Runtime Logs** → Real-time function logs

## Rollback

If something goes wrong:
1. Go to Vercel Dashboard → Deployments
2. Find a working deployment
3. Click **"..." → "Promote to Production"**

## Performance Optimization

### Keep Functions Warm
```bash
# Create a cron job (using GitHub Actions, etc.)
*/5 * * * * curl https://your-project.vercel.app/api/health
```

### Database Connection Pooling
- Already configured to use Supabase pooler
- Optimal for serverless environments
- No additional configuration needed

## Cost

**Vercel Free Tier Includes:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- 100 serverless function executions/day

**Supabase Free Tier Includes:**
- 500MB database
- 5GB bandwidth
- 50,000 monthly active users

Perfect for MVP and early testing!

## Next Steps

1. ✅ Deploy to Vercel
2. 🧪 Test all endpoints
3. 📧 Set up email notifications (optional)
4. 📊 Add analytics (optional)
5. 🎨 Customize domain
6. 🚀 Share with users!

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Check deployment logs in Vercel dashboard
