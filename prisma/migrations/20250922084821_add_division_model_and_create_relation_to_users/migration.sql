-- AlterTable
ALTER TABLE `user` ADD COLUMN `division_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `division` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `leader_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_division_id_fkey` FOREIGN KEY (`division_id`) REFERENCES `division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `division` ADD CONSTRAINT `division_leader_id_fkey` FOREIGN KEY (`leader_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
