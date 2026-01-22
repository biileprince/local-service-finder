# PostgreSQL Setup for Vercel

## Quick Setup

### 1. Get a Free PostgreSQL Database

Choose one of these free options:

#### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the `POSTGRES_PRISMA_URL` connection string

#### Option B: Neon (Free tier)

1. Go to https://neon.tech/
2. Sign up and create a new project
3. Copy the connection string

#### Option C: Supabase (Free tier)

1. Go to https://supabase.com/
2. Create a new project
3. Go to Settings → Database → Connection string → URI
4. Copy the connection string

### 2. Add to Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   DATABASE_URL=your-postgres-connection-string-here
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=7d
   ```

### 3. Deploy

The deployment will:

- ✅ Generate Prisma client for PostgreSQL
- ✅ Build the app
- ✅ Seed the database automatically
- ✅ Deploy successfully

That's it! Your app will work with persistent PostgreSQL data.

## Important Notes

- ⚠️ **SQLite doesn't work on Vercel** - better-sqlite3 is a native addon that requires compilation
- ✅ **PostgreSQL is cloud-native** - works perfectly in serverless environments
- ✅ **Data persists** - unlike SQLite in /tmp, PostgreSQL data is permanent
- ✅ **Free tiers available** - all recommended providers have generous free tiers

## For Local Development

You can still use SQLite locally by switching `provider` in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"  // For local dev
  url      = "file:./dev.db"
}
```

Then run:

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

But for production/Vercel, always use PostgreSQL!
