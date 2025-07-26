-- AlterTable
ALTER TABLE `cabinets` MODIFY `description` TEXT NOT NULL,
    MODIFY `vision` TEXT NOT NULL,
    MODIFY `mission` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `divisions` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `work_programs` MODIFY `description` TEXT NULL;
