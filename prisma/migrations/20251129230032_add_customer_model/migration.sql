/*
  Warnings:

  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "subject" TEXT,
    "summary" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "tagsEn" TEXT NOT NULL,
    "titleTr" TEXT NOT NULL,
    "summaryTr" TEXT NOT NULL,
    "contentTr" TEXT NOT NULL,
    "tagsTr" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "author" TEXT NOT NULL DEFAULT 'Umbrella Digital',
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "projectTitle" TEXT NOT NULL,
    "customerId" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Proposal_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTracker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "phases" TEXT NOT NULL,
    "updates" TEXT NOT NULL DEFAULT '[]',
    "files" TEXT NOT NULL DEFAULT '[]',
    "vaultPassword" TEXT,
    "language" TEXT NOT NULL DEFAULT 'EN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTracker_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "tagsEn" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "challengeEn" TEXT NOT NULL,
    "solutionEn" TEXT NOT NULL,
    "resultsEn" TEXT NOT NULL,
    "titleTr" TEXT NOT NULL,
    "categoryTr" TEXT NOT NULL,
    "tagsTr" TEXT NOT NULL,
    "roleTr" TEXT NOT NULL,
    "descTr" TEXT NOT NULL,
    "challengeTr" TEXT NOT NULL,
    "solutionTr" TEXT NOT NULL,
    "resultsTr" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("categoryEn", "categoryTr", "challengeEn", "challengeTr", "client", "createdAt", "descEn", "descTr", "gallery", "id", "image", "resultsEn", "resultsTr", "roleEn", "roleTr", "solutionEn", "solutionTr", "tagsEn", "tagsTr", "titleEn", "titleTr", "updatedAt", "year") SELECT "categoryEn", "categoryTr", "challengeEn", "challengeTr", "client", "createdAt", "descEn", "descTr", "gallery", "id", "image", "resultsEn", "resultsTr", "roleEn", "roleTr", "solutionEn", "solutionTr", "tagsEn", "tagsTr", "titleEn", "titleTr", "updatedAt", "year" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_slug_key" ON "Proposal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTracker_proposalId_key" ON "ProjectTracker"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTracker_slug_key" ON "ProjectTracker"("slug");
