/*
  Warnings:

  - Made the column `shortDescription` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longDescription` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `title` TEXT NOT NULL,
    MODIFY `shortDescription` TEXT NOT NULL,
    MODIFY `longDescription` TEXT NOT NULL;
