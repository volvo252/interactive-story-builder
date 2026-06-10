-- CreateEnum
CREATE TYPE "ChoiceAvailabilityType" AS ENUM ('always', 'after_choice');

-- CreateEnum
CREATE TYPE "ChoiceKind" AS ENUM ('decision', 'continuation');

-- CreateTable
CREATE TABLE "Choice" (
    "id" UUID NOT NULL,
    "sceneId" UUID NOT NULL,
    "targetSceneId" UUID,
    "availabilityType" "ChoiceAvailabilityType" NOT NULL DEFAULT 'always',
    "requiredChoiceId" UUID,
    "text" TEXT NOT NULL,
    "kind" "ChoiceKind" NOT NULL DEFAULT 'decision',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_targetSceneId_fkey" FOREIGN KEY ("targetSceneId") REFERENCES "Scene"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_requiredChoiceId_fkey" FOREIGN KEY ("requiredChoiceId") REFERENCES "Choice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
