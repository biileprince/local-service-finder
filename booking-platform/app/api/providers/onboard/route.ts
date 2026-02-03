import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractTokenFromHeader, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const {
      bio,
      hourlyRate,
      yearsExperience,
      location,
      categories,
      specialties,
    } = body;

    // Validate required fields
    if (!location || !categories || categories.length === 0) {
      return NextResponse.json(
        {
          error: "Location and at least one category are required",
        },
        { status: 400 },
      );
    }

    // Check if user exists and is a provider
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { provider: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "provider") {
      return NextResponse.json(
        { error: "User is not a provider" },
        { status: 403 },
      );
    }

    // Check if provider profile already exists
    if (user.provider) {
      return NextResponse.json(
        { error: "Provider profile already exists" },
        { status: 409 },
      );
    }

    // Create provider profile
    const provider = await prisma.provider.create({
      data: {
        userId: user.id,
        bio,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
        yearsExperience: parseInt(yearsExperience) || 0,
        location,
      },
    });

    // Handle categories - create new ones if they don't exist
    const categoryPromises = categories.map(async (categoryName: string) => {
      // Try to find existing category
      let category = await prisma.category.findFirst({
        where: {
          name: {
            equals: categoryName,
            mode: "insensitive",
          },
        },
      });

      // Create category if it doesn't exist
      if (!category) {
        const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: slug,
            description: `${categoryName} services`,
            icon: "Wrench", // Default icon
          },
        });
      }

      return category;
    });

    const categoryRecords = await Promise.all(categoryPromises);

    // Link categories to provider
    await prisma.providerCategory.createMany({
      data: categoryRecords.map((cat) => ({
        providerId: provider.id,
        categoryId: cat.id,
      })),
    });

    // Add specialties
    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      await prisma.providerSpecialty.createMany({
        data: specialties.map((specialty: string) => ({
          providerId: provider.id,
          specialty,
        })),
      });
    }

    return NextResponse.json(
      {
        message: "Provider profile created successfully",
        provider: {
          id: provider.id,
          bio: provider.bio,
          hourlyRate: provider.hourlyRate,
          location: provider.location,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
