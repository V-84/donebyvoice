# Supabase Database Setup Guide

## Step 1: Create a Supabase Account & Project

1. Go to **https://app.supabase.com**
2. Sign up or log in with GitHub
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: `donebyvoice` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to initialize

## Step 2: Get Your Database Connection String

### Option A: Using the Default Postgres Database (Recommended)

Supabase provides a default `postgres` database that you can use. This is the simplest approach:

1. In your Supabase project dashboard, click **"Settings"** (gear icon in the bottom left)
2. Navigate to **"Database"**
3. Scroll down to the **"Connection string"** section
4. Select **"URI"** tab
5. You'll see a connection string like:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Important**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 1

### Option B: Create a Custom Database (Optional)

If you want a separate database instead of using the default `postgres`:

1. In Supabase dashboard, go to **"SQL Editor"**
2. Click **"New query"**
3. Run this SQL command:
   ```sql
   CREATE DATABASE donebyvoice;
   ```
4. Then modify your connection string to use `donebyvoice` instead of `postgres`:
   ```
   postgresql://postgres.xxxxxxxxxxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/donebyvoice
   ```

**Note**: For most use cases, using the default `postgres` database is perfectly fine and recommended.

## Step 3: Get Your Supabase API Credentials

1. In your Supabase project, go to **"Settings"** → **"API"**
2. You'll find:
   - **Project URL**: Copy this (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **API Keys** section:
     - Copy the **"anon public"** key (this is safe to use in frontend)

## Step 4: Update Your .env File

Open your `.env` file and update it with the credentials from above:

```bash
# Database Configuration
DB_PASSWORD=YOUR_SUPABASE_DATABASE_PASSWORD

# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key-here
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Important Notes:
- Replace `YOUR_PASSWORD` in the `DATABASE_URL` with your actual database password
- Replace `xxxxxxxxxxxxx` with your actual project reference ID
- Don't commit this file to git (it's already in .gitignore)

## Step 5: Push Your Schema to Supabase

Now that your database connection is configured, push your schema:

```bash
pnpm db:push
```

You should see output like:
```
✅ Tables created successfully
  - waitlist_users
  - referrals
```

## Step 6: Verify Your Database

### Option 1: Using Drizzle Studio (Easiest)

```bash
pnpm db:studio
```

This opens a web interface at `https://local.drizzle.studio` where you can:
- View your tables
- See data in real-time
- Run queries
- Edit records

### Option 2: Using Supabase Dashboard

1. In Supabase dashboard, go to **"Table Editor"**
2. You should see your tables:
   - `waitlist_users`
   - `referrals`
3. Click on each table to view structure and data

### Option 3: Using SQL Editor

1. In Supabase dashboard, go to **"SQL Editor"**
2. Run a test query:
   ```sql
   SELECT * FROM waitlist_users;
   SELECT * FROM referrals;
   ```

## Connection String Formats Explained

Supabase provides two types of connection strings:

### 1. Direct Connection (Session Mode)
```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```
- Use for: Direct database access, migrations
- Port: 5432
- Best for: Development, migrations, admin tasks

### 2. Connection Pooler (Transaction Mode)
```
postgresql://postgres:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
- Use for: Production applications
- Port: 6543
- Best for: Serverless environments, high concurrency

**For this project**, either will work, but the **pooler** is recommended for production.

## Troubleshooting

### "Connection refused" or "Connection timeout"
- Check your internet connection
- Verify the DATABASE_URL is correct
- Check if your IP is blocked (Supabase usually allows all IPs by default)

### "Password authentication failed"
- Double-check your database password
- Make sure you're using the password from Step 1, not an API key
- The password in DATABASE_URL must be URL-encoded if it contains special characters

### "Database does not exist"
- Make sure you're using `postgres` in the connection string (or your custom DB name)
- If you created a custom database, verify it exists in SQL Editor

### "SSL connection required"
- Supabase requires SSL by default
- The `postgres` driver handles this automatically
- If issues persist, add `?sslmode=require` to your DATABASE_URL

## Security Best Practices

1. ✅ Never commit `.env` to git (already in .gitignore)
2. ✅ Use environment variables for all credentials
3. ✅ Use the `anon` key for frontend (it's safe and has RLS protection)
4. ✅ Use the `service_role` key only in backend (never expose to frontend)
5. ✅ Enable Row Level Security (RLS) for production (optional for this project)

## Next Steps

Once your database is set up:

1. Start the backend server:
   ```bash
   pnpm dev:server
   ```

2. Start the frontend:
   ```bash
   pnpm dev
   ```

3. Test the email signup flow!

## Quick Reference

| What you need | Where to find it |
|--------------|------------------|
| Database Password | Created when you made the project |
| Project URL | Settings → API → Project URL |
| Anon Key | Settings → API → Project API keys |
| Connection String | Settings → Database → Connection string |
| View Tables | Table Editor (left sidebar) |
| Run SQL | SQL Editor (left sidebar) |

---

**Still stuck?** Check the official Supabase docs: https://supabase.com/docs/guides/database
