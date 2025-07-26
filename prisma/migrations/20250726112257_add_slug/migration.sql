/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `cabinets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `cabinets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `divisions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `work_programs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cabinets` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `divisions` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `work_programs` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `cabinets_slug_key` ON `cabinets`(`slug`);
