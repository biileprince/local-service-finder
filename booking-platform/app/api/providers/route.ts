import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const verified = searchParams.get("verified") === "true";
    const featured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sortBy") || "recommended";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (category && category !== "all") {
      where.categories = {
        some: {
          category: {
            slug: category.toLowerCase(),
          },
        },
      };
    }

    if (minRating > 0) {
      where.rating = {
        gte: minRating,
      };
    }

    if (verified) {
      where.verified = true;
    }

    if (featured) {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
            },
          },
        },
        {
          bio: {
            contains: search,
          },
        },
        {
          specialties: {
            some: {
              specialty: {
                contains: search,
              },
            },
          },
        },
      ];
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "price-low":
        orderBy = { hourlyRate: "asc" };
        break;
      case "price-high":
        orderBy = { hourlyRate: "desc" };
        break;
      case "reviews":
        orderBy = { reviewCount: "desc" };
        break;
      default:
        orderBy = [{ featured: "desc" }, { rating: "desc" }];
    }

    // Get total count
    const total = await prisma.provider.count({ where });

    // Get providers
    const providers = await prisma.provider.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        specialties: true,
        availability: {
          include: {
            timeSlots: true,
          },
          take: 7,
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    // Transform providers for response
    const transformedProviders = providers.map((provider) => ({
      id: provider.id,
      name: provider.user.name,
      email: provider.user.email,
      avatar: provider.user.avatar,
      phone: provider.user.phone,
      bio: provider.bio,
      hourlyRate: provider.hourlyRate,
      yearsExperience: provider.yearsExperience,
      location: provider.location,
      distance: provider.distance,
      verified: provider.verified,
      featured: provider.featured,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      category: provider.categories[0]?.category.slug || "general",
      categories: provider.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
      specialties: provider.specialties.map((s) => s.specialty),
      availability: provider.availability.map((a) => ({
        date: a.date,
        times: a.timeSlots.map((t) => ({
          time: t.time,
          available: t.available,
          isFastest: t.isFastest,
        })),
      })),
    }));

    return NextResponse.json({
      providers: transformedProviders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get providers error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
