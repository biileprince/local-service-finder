import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
};

type ProviderSeed = {
  key: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  bio: string;
  yearsExperience: number;
  verified: boolean;
  featured: boolean;
  categories: string[];
  specialties: string[];
};

const CATEGORY_SEEDS: CategorySeed[] = [
  {
    name: "Plumbing",
    slug: "plumbing",
    description: "Pipe repairs, leak fixes, and water system installation",
    icon: "Wrench",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Electrical",
    slug: "electrical",
    description: "House wiring, meter upgrades, and fault fixing",
    icon: "Zap",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    name: "Cleaning",
    slug: "cleaning",
    description: "Home, office, and post-construction cleaning",
    icon: "Sparkles",
    color: "bg-green-50 text-green-600",
  },
  {
    name: "Carpentry",
    slug: "carpentry",
    description: "Furniture, doors, roofing frames, and repairs",
    icon: "Hammer",
    color: "bg-amber-50 text-amber-600",
  },
  {
    name: "AC and Cooling",
    slug: "ac-and-cooling",
    description: "Air-conditioner installation and maintenance",
    icon: "Wind",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Painting",
    slug: "painting",
    description: "Interior and exterior painting services",
    icon: "Paintbrush",
    color: "bg-orange-50 text-orange-600",
  },
  {
    name: "Roofing",
    slug: "roofing",
    description: "Roof repairs, leak control, and replacements",
    icon: "Home",
    color: "bg-red-50 text-red-600",
  },
  {
    name: "Landscaping",
    slug: "landscaping",
    description: "Garden setup, lawn trimming, and compound care",
    icon: "Leaf",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Auto Mechanic",
    slug: "auto-mechanic",
    description: "Car diagnostics, servicing, and repairs",
    icon: "Car",
    color: "bg-slate-50 text-slate-700",
  },
  {
    name: "Pest Control",
    slug: "pest-control",
    description: "Fumigation and pest prevention for homes and shops",
    icon: "Shield",
    color: "bg-lime-50 text-lime-700",
  },
  {
    name: "Water Delivery",
    slug: "water-delivery",
    description: "Borehole and tanker water delivery services",
    icon: "Droplet",
    color: "bg-sky-50 text-sky-600",
  },
  {
    name: "Pet Care",
    slug: "pet-care",
    description: "Pet grooming, walking, and wellness support",
    icon: "Dog",
    color: "bg-pink-50 text-pink-600",
  },
];

const PROVIDER_SEEDS: ProviderSeed[] = [
  {
    key: "kwesi-plumbing",
    email: "kwesi.plumbing@localservicefinder.gh",
    name: "Kwesi Plumbing Works",
    phone: "+233244100111",
    location: "Cape Coast, Ghana",
    bio: "Reliable plumbing team for homes and hostels in Cape Coast.",
    yearsExperience: 9,
    verified: true,
    featured: true,
    categories: ["plumbing"],
    specialties: ["Leak repair", "Pipe replacement", "Water heater setup"],
  },
  {
    key: "adjoa-electrical",
    email: "adjoa.electrical@localservicefinder.gh",
    name: "Adjoa Electrical Services",
    phone: "+233500220333",
    location: "Accra, Ghana",
    bio: "Certified electrical technician focused on safe home wiring.",
    yearsExperience: 11,
    verified: true,
    featured: true,
    categories: ["electrical"],
    specialties: ["Fault tracing", "DB board replacement", "Socket installation"],
  },
  {
    key: "mensah-cleaning",
    email: "mensah.cleaning@localservicefinder.gh",
    name: "Mensah Deep Cleaning",
    phone: "+233554330444",
    location: "Kumasi, Ghana",
    bio: "Professional deep cleaning for apartments, shops, and offices.",
    yearsExperience: 6,
    verified: true,
    featured: false,
    categories: ["cleaning"],
    specialties: ["Move-out cleaning", "Office cleaning", "Sofa cleaning"],
  },
  {
    key: "boateng-carpentry",
    email: "boateng.carpentry@localservicefinder.gh",
    name: "Boateng Carpentry",
    phone: "+233244998876",
    location: "Takoradi, Ghana",
    bio: "Custom carpentry and woodwork with strong finishing quality.",
    yearsExperience: 14,
    verified: true,
    featured: false,
    categories: ["carpentry", "roofing"],
    specialties: ["Kitchen cabinets", "Wardrobes", "Roof wood framing"],
  },
  {
    key: "ecco-cooling",
    email: "ecco.cooling@localservicefinder.gh",
    name: "Ecco AC and Cooling",
    phone: "+233200115577",
    location: "Kasoa, Ghana",
    bio: "Air-conditioner installation and servicing for homes and offices.",
    yearsExperience: 8,
    verified: true,
    featured: true,
    categories: ["ac-and-cooling"],
    specialties: ["AC installation", "Gas refill", "Routine maintenance"],
  },
  {
    key: "awuku-painting",
    email: "awuku.painting@localservicefinder.gh",
    name: "Awuku Paint and Decor",
    phone: "+233245556788",
    location: "Cape Coast, Ghana",
    bio: "Affordable interior and exterior painting for modern homes.",
    yearsExperience: 10,
    verified: true,
    featured: false,
    categories: ["painting"],
    specialties: ["Wall putty", "Exterior repaint", "Color consultation"],
  },
  {
    key: "kobby-fumi",
    email: "kobby.fumigation@localservicefinder.gh",
    name: "Kobby Fumigation",
    phone: "+233558120908",
    location: "Accra, Ghana",
    bio: "Safe fumigation and pest control for homes and businesses.",
    yearsExperience: 7,
    verified: true,
    featured: false,
    categories: ["pest-control"],
    specialties: ["Cockroach control", "Bedbug treatment", "Rodent control"],
  },
  {
    key: "nana-water",
    email: "nana.water@localservicefinder.gh",
    name: "Nana Water Delivery",
    phone: "+233541110909",
    location: "Cape Coast, Ghana",
    bio: "Fast water tanker and household water delivery service.",
    yearsExperience: 5,
    verified: true,
    featured: false,
    categories: ["water-delivery"],
    specialties: ["Tanker dispatch", "Bulk delivery", "Emergency supply"],
  },
];

