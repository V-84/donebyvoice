# Quick Start Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Add environment variables (copy from `.env`):
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Click "Deploy"

**Done!** Your app will be live at `https://your-project.vercel.app`

---

## 💻 Local Development

### Option 1: Express Server (Current)
```bash
# Terminal 1 - Backend
pnpm dev:server

# Terminal 2 - Frontend
pnpm dev
```

### Option 2: Vercel Dev (Test Serverless Locally)
```bash
npm i -g vercel
vercel dev
```

---

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | API status |
| `/api/health` | GET | Health check |
| `/api/waitlist` | POST | Join waitlist |
| `/api/waitlist?code=XXX` | GET | Get user by code |
| `/api/waitlist?stats=global` | GET | Global stats |
| `/api/referral?code=XXX&stats=true` | GET | Referral stats |

---

## 🧪 Test API

```bash
# Test root endpoint
curl https://your-project.vercel.app/api

# Join waitlist
curl -X POST https://your-project.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Get stats
curl https://your-project.vercel.app/api/waitlist?stats=global
```

---

## 📁 Project Structure

```
/api/                    → Vercel serverless functions
  ├── index.ts          → GET /api
  ├── health.ts         → GET /api/health
  ├── waitlist.ts       → Waitlist operations
  └── referral.ts       → Referral stats

/server/                → Shared backend code
  ├── db/              → Database & schema
  ├── utils/           → Utilities
  └── middleware/      → Validation, errors

/client/               → React frontend
  └── src/
      ├── pages/       → Home.tsx
      └── lib/         → API client

vercel.json            → Vercel configuration
.env                   → Local environment variables
```

---

## 🔧 Common Commands

```bash
# Development
pnpm dev                 # Start frontend
pnpm dev:server          # Start Express backend

# Database
pnpm db:push            # Push schema to Supabase
pnpm db:studio          # Open database GUI

# Build
pnpm build              # Build frontend only
pnpm build:server       # Build frontend + backend

# Deploy
git push                # Auto-deploys to Vercel (if connected)
vercel deploy           # Manual deploy
```

---

## 📚 Documentation

- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Full deployment guide
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [SETUP.md](./SETUP.md) - General setup instructions

---

## ⚡ Quick Troubleshooting

### API not working locally?
```bash
# Check if Express server is running
curl http://localhost:3009/api
```

### Database connection issues?
1. Check `.env` has correct `DATABASE_URL`
2. Verify Supabase project is active
3. Run `pnpm db:push` to sync schema

### Deployment failing?
1. Check environment variables in Vercel
2. View deployment logs in Vercel dashboard
3. Make sure all dependencies are in `package.json`

---

**Ready to deploy? See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions!**
