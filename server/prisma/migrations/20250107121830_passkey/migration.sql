-- CreateEnum
CREATE TYPE "PasskeyDeviceType" AS ENUM ('singleDevice', 'multiDevice');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passkeyOptions" JSONB;

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

-- CreateIndex
CREATE UNIQUE INDEX "Passkey_id_key" ON "Passkey"("id");
