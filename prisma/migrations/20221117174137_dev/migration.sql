/*
  Warnings:

  - You are about to drop the column `identifier` on the `player` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[string]` on the table `player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[string]` on the table `team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "player_identifier_key";

-- DropIndex
DROP INDEX "team_identifier_key";

-- AlterTable
ALTER TABLE "player" DROP COLUMN "identifier",
ADD COLUMN     "string" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "team" DROP COLUMN "identifier",
ADD COLUMN     "string" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "player_string_key" ON "player"("string");

-- CreateIndex
CREATE UNIQUE INDEX "team_string_key" ON "team"("string");
