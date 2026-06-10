'use client';

import { useState, useTransition } from 'react';
import type { Story, Scene, Choice, ChoiceAvailability } from '@/app/lib/types';
import { isChoiceAvailable } from '@/app/lib/story/choiceAvailability';
import { validateStory } from '@/app/lib/story/validateStory';
import StoryPreview from '@/app/components/StoryPreview';
import StoryEditor from '@/app/components/StoryEditor';
import { saveStory } from '@/app/editor/actions';

type EditorClientProps = {
    initialStory: Story;
};

export default function EditorClient({ initialStory }: EditorClientProps) {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
    const [sceneCounter, setSceneCounter] = useState(initialStory.scenes.length + 1);
    const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
    const [visitedSceneIds, setVisitedSceneIds] = useState<string[]>([]);
    const [story, setStory] = useState<Story>(initialStory);
    const validationIssues = validateStory(story);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [isSaving, startSaving] = useTransition();

    function handleSave() {
        setSaveMessage(null);

        startSaving(async () => {
            try {
                const result = await saveStory(story);
                setSaveMessage(result.message);
            } catch {
                setSaveMessage('Could not save story.');
            }
        });
    }

    function addScene() {
        const newScene: Scene = {
            id: crypto.randomUUID(),
            title: `Scene ${sceneCounter}`,
            content: '',
            choices: [],
        };
        setStory((currentStory) => ({
            ...currentStory,
            startSceneId: currentStory.startSceneId ?? newScene.id,
            scenes: [...currentStory.scenes, newScene],
        }));

        setSceneCounter((currentCounter) => currentCounter + 1);
    }

    function setStartScene(sceneId: string) {
        setStory((currentStory) => ({
            ...currentStory,
            startSceneId: sceneId,
        }));
    }

    function startPreview() {
        setIsPreviewMode(true);
        setSelectedChoiceIds([]);

        if (story.startSceneId === null) {
            setCurrentSceneId(null);
            setVisitedSceneIds([]);
            return;
        }

        setCurrentSceneId(story.startSceneId);
        setVisitedSceneIds([story.startSceneId]);
    }

    function restartPreview() {
        setSelectedChoiceIds([]);

        if (story.startSceneId === null) {
            setCurrentSceneId(null);
            setVisitedSceneIds([]);
            return;
        }

        setCurrentSceneId(story.startSceneId);
        setVisitedSceneIds([story.startSceneId]);
    }

    function exitPreview() {
        setIsPreviewMode(false);
        setCurrentSceneId(null);
        setVisitedSceneIds([]);
        setSelectedChoiceIds([]);
    }

    function updateScene(sceneId: string, field: 'title' | 'content', value: string) {
        setStory((currentStory) => ({
            ...currentStory,
            scenes: currentStory.scenes.map((scene) => {
                if (scene.id === sceneId) {
                    return {
                        ...scene,
                        [field]: value,
                    };
                }
                return scene;
            }),
        }));
    }

    function updateChoice(sceneId: string, choiceId: string, value: string) {
        setStory((currentStory) => ({
            ...currentStory,
            scenes: currentStory.scenes.map((scene) => {
                if (scene.id === sceneId) {
                    return {
                        ...scene,
                        choices: scene.choices.map((choice) => {
                            if (choice.id === choiceId) {
                                return {
                                    ...choice,
                                    text: value,
                                };
                            }

                            return choice;
                        }),
                    };
                }

                return scene;
            }),
        }));
    }

    function updateChoiceTarget(sceneId: string, choiceId: string, targetSceneId: string | null) {
        setStory((currentStory) => ({
            ...currentStory,
            scenes: currentStory.scenes.map((scene) => {
                if (scene.id === sceneId) {
                    return {
                        ...scene,
                        choices: scene.choices.map((choice) => {
                            if (choice.id === choiceId) {
                                return {
                                    ...choice,
                                    targetSceneId,
                                };
                            }

                            return choice;
                        }),
                    };
                }

                return scene;
            }),
        }));
    }

    function addChoice(sceneId: string) {
        const newChoice: Choice = {
            id: crypto.randomUUID(),
            text: 'Choice',
            targetSceneId: null,
            availability: {
                type: 'always',
            },
            kind: 'decision',
        };

        setStory((currentStory) => ({
            ...currentStory,
            scenes: currentStory.scenes.map((scene) => {
                if (scene.id === sceneId) {
                    return {
                        ...scene,
                        choices: [...scene.choices, newChoice]
                    };
                }
                return scene;
            }),
        }));
    }

    function deleteScene(sceneId: string) {
        setStory((currentStory) => ({
            ...currentStory,
            startSceneId:
                currentStory.startSceneId === sceneId
                    ? null
                    : currentStory.startSceneId,
            scenes: currentStory.scenes.filter((scene) => scene.id !== sceneId),
        }));
    }

    function deleteChoice(sceneId: string, choiceId: string) {
        setStory((currentStory) => ({
            ...currentStory,
            scenes: currentStory.scenes.map((scene) => {
                if (scene.id === sceneId) {

                    return {
                        ...scene,
                        choices: scene.choices.filter((choice) => choice.id !== choiceId),
                    }
                }
                return scene;
            }),
        }));
    }

    function updateChoiceAvailability(sceneId: string, choiceId: string, availability: ChoiceAvailability) {
        setStory((currentStory) => ({
            ...currentStory,
            scenes: currentStory.scenes.map((scene) => {
                if (scene.id === sceneId) {
                    return {
                        ...scene,
                        choices: scene.choices.map((choice) => {
                            if (choice.id === choiceId) {
                                return {
                                    ...choice,
                                    availability,
                                };
                            }

                            return choice;
                        }),
                    };
                }

                return scene;
            }),
        }));
    }

    function selectChoice(choice: Choice) {
        const targetSceneId = choice.targetSceneId;

        if (targetSceneId === null) return;

        if (choice.kind === 'decision') {
            setSelectedChoiceIds((currentChoiceIds) => [
                ...currentChoiceIds,
                choice.id,
            ]);
        }

        setVisitedSceneIds((currentSceneIds) => [
            ...currentSceneIds,
            targetSceneId,
        ]);

        setCurrentSceneId(targetSceneId);
    }

    const currentScene =
        story.scenes.find((scene) => scene.id === currentSceneId) ?? null;

    const availableChoices = currentScene
        ? currentScene.choices.filter((choice) =>
            isChoiceAvailable(choice, selectedChoiceIds)
        )
        : [];

    if (isPreviewMode) {
        return (
            <StoryPreview
                currentScene={currentScene}
                availableChoices={availableChoices}
                currentSceneId={currentSceneId}
                visitedSceneIds={visitedSceneIds}
                selectedChoiceIds={selectedChoiceIds}
                onExitPreview={exitPreview}
                onRestartPreview={restartPreview}
                onSelectChoice={selectChoice}
            />
        );
    }
    return (
        <StoryEditor
            story={story}
            validationIssues={validationIssues}
            onSave={handleSave}
            isSaving={isSaving}
            saveMessage={saveMessage}
            onAddScene={addScene}
            onStartPreview={startPreview}
            onUpdateScene={updateScene}
            onDeleteScene={deleteScene}
            onAddChoice={addChoice}
            onUpdateChoice={updateChoice}
            onUpdateChoiceTarget={updateChoiceTarget}
            onUpdateChoiceAvailability={updateChoiceAvailability}
            onDeleteChoice={deleteChoice}
            onSetStartScene={setStartScene}
        />
    );
}