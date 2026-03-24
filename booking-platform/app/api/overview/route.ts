import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [customers, providers, categories, bookings, reviews] =
      await Promise.all([
        prisma.user.count({ where: { role: "customer" } }),
        prisma.provider.count(),
        prisma.category.count(),
        prisma.booking.count(),
        prisma.review.count(),
      ]);

    return NextResponse.json({
      customers,
      providers,
      categories,
      bookings,
      reviews,
    });
  } catch (error) {
    console.error("Get overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
