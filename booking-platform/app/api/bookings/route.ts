import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";

// GET - Get bookings for the current user
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = searchParams.get("role") || "customer"; // "customer" or "provider"

    // Build where clause based on user role
    const where: any = {};

    if (role === "provider") {
      // Get provider ID for this user
      const provider = await prisma.provider.findUnique({
        where: { userId: payload.userId },
      });

      if (!provider) {
        return NextResponse.json({ error: "Not a provider" }, { status: 403 });
      }

      where.providerId = provider.id;
    } else {
      where.customerId = payload.userId;
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
        provider: {
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
          },
        },
      },
    });

    // Transform bookings
    const transformedBookings = bookings.map((booking) => ({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      serviceAddress: booking.serviceAddress,
      problemDescription: booking.problemDescription,
      status: booking.status,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt.toISOString(),
      customer: booking.customer,
      provider: {
        id: booking.provider.id,
        name: booking.provider.user.name,
        avatar: booking.provider.user.avatar,
        phone: booking.provider.user.phone,
        category: booking.provider.categories[0]?.category.name || "General",
        rating: booking.provider.rating,
        hourlyRate: booking.provider.hourlyRate,
      },
    }));

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { providerId, date, time, serviceAddress, problemDescription } = body;

    // Validate required fields
    if (
      !providerId ||
      !date ||
      !time ||
      !serviceAddress ||
      !problemDescription
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if provider exists
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      include: {
        availability: {
          where: { date },
          include: { timeSlots: true },
        },
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 },
      );
    }

    // Check time slot availability
    const availability = provider.availability[0];
    if (availability) {
      const timeSlot = availability.timeSlots.find((t) => t.time === time);
      if (timeSlot && !timeSlot.available) {
        return NextResponse.json(
          { error: "Time slot is not available" },
          { status: 400 },
        );
      }

      // Mark time slot as unavailable
      if (timeSlot) {
        await prisma.timeSlot.update({
          where: { id: timeSlot.id },
          data: { available: false },
        });
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId: payload.userId,
        providerId,
        date,
        time,
        serviceAddress,
        problemDescription,
        status: "pending",
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
        provider: {
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
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: {
          id: booking.id,
          date: booking.date,
          time: booking.time,
          serviceAddress: booking.serviceAddress,
          problemDescription: booking.problemDescription,
          status: booking.status,
          createdAt: booking.createdAt.toISOString(),
          customer: booking.customer,
          provider: {
            id: booking.provider.id,
            name: booking.provider.user.name,
            avatar: booking.provider.user.avatar,
            phone: booking.provider.user.phone,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
