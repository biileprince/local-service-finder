# Local Service Finder

A modern booking platform for local service providers built with Next.js 16, React 19, and Prisma.

## Features

- 🔍 Browse and search local service providers
- 📅 Book appointments with real-time availability
- 👤 User authentication (customers and providers)
- 📊 Provider dashboard for managing bookings
- ⭐ Ratings and reviews
- 📱 Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: Next.js 16.1.4, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development)
- **Authentication**: JWT with bcrypt
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/biileprince/local-service-finder.git
cd local-service-finder/booking-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate Prisma client and seed database:
```bash
npx prisma generate
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Test Accounts

After seeding the database, you can use these accounts:

- **Customer**: john@example.com / Password123
- **Provider**: mary.cleaner@example.com / Password123
- **Admin**: admin@localservice.com / Password123

## Project Structure

```
booking-platform/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── bookings/        # Bookings page
│   ├── dashboard/       # Provider dashboard
│   ├── login/           # Authentication pages
│   └── provider/        # Provider profile pages
├── components/          # React components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── prisma/             # Database schema and migrations
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## License

MIT

## Author

Biile Prince
```