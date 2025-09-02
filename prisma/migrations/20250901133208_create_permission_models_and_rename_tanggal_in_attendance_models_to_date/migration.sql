/*
  Warnings:

  - You are about to drop the column `tanggal` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,clock_type,user_id]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `value` on table `appsettings` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clock_type` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Attendance_tanggal_type_user_id_key` ON `attendance`;

-- AlterTable
ALTER TABLE `appsettings` MODIFY `value` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `tanggal`,
    DROP COLUMN `type`,
    ADD COLUMN `clock_type` ENUM('IN', 'OUT') NOT NULL,
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('EARLY_LEAVE', 'LATE', 'ON_TIME', 'OVERTIME', 'EXCUSED') NOT NULL DEFAULT 'ON_TIME';

-- CreateTable
CREATE TABLE `Permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `days_count` INTEGER NOT NULL,
    `proof` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `type` ENUM('FULL', 'EARLY_LEAVE', 'LATE') NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `date_start` DATETIME(3) NOT NULL,
    `date_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_date_clock_type_user_id_key` ON `Attendance`(`date`, `clock_type`, `user_id`);

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
