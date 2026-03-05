import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "200", 10);

  try {
    const logs = await prisma.log.findMany({
      where: {
        appVersion: {
          not: null,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });

    const data = logs.map((log) => ({
      id: log.id,
      userId: log.userId,
      nameUser: log.nameUser,
      appVersion: log.appVersion,
      routeOrFunction: log.message,
      timestamp: log.timestamp,
    }));

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

