/*
  Warnings:

  - You are about to drop the column `clock_type` on the `attendance` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[date,user_id]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clock_in_at` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clock_out_at` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Attendance_date_clock_type_user_id_key` ON `attendance`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `clock_type`,
    ADD COLUMN `clock_in_at` VARCHAR(191) NOT NULL,
    ADD COLUMN `clock_out_at` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('ATTEND', 'EXCUSED', 'LATE', 'OVERTIME') NOT NULL DEFAULT 'ATTEND';

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_date_user_id_key` ON `Attendance`(`date`, `user_id`);
