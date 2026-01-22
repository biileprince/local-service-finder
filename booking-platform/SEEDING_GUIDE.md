# Database Seeding on Vercel

## Automatic Seeding via API Endpoint

An API endpoint has been created at `/api/seed` to seed the database after deployment.

### Setup

1. **Add SEED_SECRET to Vercel Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `SEED_SECRET=your-secure-random-secret-here`
   - Generate a secure secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Usage

#### Check if Database Needs Seeding

```bash
curl -X GET https://your-app.vercel.app/api/seed \
  -H "Authorization: Bearer your-seed-secret"
```

Response:
```json
{
  "seeded": false,
  "counts": {
    "providers": 0,
    "users": 0,
    "categories": 0
  }
}
```

#### Seed the Database

```bash
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Authorization: Bearer your-seed-secret"
```

Response:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "output": "..."
}
```

### After Every Deployment

Since SQLite data is ephemeral on Vercel, you need to reseed after each deployment:

```bash
# After deployment completes
curl -X POST https://your-production-url.vercel.app/api/seed \
  -H "Authorization: Bearer your-production-seed-secret"
```

### Automate Seeding with GitHub Actions (Optional)

Create `.github/workflows/seed-after-deploy.yml`:

```yaml
name: Seed Database After Deploy

on:
  deployment_status:

jobs:
  seed:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: Seed Database
        run: |
          curl -X POST ${{ secrets.VERCEL_URL }}/api/seed \
            -H "Authorization: Bearer ${{ secrets.SEED_SECRET }}"
```

Add secrets to GitHub:
- `VERCEL_URL` - Your Vercel deployment URL
- `SEED_SECRET` - Same as in Vercel environment variables

### Security Notes

- ⚠️ **NEVER** commit your production `SEED_SECRET` to git
- Use different secrets for development and production
- The endpoint is protected with Bearer token authentication
- Limit access to the seed endpoint in production

### For Production with PostgreSQL

When you migrate to PostgreSQL for production:

1. Run migrations first:
```bash
DATABASE_URL="your-postgres-url" npx prisma migrate deploy
```

2. Then seed:
```bash
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Authorization: Bearer your-seed-secret"
```

### Local Testing

Test the endpoint locally:

```bash
# Start dev server
npm run dev

# In another terminal, seed via API
curl -X POST http://localhost:3000/api/seed \
  -H "Authorization: Bearer dev-seed-secret"
```
