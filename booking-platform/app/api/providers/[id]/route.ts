import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const provider = await prisma.provider.findUnique({
      where: { id },
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
          orderBy: {
            date: "asc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 },
      );
    }

    // Transform provider for response
    const transformedProvider = {
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
      reviews: provider.reviews.map((r) => ({
        id: r.id,
        userId: r.user.id,
        userName: r.user.name,
        userAvatar: r.user.avatar,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({ provider: transformedProvider });
  } catch (error) {
    console.error("Get provider error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
