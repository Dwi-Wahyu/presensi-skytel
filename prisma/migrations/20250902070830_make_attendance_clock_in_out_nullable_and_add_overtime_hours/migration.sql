/*
  Warnings:

  - Made the column `user_id` on table `attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_user_id_fkey`;

-- DropIndex
DROP INDEX `Attendance_user_id_fkey` ON `attendance`;

-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `overtime_hours` DOUBLE NULL,
    MODIFY `user_id` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('ATTEND', 'ABSENT', 'EXCUSED', 'LATE', 'OVERTIME') NOT NULL,
    MODIFY `clock_in_at` VARCHAR(191) NULL,
    MODIFY `clock_out_at` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
