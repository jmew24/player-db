/*
  Warnings:

  - The `sport` column on the `player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sport` column on the `team` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "player" DROP COLUMN "sport",
ADD COLUMN     "sport" TEXT NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "team" DROP COLUMN "sport",
ADD COLUMN     "sport" TEXT NOT NULL DEFAULT 'UNKNOWN';

-- DropEnum
DROP TYPE "Sport";
