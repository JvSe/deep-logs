import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const summary = await prisma.logDaily.findMany();
  return NextResponse.json(summary);
}
