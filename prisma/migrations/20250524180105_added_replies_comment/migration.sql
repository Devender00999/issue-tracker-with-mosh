-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `commentId` INTEGER NULL,
    ADD COLUMN `parentCommentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentCommentId_fkey` FOREIGN KEY (`parentCommentId`) REFERENCES `Comment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
