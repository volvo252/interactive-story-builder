-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "startSceneId" UUID;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_startSceneId_fkey" FOREIGN KEY ("startSceneId") REFERENCES "Scene"("id") ON DELETE SET NULL ON UPDATE CASCADE;
