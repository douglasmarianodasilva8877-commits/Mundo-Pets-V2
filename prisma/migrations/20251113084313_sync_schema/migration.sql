/*
  Warnings:

  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownerEmail` on table `Pet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Pet_ownerId_key";

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "ownerEmail" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "addressComplement" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "hasEcommerceAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "privacy" JSONB,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Campaign_sponsorId_idx" ON "Campaign"("sponsorId");

-- CreateIndex
CREATE INDEX "Campaign_active_idx" ON "Campaign"("active");

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Pet_ownerId_idx" ON "Pet"("ownerId");

-- CreateIndex
CREATE INDEX "Pet_slug_idx" ON "Pet"("slug");

-- CreateIndex
CREATE INDEX "Pet_ownerEmail_idx" ON "Pet"("ownerEmail");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Sponsor_name_idx" ON "Sponsor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
