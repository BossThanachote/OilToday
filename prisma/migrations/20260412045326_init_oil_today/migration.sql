-- CreateTable
CREATE TABLE "OilPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "changed" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OilPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineSubscriber" (
    "id" SERIAL NOT NULL,
    "lineId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LineSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineSubscriber_lineId_key" ON "LineSubscriber"("lineId");
