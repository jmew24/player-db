/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Sport` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Sport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Sport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sport" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "Sport"("name");
