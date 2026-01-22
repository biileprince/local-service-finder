import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SEED_SECRET || "change-this-secret";

    // Verify authorization
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Run the seed script
    console.log("Starting database seed...");
    const output = execSync("npm run db:seed", {
      encoding: "utf-8",
      cwd: process.cwd(),
    });

    console.log("Seed completed:", output);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      output,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        error: "Failed to seed database",
        details: error.message,
        output: error.stdout || error.stderr,
      },
      { status: 500 }
    );
  }
}

// Allow GET to check if seeding is needed
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SEED_SECRET || "change-this-secret";

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if database has data
    const { prisma } = await import("@/lib/prisma");
    const providerCount = await prisma.provider.count();
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();

    return NextResponse.json({
      seeded: providerCount > 0 && userCount > 0 && categoryCount > 0,
      counts: {
        providers: providerCount,
        users: userCount,
        categories: categoryCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to check database status",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
