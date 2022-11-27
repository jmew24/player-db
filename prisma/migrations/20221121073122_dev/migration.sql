/*
  Warnings:

  - You are about to drop the column `sport` on the `player` table. All the data in the column will be lost.
  - You are about to drop the column `sport` on the `team` table. All the data in the column will be lost.
  - Added the required column `number` to the `player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sport_id` to the `player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sport_id` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "player" DROP CONSTRAINT "player_team_id_fkey";

-- AlterTable
ALTER TABLE "player" DROP COLUMN "sport",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "sport_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team" DROP COLUMN "sport",
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "sport_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_id_key" ON "Sport"("id");

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player" ADD CONSTRAINT "player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
