-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "video" TEXT,
    "titleEn" TEXT NOT NULL,
    "shortDescEn" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "challengeEn" TEXT NOT NULL,
    "solutionEn" TEXT NOT NULL,
    "deliverablesEn" TEXT NOT NULL,
    "tagsEn" TEXT NOT NULL,
    "titleTr" TEXT NOT NULL,
    "shortDescTr" TEXT NOT NULL,
    "descTr" TEXT NOT NULL,
    "challengeTr" TEXT NOT NULL,
    "solutionTr" TEXT NOT NULL,
    "deliverablesTr" TEXT NOT NULL,
    "tagsTr" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
