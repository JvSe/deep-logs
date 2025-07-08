import { LogLevel, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const LOG_TYPES = ["info", "warning", "error", "debug", "critical"] as const;
type LogType = (typeof LOG_TYPES)[number];

// Mapeamento de LogLevel para campo do resumo diário
const LOGLEVEL_TO_FIELD: Record<LogLevel, LogType> = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  DEBUG: "debug",
  CRITICAL: "critical",
};

// Schema Zod para validação dos dados
const LogSchema = z.object({
  level: z.enum(["INFO", "WARNING", "ERROR", "DEBUG", "CRITICAL"], {
    errorMap: () => ({
      message: "Nível de log deve ser INFO, WARNING, ERROR, DEBUG ou CRITICAL",
    }),
  }),
  message: z.string().min(1, "Mensagem é obrigatória"),
  details: z.string().optional(),
  deviceId: z.string().optional(),
  deviceModel: z.string().optional(),
  osVersion: z.string().optional(),
  appVersion: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  userId: z.string().optional(),
  nameUser: z.string().optional(),
  timestamp: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validação com Zod
    const validationResult = LogSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: errors,
        },
        { status: 400 }
      );
    }

    const {
      level,
      message,
      details,
      deviceId,
      deviceModel,
      osVersion,
      appVersion,
      latitude,
      longitude,
      userId,
      nameUser,
      timestamp,
    } = validationResult.data;

    // Cria o registro do log
    const log = await prisma.log.create({
      data: {
        level,
        message,
        details,
        deviceId: deviceId || "unknown",
        deviceModel,
        osVersion,
        appVersion,
        latitude,
        longitude,
        userId,
        nameUser,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    // Data do log (UTC, sem hora)
    const logDate = log.timestamp;
    const today = new Date(
      Date.UTC(
        logDate.getUTCFullYear(),
        logDate.getUTCMonth(),
        logDate.getUTCDate()
      )
    );

    // Campo do resumo diário correspondente ao nível do log
    const summaryField = LOGLEVEL_TO_FIELD[level as LogLevel];

    // Tenta encontrar o resumo do dia
    let summary = await prisma.logDaily.findUnique({
      where: { date: today },
    });

    if (summary) {
      // Atualiza o campo correspondente e o total
      const updateData: any = {};
      updateData[summaryField] = summary[summaryField] + 1;
      updateData["total"] = summary.total + 1;
      summary = await prisma.logDaily.update({
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
        total: 1,
      };
      data[summaryField] = 1;
      summary = await prisma.logDaily.create({ data });
    }

    return NextResponse.json({ log, summary });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: error.status }
    );
  }
}

export async function GET(req: NextRequest) {
  const summary = await prisma.logDaily.findMany();
  return NextResponse.json(summary);
}
