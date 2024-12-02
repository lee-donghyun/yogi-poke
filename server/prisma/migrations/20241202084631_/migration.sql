-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'INSTAGRAM');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pushSubscription" JSONB,
    "profileImageUrl" TEXT,
    "referrerId" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
    "authProviderId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" SERIAL NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poke" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "relationId" INTEGER NOT NULL,
    "reverseRelationId" INTEGER NOT NULL,

    CONSTRAINT "Poke_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_fromUserId_toUserId_key" ON "Relation"("fromUserId", "toUserId");

-- AddForeignKey
ALTER TABLE "Poke" ADD CONSTRAINT "Poke_relationId_fkey" FOREIGN KEY ("relationId") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poke" ADD CONSTRAINT "Poke_reverseRelationId_fkey" FOREIGN KEY ("reverseRelationId") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateActiveUserView
CREATE VIEW "ActiveUser" AS SELECT * FROM "User" WHERE "deletedAt" IS NULL;