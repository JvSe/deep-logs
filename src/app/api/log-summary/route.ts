import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const LOG_TYPES = ["info", "warning", "error", "debug", "critical"] as const;
type LogType = (typeof LOG_TYPES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;
    if (!LOG_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid log type" }, { status: 400 });
    }

    // Data de hoje (UTC, sem hora)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Tenta encontrar o resumo do dia
    let summary = await prisma.logDailySummary.findUnique({
      where: { date: today },
    });

    if (summary) {
      // Atualiza o campo correspondente
      const updateData: any = {};
      updateData[type] = summary[type] + 1;
      summary = await prisma.logDailySummary.update({
        where: { date: today },
        data: updateData,
      });
    } else {
      // Cria novo resumo do dia
      const data: any = {
        date: today,
        info: 0,
        warning: 0,
        error: 0,
        debug: 0,
        critical: 0,
      };
      data[type] = 1;
      summary = await prisma.logDailySummary.create({ data });
    }

    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
