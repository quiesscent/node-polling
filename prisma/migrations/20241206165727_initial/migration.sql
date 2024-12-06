-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "reg" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "campus" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "reg" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "campus" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_reg_key" ON "Student"("reg");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_reg_key" ON "Candidate"("reg");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_candidateId_key" ON "Candidate"("candidateId");
