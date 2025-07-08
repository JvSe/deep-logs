-- CreateTable
CREATE TABLE "log_daily_summaries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "info" INTEGER NOT NULL DEFAULT 0,
    "warning" INTEGER NOT NULL DEFAULT 0,
    "error" INTEGER NOT NULL DEFAULT 0,
    "debug" INTEGER NOT NULL DEFAULT 0,
    "critical" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "log_daily_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_daily_summaries_date_key" ON "log_daily_summaries"("date");
