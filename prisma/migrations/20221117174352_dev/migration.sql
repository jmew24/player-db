/*
  Warnings:

  - You are about to drop the column `string` on the `player` table. All the data in the column will be lost.
  - You are about to drop the column `string` on the `team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier]` on the table `player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identifier]` on the table `team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifier` to the `player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifier` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "player_string_key";

-- DropIndex
DROP INDEX "team_string_key";

-- AlterTable
ALTER TABLE "player" DROP COLUMN "string",
ADD COLUMN     "identifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "team" DROP COLUMN "string",
ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "player_identifier_key" ON "player"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "team_identifier_key" ON "team"("identifier");