const CUSTOMER_SEEDS = [
  {
    key: "ama",
    email: "ama.boakye@example.com",
    name: "Ama Boakye",
    phone: "+233555902675",
  },
  {
    key: "kojo",
    email: "kojo.owusu@example.com",
    name: "Kojo Owusu",
    phone: "+233241234567",
  },
  {
    key: "efua",
    email: "efua.ansah@example.com",
    name: "Efua Ansah",
    phone: "+233208888444",
  },
  {
    key: "yaw",
    email: "yaw.mensimah@example.com",
    name: "Yaw Mensimah",
    phone: "+233274445556",
  },
];

function dateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

async function main() {
  console.log("Starting Ghana-focused database seed...");
  console.log(`Database: PostgreSQL`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.providerSpecialty.deleteMany();
  await prisma.providerCategory.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared previous data");

  const categories = await Promise.all(
    CATEGORY_SEEDS.map((category) => prisma.category.create({ data: category })),
  );
  const categoriesBySlug = new Map(categories.map((c) => [c.slug, c]));
  console.log(`Created ${categories.length} Ghana service categories`);

  const hashedPassword = await bcrypt.hash("Password123", 12);

  const customers = await Promise.all(
    CUSTOMER_SEEDS.map((customer) =>
      prisma.user.create({
        data: {
          email: customer.email,
          name: customer.name,
          password: hashedPassword,
          role: "customer",
          phone: customer.phone,
        },
      }),
    ),
  );
  const customersByKey = new Map(CUSTOMER_SEEDS.map((c, i) => [c.key, customers[i]]));
  console.log(`Created ${customers.length} customer accounts`);

  const providersByKey = new Map<string, { id: string; userId: string }>();

  for (const providerSeed of PROVIDER_SEEDS) {
    const user = await prisma.user.create({
      data: {
        email: providerSeed.email,
        name: providerSeed.name,
        password: hashedPassword,
        role: "provider",
        phone: providerSeed.phone,
      },
    });

    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        bio: providerSeed.bio,
        hourlyRate: 0,
        yearsExperience: providerSeed.yearsExperience,
        location: providerSeed.location,
        verified: providerSeed.verified,
        featured: providerSeed.featured,
      },
    });

    providersByKey.set(providerSeed.key, { id: provider.id, userId: user.id });

    const selectedCategoryIds = providerSeed.categories
      .map((slug) => categoriesBySlug.get(slug)?.id)
      .filter((id): id is string => Boolean(id));

    if (selectedCategoryIds.length > 0) {
      await prisma.providerCategory.createMany({
        data: selectedCategoryIds.map((categoryId) => ({
          providerId: provider.id,
          categoryId,
        })),
      });
    }

    if (providerSeed.specialties.length > 0) {
      await prisma.providerSpecialty.createMany({
        data: providerSeed.specialties.map((specialty) => ({
          providerId: provider.id,
          specialty,
        })),
      });
    }

    for (let day = 0; day < 7; day++) {
      const availability = await prisma.availability.create({
        data: {
          providerId: provider.id,
          date: dateOffset(day),
        },
      });

      await prisma.timeSlot.createMany({
        data: ["08:00", "09:30", "11:00", "13:00", "15:00", "17:00"].map(
          (time, idx) => ({
            availabilityId: availability.id,
            time,
            available: true,
            isFastest: idx === 0,
          }),
        ),
      });
    }
  }

  console.log(`Created ${PROVIDER_SEEDS.length} provider accounts with availability`);

  const bookingSeeds = [
    {
      customerKey: "ama",
      providerKey: "kwesi-plumbing",
      date: dateOffset(1),
      time: "09:30",
      serviceAddress: "Abura, Cape Coast",
      problemDescription: "Kitchen sink leak and low water pressure",
      status: "pending",
    },
    {
      customerKey: "kojo",
      providerKey: "adjoa-electrical",
      date: dateOffset(2),
      time: "13:00",
      serviceAddress: "East Legon, Accra",
      problemDescription: "Circuit breaker trips when AC is turned on",
      status: "confirmed",
    },
    {
      customerKey: "efua",
      providerKey: "ecco-cooling",
      date: dateOffset(0),
      time: "11:00",
      serviceAddress: "Kasoa New Market",
      problemDescription: "AC not cooling and making unusual noise",
      status: "in_progress",
    },
    {
      customerKey: "yaw",
      providerKey: "mensah-cleaning",
      date: dateOffset(-1),
      time: "08:00",
      serviceAddress: "Ahodwo, Kumasi",
      problemDescription: "Deep cleaning after apartment renovation",
      status: "completed",
    },
    {
      customerKey: "ama",
      providerKey: "awuku-painting",
      date: dateOffset(-2),
      time: "15:00",
      serviceAddress: "University of Cape Coast area",
      problemDescription: "Repaint two bedrooms and hallway",
      status: "completed",
    },
    {
      customerKey: "kojo",
      providerKey: "kobby-fumi",
      date: dateOffset(3),
      time: "17:00",
      serviceAddress: "Madina, Accra",
      problemDescription: "Cockroach infestation in kitchen and store",
      status: "cancelled",
    },
  ];

  const createdBookings = [];
  for (const bookingSeed of bookingSeeds) {
    const customer = customersByKey.get(bookingSeed.customerKey);
    const provider = providersByKey.get(bookingSeed.providerKey);
    if (!customer || !provider) continue;

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        providerId: provider.id,
        date: bookingSeed.date,
        time: bookingSeed.time,
        serviceAddress: bookingSeed.serviceAddress,
        problemDescription: bookingSeed.problemDescription,
        status: bookingSeed.status,
      },
    });
    createdBookings.push(booking);
  }
  console.log(`Created ${createdBookings.length} bookings with mixed statuses`);

  await prisma.review.createMany({
    data: [
      {
        userId: customersByKey.get("yaw")!.id,
        providerId: providersByKey.get("mensah-cleaning")!.id,
        rating: 5,
        comment: "Very thorough cleaning and arrived right on time.",
      },
      {
        userId: customersByKey.get("ama")!.id,
        providerId: providersByKey.get("awuku-painting")!.id,
        rating: 4,
        comment: "Great finishing and clean paint lines, will book again.",
      },
      {
        userId: customersByKey.get("kojo")!.id,
        providerId: providersByKey.get("adjoa-electrical")!.id,
        rating: 5,
        comment: "Explained the fault clearly and fixed it safely.",
      },
    ],
  });

  for (const provider of providersByKey.values()) {
    const reviews = await prisma.review.findMany({ where: { providerId: provider.id } });
    const reviewCount = reviews.length;
    const rating = reviewCount
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          ).toFixed(1),
        )
      : 0;

    await prisma.provider.update({
      where: { id: provider.id },
      data: { reviewCount, rating },
    });
  }

  await prisma.user.create({
    data: {
      email: "admin@localservicefinder.gh",
      name: "Local Service Finder Admin",
      password: hashedPassword,
      role: "admin",
      phone: "+233555000001",
    },
  });

  console.log("Created admin account");
  console.log("Ghana-focused seeding completed successfully");
  console.log("Test password for all users: Password123");
  console.log("Customer example: ama.boakye@example.com");
  console.log("Provider example: kwesi.plumbing@localservicefinder.gh");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
