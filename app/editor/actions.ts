'use server';

import { prisma } from '@/app/lib/db/prisma';
import type { Story } from '@/app/lib/types';

export async function saveStory(story: Story) {
  const normalizedTitle = story.title.trim();
  const sceneIds = new Set(story.scenes.map((scene) => scene.id));


  if (!normalizedTitle) {
    return {
      success: false,
      message: 'Story title is required.',
    };
  }

  if (story.startSceneId && !sceneIds.has(story.startSceneId)) {
    return {
      success: false,
      message: 'Start scene does not belong to this story.',
    };
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.story.upsert({
      where: { id: story.id },
      create: {
        id: story.id,
        title: normalizedTitle,
      },
      update: {
        title: normalizedTitle,
        startSceneId: null,
      },
    });

    for (const [sortOrder, scene] of story.scenes.entries()) {
      await transaction.scene.upsert({
        where: { id: scene.id },
        create: {
          id: scene.id,
          storyId: story.id,
          title: scene.title,
          content: scene.content,
          sortOrder,
        },
        update: {
          title: scene.title,
          content: scene.content,
          sortOrder,
        },
      });
    }

    const choicesWithSceneId = story.scenes.flatMap((scene) =>
      scene.choices.map((choice, sortOrder) => ({
        choice,
        sceneId: scene.id,
        sortOrder,
      }))
    );

    for (const { choice, sceneId, sortOrder } of choicesWithSceneId) {
      await transaction.choice.upsert({
        where: { id: choice.id },
        create: {
          id: choice.id,
          sceneId,
          text: choice.text,
          targetSceneId: choice.targetSceneId,
          availabilityType: choice.availability.type,
          requiredChoiceId: null,
          kind: choice.kind,
          sortOrder,
        },
        update: {
          text: choice.text,
          sceneId,
          targetSceneId: choice.targetSceneId,
          availabilityType: choice.availability.type,
          requiredChoiceId: null,
          kind: choice.kind,
          sortOrder,
        },
      });
    }

    for (const { choice } of choicesWithSceneId) {
      await transaction.choice.update({
        where: { id: choice.id },
        data: {
          requiredChoiceId:
            choice.availability.type === 'after_choice'
              ? choice.availability.requiredChoiceId
              : null,
        },
      });
    }

    const choiceIds = choicesWithSceneId.map(({ choice }) => choice.id);

    await transaction.choice.deleteMany({
      where: {
        scene: {
          storyId: story.id,
        },
        id: {
          notIn: choiceIds,
        },
      },
    });

    await transaction.scene.deleteMany({
      where: {
        storyId: story.id,
        id: {
          notIn: story.scenes.map((scene) => scene.id),
        },
      },
    });

    await transaction.story.update({
      where: { id: story.id },
      data: {
        startSceneId: story.startSceneId,
      },
    });
  });

  return {
    success: true,
    message: 'Story, scenes, and choices saved.',
  };
}


export async function loadStory(id: string): Promise<Story | null> {
  const databaseStory = await prisma.story.findUnique({
    where: { id },
    include: {
      scenes: {
        orderBy: { sortOrder: 'asc' },
        include: {
          outgoingChoices: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!databaseStory) {
    return null;
  }

  return {
    id: databaseStory.id,
    title: databaseStory.title,
    startSceneId: databaseStory.startSceneId,

    scenes: databaseStory.scenes.map((scene) => ({
      id: scene.id,
      title: scene.title,
      content: scene.content,

      choices: scene.outgoingChoices.map((choice) => ({
        id: choice.id,
        text: choice.text,
        targetSceneId: choice.targetSceneId,
        kind: choice.kind,

        availability:
          choice.availabilityType === 'after_choice' &&
            choice.requiredChoiceId
            ? {
              type: 'after_choice',
              requiredChoiceId: choice.requiredChoiceId,
            }
            : {
              type: 'always',
            },
      })),
    })),
  };
}
