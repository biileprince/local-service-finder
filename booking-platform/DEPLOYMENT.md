# Deployment Guide

## After Deploying to Vercel

### 1. Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://neondb_owner:npg_3qEHRFQz6Kun@ep-plain-star-ah9u2b5j-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRES_IN=7d
SEED_SECRET=your-seed-secret-here
```

Apply to: Production, Preview, Development

### 2. Seed the Database

After deployment, you need to seed the database **once**. You have two options:

#### Option A: Use the Seed API Endpoint (Recommended)

```bash
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Authorization: Bearer your-seed-secret-here"
```

Replace:
- `your-app.vercel.app` with your actual Vercel URL
- `your-seed-secret-here` with the SEED_SECRET from your environment variables

#### Option B: Seed Locally (if Option A fails)

```bash
# From your local machine
cd booking-platform
npm run db:seed
```

This will seed the production database from your local environment.

### 3. Verify Data

Visit your deployed site:
- Homepage should show categories and featured providers
- `/search` page should list all providers
- Test creating an account and logging in

### Troubleshooting

If data still doesn't show:

1. **Check Vercel build logs** for any errors during deployment
2. **Verify DATABASE_URL** is correctly set in Vercel environment variables
3. **Check function logs** in Vercel dashboard for runtime errors
4. **Re-run migrations**: Use `npx prisma migrate deploy` in Vercel CLI or locally with production DATABASE_URL
5. **Manually seed**: Run the seed endpoint or seed script as described above

### Common Issues

- **"Can't reach database"**: DATABASE_URL not set in Vercel or incorrect format
- **"Page not found"**: Build failed, check Vercel build logs
- **"Empty data"**: Database not seeded, run the seed endpoint
- **"404 on API routes"**: Make sure all files are committed and pushed to GitHub
