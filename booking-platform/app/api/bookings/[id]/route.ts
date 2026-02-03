import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";

// GET - Get a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const booking = await prisma.booking.findUnique({
      where: { id },
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

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user is authorized to view this booking
    const isCustomer = booking.customerId === payload.userId;
    const isProvider = await prisma.provider.findFirst({
      where: {
        id: booking.providerId,
        userId: payload.userId,
      },
    });

    if (!isCustomer && !isProvider) {
      return NextResponse.json(
        { error: "Not authorized to view this booking" },
        { status: 403 },
      );
    }

    return NextResponse.json({
      booking: {
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
          email: booking.provider.user.email,
          category: booking.provider.categories[0]?.category.name || "General",
          rating: booking.provider.rating,
          hourlyRate: booking.provider.hourlyRate,
        },
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Update booking status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
    const { status, totalAmount } = body;

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization
    const isCustomer = booking.customerId === payload.userId;
    const isProvider = booking.provider.userId === payload.userId;

    if (!isCustomer && !isProvider) {
      return NextResponse.json(
        { error: "Not authorized to update this booking" },
        { status: 403 },
      );
    }

    // Validate status transitions
    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Only providers can confirm bookings
    if (status === "confirmed" && !isProvider) {
      return NextResponse.json(
        { error: "Only providers can confirm bookings" },
        { status: 403 },
      );
    }

    // Only providers can start jobs
    if (status === "in_progress" && !isProvider) {
      return NextResponse.json(
        { error: "Only providers can start jobs" },
        { status: 403 },
      );
    }

    // Only providers can complete bookings
    if (status === "completed" && !isProvider) {
      return NextResponse.json(
        { error: "Only providers can complete bookings" },
        { status: 403 },
      );
    }

    // Update booking
    const updateData: any = {};
    if (status) updateData.status = status;
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount;

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    // If cancelled, make time slot available again
    if (status === "cancelled") {
      const availability = await prisma.availability.findUnique({
        where: {
          providerId_date: {
            providerId: booking.providerId,
            date: booking.date,
          },
        },
        include: { timeSlots: true },
      });

      if (availability) {
        const timeSlot = availability.timeSlots.find(
          (t) => t.time === booking.time,
        );
        if (timeSlot) {
          await prisma.timeSlot.update({
            where: { id: timeSlot.id },
            data: { available: true },
          });
        }
      }
    }

    return NextResponse.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Cancel/delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check authorization - only customer can delete their booking
    if (booking.customerId !== payload.userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this booking" },
        { status: 403 },
      );
    }

    // Make time slot available again
    const availability = await prisma.availability.findUnique({
      where: {
        providerId_date: {
          providerId: booking.providerId,
          date: booking.date,
        },
      },
      include: { timeSlots: true },
    });

    if (availability) {
      const timeSlot = availability.timeSlots.find(
        (t) => t.time === booking.time,
      );
      if (timeSlot) {
        await prisma.timeSlot.update({
          where: { id: timeSlot.id },
          data: { available: true },
        });
      }
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
