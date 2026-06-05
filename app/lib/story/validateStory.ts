import type { Story } from '@/app/lib/types';

export type ValidationIssue = {
    id: string;
    type: 'error' | 'warning';
    message: string;
};


export function validateStory(story: Story): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const allChoices = story.scenes.flatMap((scene) => scene.choices);

    const sceneIds = new Set(story.scenes.map((scene) => scene.id));
    const choiceIds = new Set(allChoices.map((choice) => choice.id));

    if (!story.startSceneId) {
        issues.push({
            id: 'missing-start-scene',
            type: 'error',
            message: 'Story has no start scene.',
        })
    }

    if (story.startSceneId && !sceneIds.has(story.startSceneId)) {
        issues.push({
            id: 'invalid-start-scene',
            type: 'error',
            message: 'Start scene does not exist.',
        });
    }

    for (const scene of story.scenes) {
        if (!scene.content.trim()) {
            issues.push({
                id: `empty-scene-content-${scene.id}`,
                type: 'error',
                message: `Scene "${scene.title || 'Untitled scene'}" has empty content.`,
            });
        }

        for (const choice of scene.choices) {
            if (!choice.text.trim()) {
                issues.push({
                    id: `empty-choice-text-${choice.id}`,
                    type: 'error',
                    message: `A choice in scene "${scene.title || 'Untitled scene'}" has empty text.`,
                });
            }

            if (!choice.targetSceneId) {
                issues.push({
                    id: `missing-choice-target-${choice.id}`,
                    type: 'error',
                    message: `Choice "${choice.text || 'Untitled choice'}" has no target scene.`,
                });
            }

            if (choice.targetSceneId && !sceneIds.has(choice.targetSceneId)) {
                issues.push({
                    id: `invalid-choice-target-${choice.id}`,
                    type: 'error',
                    message: `Choice "${choice.text || 'Untitled choice'}" points to a deleted scene.`,
                });
            }

            if (
                choice.availability.type === 'after_choice' &&
                !choiceIds.has(choice.availability.requiredChoiceId)
            ) {
                issues.push({
                    id: `invalid-required-choice-${choice.id}`,
                    type: 'error',
                    message: `Choice "${choice.text || 'Untitled choice'}" depends on a deleted choice.`,
                });
            }
        }
    }
    return issues;

}