/*
  Warnings:

  - You are about to drop the `log_daily_summaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "log_daily_summaries";

-- CreateTable
CREATE TABLE "log_daily" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "info" INTEGER NOT NULL DEFAULT 0,
    "warning" INTEGER NOT NULL DEFAULT 0,
    "error" INTEGER NOT NULL DEFAULT 0,
    "debug" INTEGER NOT NULL DEFAULT 0,
    "critical" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "log_daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "log_daily_date_key" ON "log_daily"("date");
