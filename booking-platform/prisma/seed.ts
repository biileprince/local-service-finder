import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

// Get absolute database path
// In production (Vercel), use /tmp which is writable
// In development, use local prisma folder
const isProduction = process.env.NODE_ENV === "production";
const dbPath = isProduction
  ? "/tmp/dev.db"
  : path.resolve(__dirname, "dev.db");

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");
  console.log(`📍 Database path: ${dbPath}`);
  console.log(`🌍 Environment: ${isProduction ? "production" : "development"}`);

  // Clear existing data (try-catch in case tables don't exist yet)
  try {
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.timeSlot.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.providerSpecialty.deleteMany();
    await prisma.providerCategory.deleteMany();
    await prisma.provider.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log("✅ Cleared existing data");
  } catch (error) {
    console.log("✅ No existing data to clear (fresh database)");
  }

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Home Cleaning",
        slug: "home-cleaning",
        description: "Professional house cleaning and maid services",
        icon: "🏠",
      },
    }),
    prisma.category.create({
      data: {
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipe repairs, installations, and maintenance",
        icon: "🔧",
      },
    }),
    prisma.category.create({
      data: {
        name: "Electrical",
        slug: "electrical",
        description: "Electrical repairs, wiring, and installations",
        icon: "⚡",
      },
    }),
    prisma.category.create({
      data: {
        name: "Landscaping",
        slug: "landscaping",
        description: "Lawn care, garden design, and outdoor maintenance",
        icon: "🌳",
      },
    }),
    prisma.category.create({
      data: {
        name: "Painting",
        slug: "painting",
        description: "Interior and exterior painting services",
        icon: "🎨",
      },
    }),
    prisma.category.create({
      data: {
        name: "HVAC",
        slug: "hvac",
        description: "Heating, ventilation, and air conditioning",
        icon: "❄️",
      },
    }),
    prisma.category.create({
      data: {
        name: "Carpentry",
        slug: "carpentry",
        description: "Custom woodwork, furniture, and repairs",
        icon: "🪚",
      },
    }),
    prisma.category.create({
      data: {
        name: "Moving",
        slug: "moving",
        description: "Residential and commercial moving services",
        icon: "📦",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pest Control",
        slug: "pest-control",
        description: "Pest extermination and prevention",
        icon: "🐜",
      },
    }),
    prisma.category.create({
      data: {
        name: "Appliance Repair",
        slug: "appliance-repair",
        description: "Home appliance repairs and maintenance",
        icon: "🔌",
      },
    }),
    prisma.category.create({
      data: {
        name: "Roofing",
        slug: "roofing",
        description: "Roof repairs, replacements, and installations",
        icon: "🏗️",
      },
    }),
    prisma.category.create({
      data: {
        name: "Security",
        slug: "security",
        description: "Home security systems and installations",
        icon: "🔒",
      },
    }),
    prisma.category.create({
      data: {
        name: "Pool Services",
        slug: "pool-services",
        description: "Pool cleaning, maintenance, and repairs",
        icon: "🏊",
      },
    }),
    prisma.category.create({
      data: {
        name: "Handyman",
        slug: "handyman",
        description: "General home repairs and odd jobs",
        icon: "🛠️",
      },
    }),
    prisma.category.create({
      data: {
        name: "Window Cleaning",
        slug: "window-cleaning",
        description: "Professional window cleaning services",
        icon: "🪟",
      },
    }),
    prisma.category.create({
      data: {
        name: "Interior Design",
        slug: "interior-design",
        description: "Home design and decoration services",
        icon: "🛋️",
      },
    }),
    prisma.category.create({
      data: {
        name: "Flooring",
        slug: "flooring",
        description: "Floor installation, repair, and refinishing",
        icon: "🪵",
      },
    }),
    prisma.category.create({
      data: {
        name: "Smart Home",
        slug: "smart-home",
        description: "Smart home device installation and setup",
        icon: "📱",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("Password123", 12);

  // Create sample users (customers)
  const customers = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        name: "John Smith",
        password: hashedPassword,
        role: "customer",
        phone: "(555) 123-4567",
      },
    }),
    prisma.user.create({
      data: {
        email: "sarah@example.com",
        name: "Sarah Johnson",
        password: hashedPassword,
        role: "customer",
        phone: "(555) 234-5678",
      },
    }),
    prisma.user.create({
      data: {
        email: "mike@example.com",
        name: "Mike Williams",
        password: hashedPassword,
        role: "customer",
        phone: "(555) 345-6789",
      },
    }),
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // Create provider users and their profiles
  const providerData = [
    {
      email: "mary.cleaner@example.com",
      name: "Mary's Cleaning Service",
      phone: "(555) 111-1111",
      location: "New York, NY",
      bio: "Professional cleaning services with 15 years of experience. We treat your home like our own!",
      hourlyRate: 45,
      yearsExperience: 15,
      categorySlug: "home-cleaning",
      specialties: ["Deep Cleaning", "Move-in/Move-out", "Regular Maintenance"],
      verified: true,
      featured: true,
      rating: 4.9,
      reviewCount: 127,
    },
    {
      email: "bob.plumber@example.com",
      name: "Bob's Plumbing Co",
      phone: "(555) 222-2222",
      location: "Los Angeles, CA",
      bio: "Licensed master plumber with expertise in residential and commercial plumbing. Available 24/7 for emergencies.",
      hourlyRate: 85,
      yearsExperience: 20,
      categorySlug: "plumbing",
      specialties: [
        "Emergency Repairs",
        "Pipe Installation",
        "Water Heaters",
        "Drain Cleaning",
      ],
      verified: true,
      featured: true,
      rating: 4.8,
      reviewCount: 89,
    },
    {
      email: "spark.electric@example.com",
      name: "Spark Electric Solutions",
      phone: "(555) 333-3333",
      location: "Chicago, IL",
      bio: "Certified electricians specializing in residential electrical work. Safety is our top priority.",
      hourlyRate: 95,
      yearsExperience: 12,
      categorySlug: "electrical",
      specialties: [
        "Panel Upgrades",
        "Lighting Installation",
        "Outlet Repairs",
        "EV Chargers",
      ],
      verified: true,
      featured: false,
      rating: 4.7,
      reviewCount: 56,
    },
    {
      email: "green.lawn@example.com",
      name: "Green Thumb Landscaping",
      phone: "(555) 444-4444",
      location: "Houston, TX",
      bio: "Transform your outdoor space into a beautiful oasis. Full-service landscaping and lawn care.",
      hourlyRate: 55,
      yearsExperience: 10,
      categorySlug: "landscaping",
      specialties: [
        "Lawn Maintenance",
        "Garden Design",
        "Tree Trimming",
        "Irrigation",
      ],
      verified: true,
      featured: true,
      rating: 4.9,
      reviewCount: 203,
    },
    {
      email: "pro.painters@example.com",
      name: "Pro Painters Plus",
      phone: "(555) 555-5555",
      location: "Phoenix, AZ",
      bio: "Quality painting services for homes and businesses. We use only premium paints and materials.",
      hourlyRate: 65,
      yearsExperience: 8,
      categorySlug: "painting",
      specialties: [
        "Interior Painting",
        "Exterior Painting",
        "Cabinet Refinishing",
        "Wallpaper",
      ],
      verified: true,
      featured: false,
      rating: 4.6,
      reviewCount: 42,
    },
    {
      email: "cool.hvac@example.com",
      name: "Cool Comfort HVAC",
      phone: "(555) 666-6666",
      location: "Philadelphia, PA",
      bio: "Keep your home comfortable year-round. Expert HVAC installation, repair, and maintenance.",
      hourlyRate: 110,
      yearsExperience: 18,
      categorySlug: "hvac",
      specialties: [
        "AC Repair",
        "Furnace Service",
        "Duct Cleaning",
        "System Installation",
      ],
      verified: true,
      featured: true,
      rating: 4.8,
      reviewCount: 78,
    },
    {
      email: "wood.works@example.com",
      name: "Woodworks Custom Carpentry",
      phone: "(555) 777-7777",
      location: "San Antonio, TX",
      bio: "Custom woodwork and carpentry with attention to detail. From repairs to custom furniture.",
      hourlyRate: 75,
      yearsExperience: 25,
      categorySlug: "carpentry",
      specialties: [
        "Custom Cabinets",
        "Deck Building",
        "Furniture Repair",
        "Crown Molding",
      ],
      verified: true,
      featured: false,
      rating: 4.9,
      reviewCount: 34,
    },
    {
      email: "quick.movers@example.com",
      name: "Quick & Careful Movers",
      phone: "(555) 888-8888",
      location: "San Diego, CA",
      bio: "Stress-free moving services. We handle your belongings with care and get you settled fast.",
      hourlyRate: 50,
      yearsExperience: 7,
      categorySlug: "moving",
      specialties: [
        "Local Moving",
        "Long Distance",
        "Packing Services",
        "Storage",
      ],
      verified: true,
      featured: true,
      rating: 4.5,
      reviewCount: 156,
    },
    {
      email: "jack.alltradesf@example.com",
      name: "Jack of All Trades",
      phone: "(555) 999-9999",
      location: "Dallas, TX",
      bio: "Your go-to handyman for all home repairs. No job too small!",
      hourlyRate: 45,
      yearsExperience: 12,
      categorySlug: "handyman",
      specialties: [
        "General Repairs",
        "Assembly",
        "Mounting",
        "Minor Plumbing",
      ],
      verified: true,
      featured: false,
      rating: 4.7,
      reviewCount: 89,
    },
    {
      email: "pest.free@example.com",
      name: "Pest-Free Home Services",
      phone: "(555) 101-0101",
      location: "San Jose, CA",
      bio: "Safe and effective pest control solutions for your home. EPA-approved methods.",
      hourlyRate: 60,
      yearsExperience: 14,
      categorySlug: "pest-control",
      specialties: [
        "Termite Treatment",
        "Rodent Control",
        "Insect Removal",
        "Prevention",
      ],
      verified: true,
      featured: false,
      rating: 4.6,
      reviewCount: 67,
    },
  ];

  const providers = [];

  for (const data of providerData) {
    const category = categories.find((c) => c.slug === data.categorySlug);
    if (!category) continue;

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: "provider",
        phone: data.phone,
      },
    });

    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        bio: data.bio,
        location: data.location,
        hourlyRate: data.hourlyRate,
        yearsExperience: data.yearsExperience,
        verified: data.verified,
        featured: data.featured,
        rating: data.rating,
        reviewCount: data.reviewCount,
      },
    });

    // Link provider to category
    await prisma.providerCategory.create({
      data: {
        providerId: provider.id,
        categoryId: category.id,
      },
    });

    // Add specialties
    for (const specialty of data.specialties) {
      await prisma.providerSpecialty.create({
        data: {
          providerId: provider.id,
          specialty: specialty,
        },
      });
    }

    // Create availability for next 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const availability = await prisma.availability.create({
        data: {
          providerId: provider.id,
          date: dateStr,
        },
      });

      // Create time slots (9 AM to 5 PM)
      const timeSlots = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ];

      for (const time of timeSlots) {
        await prisma.timeSlot.create({
          data: {
            availabilityId: availability.id,
            time,
            available: true,
          },
        });
      }
    }

    providers.push(provider);
  }

  console.log(`✅ Created ${providers.length} providers with availability`);

  // Create an admin user
  await prisma.user.create({
    data: {
      email: "admin@localservice.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Created admin user");

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📋 Test Accounts:");
  console.log("   Customer: john@example.com / Password123");
  console.log("   Provider: mary.cleaner@example.com / Password123");
  console.log("   Admin: admin@localservice.com / Password123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
