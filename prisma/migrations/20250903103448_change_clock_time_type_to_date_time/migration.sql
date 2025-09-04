/*
  Warnings:

  - You are about to alter the column `clock_in_at` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `clock_out_at` on the `attendance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - The values [LATE,OVERTIME] on the enum `Attendance_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `attendance` MODIFY `clock_in_at` DATETIME(3) NULL,
    MODIFY `clock_out_at` DATETIME(3) NULL,
    MODIFY `status` ENUM('ATTEND', 'ABSENT', 'EXCUSED') NOT NULL;
