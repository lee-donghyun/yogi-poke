-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "PasskeyDeviceType" AS ENUM ('singleDevice', 'multiDevice');

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
    "passkeyOptions" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL,
    "publicKey" BYTEA NOT NULL,
    "userId" INTEGER NOT NULL,
    "webauthnUserID" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "deviceType" "PasskeyDeviceType" NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Passkey_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Passkey_id_key" ON "Passkey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_fromUserId_toUserId_key" ON "Relation"("fromUserId", "toUserId");

-- AddForeignKey
ALTER TABLE "Poke" ADD CONSTRAINT "Poke_relationId_fkey" FOREIGN KEY ("relationId") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poke" ADD CONSTRAINT "Poke_reverseRelationId_fkey" FOREIGN KEY ("reverseRelationId") REFERENCES "Relation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
