# DoneByVoice Backend Setup Guide

## Prerequisites

- Node.js >= 22.0.0
- A Supabase account (https://supabase.com)
- pnpm package manager

## Supabase Setup

### 1. Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details and create the project

### 2. Get Your Database Credentials

1. In your Supabase project dashboard, click on the "Settings" icon (gear icon)
2. Navigate to "Database"
3. Under "Connection string", select "URI" and copy the connection string
4. Under "Connection pooling", you can also find your pooler connection string (recommended for production)

The connection string format looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Get Your Supabase API Keys

1. In "Settings" → "API"
2. Copy the "Project URL" (e.g., `https://xxxxx.supabase.co`)
3. Copy the "anon public" key

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:

```bash
# Database Configuration
DB_PASSWORD=your-supabase-password

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Database Migration

### Option 1: Using Drizzle Push (Recommended for Development)

This will automatically sync your schema with the database:

```bash
pnpm db:push
```

### Option 2: Using Migrations (Recommended for Production)

1. Generate migration files:
```bash
pnpm db:generate
```

2. Apply migrations:
```bash
pnpm db:migrate
```

## Running the Application

### Development Mode

Run both frontend and backend:

**Terminal 1 - Frontend (Vite dev server):**
```bash
pnpm dev
```

**Terminal 2 - Backend (API server):**
```bash
pnpm dev:server
```

The frontend will be available at `http://localhost:5173` (or similar)
The backend API will be available at `http://localhost:3000/api`

### Production Build

```bash
pnpm build:server
pnpm start
```

## API Endpoints

### Waitlist Endpoints

- `POST /api/waitlist` - Join the waitlist
  ```json
  {
    "email": "user@example.com",
    "referredBy": "VOICEABC123" // optional
  }
  ```

- `GET /api/waitlist/:code` - Get user info by referral code

- `GET /api/waitlist/stats/global` - Get global statistics

### Referral Endpoints

- `GET /api/referral/:code/stats` - Get referral statistics for a code

- `GET /api/referral/:code/list` - Get list of referrals for a code

### Health Check

- `GET /api/health` - Check API status

## Database Studio (Optional)

To view and edit your database with Drizzle Studio:

```bash
pnpm db:studio
```

This will open a web interface at `https://local.drizzle.studio`

## Troubleshooting

### Connection Issues

If you can't connect to the database:
1. Verify your `DATABASE_URL` is correct
2. Check that your IP is allowed in Supabase (Settings → Database → Connection pooling)
3. Try using the connection pooler URL instead

### Migration Issues

If migrations fail:
1. Make sure your database is accessible
2. Check that the schema hasn't been modified manually
3. Try using `pnpm db:push` for development

### CORS Issues

If you get CORS errors:
- The backend has CORS enabled for all origins by default
- For production, update the CORS configuration in `server/index.ts`

## Project Structure

```
server/
├── db/
│   ├── schema.ts          # Database schema definitions
│   ├── index.ts           # Database connection
│   └── migrations/        # Migration files (auto-generated)
├── routes/
│   ├── waitlist.ts       # Waitlist API routes
│   └── referral.ts       # Referral API routes
├── middleware/
│   ├── validation.ts     # Request validation
│   └── errorHandler.ts   # Error handling
├── utils/
│   └── codeGenerator.ts  # Referral code generation
└── index.ts              # Main server file
```

## Next Steps

1. Test the email signup flow on your frontend
2. Verify referral tracking works correctly
3. Monitor the database using Drizzle Studio or Supabase dashboard
4. Set up email notifications (optional)
5. Configure production environment variables for deployment
