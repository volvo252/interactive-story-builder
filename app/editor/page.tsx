'use client';

import { useState } from 'react';
import type { Story, Scene, Choice, ChoiceAvailability} from '@/app/lib/types';
import { isChoiceAvailable } from '@/app/lib/story/choiceAvailability';

export default function EditorPage() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [sceneCounter, setSceneCounter] = useState(1);
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([]);
  const [visitedSceneIds, setVisitedSceneIds] = useState<string[]>([]);
  const [story, setStory] = useState<Story>({
    id: crypto.randomUUID(),
    title: 'My first story',
    scenes: [],
    startSceneId: null,
  });

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

  function selectChoice(targetSceneId: string | null, choiceId: string) {
    if (targetSceneId === null) return;

    setSelectedChoiceIds((currentChoiceIds) => [
      ...currentChoiceIds,
      choiceId,
    ]);

    setVisitedSceneIds((currentSceneIds) => [
      ...currentSceneIds,
      targetSceneId,
    ]);

    setCurrentSceneId(targetSceneId);
  }

  const currentScene =
    story.scenes.find((scene) => scene.id === currentSceneId) ?? null;

  if (isPreviewMode) {
    return (
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Story Preview</h1>

        <div className="mt-4 flex gap-2">
          <button

            onClick={exitPreview}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to editor
          </button>
          <button
            onClick={restartPreview}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Restart Story
          </button>
        </div>

        {currentScene ? (
          <div className="mt-4 flex flex-col items-start gap-2">
            <h2 className="text-xl font-semibold">{currentScene.title}</h2>
            <p className="mt-4">{currentScene.content}</p>
            {currentScene.choices
              .filter((choice) => {
                return isChoiceAvailable(choice, selectedChoiceIds);
              })
              .map((choice) => (
              <button
                key={choice.id}
                onClick={() => selectChoice(choice.targetSceneId, choice.id)}
                disabled={choice.targetSceneId === null}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                {choice.text}
              </button>
            ))}
            {currentScene.choices.length === 0 && (
              <p className="mt-4 font-semibold">The End</p>
            )}
          </div>

        ) : (
          <p className="mt-6">Start scene not found.</p>
        )}
        <pre className="mt-8 text-xs">
          {JSON.stringify(
            {
              currentSceneId,
              visitedSceneIds,
              selectedChoiceIds,
            },
            null,
            2
          )}
        </pre>
      </main>
    );
  }
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Story Editor</h1>

      <button
        onClick={addScene}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add scene
      </button>

      <button
        onClick={startPreview}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Preview
      </button>

      <div className="mt-6 space-y-4">
        {story.scenes.map((scene) => (
          <div
            key={scene.id}

            className="border rounded p-4"
          >
            <h2 className="font-semibold">{scene.title}</h2>

            <p className="text-sm text-gray-600">
              Scene ID: {scene.id}
            </p>
            <input
              value={scene.title}
              onChange={(event) =>
                updateScene(
                  scene.id,
                  'title',
                  event.target.value
                )
              } />
            <textarea
              value={scene.content}
              onChange={(event) =>
                updateScene(
                  scene.id,
                  'content',
                  event.target.value
                )
              } />
            <button
              onClick={() => deleteScene(scene.id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete scene
            </button>
            <button
              onClick={() => addChoice(scene.id)}
              className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
            >
              Add choice
            </button>
            {
              scene.choices.map((choice) => (
                <div key={choice.id} className="border rounded p-1">

                  <textarea
                    value={choice.text}
                    onChange={(event) =>
                      updateChoice(
                        scene.id,
                        choice.id,
                        event.target.value
                      )
                    } />
                    Ведёт в:
                  <select
                    value={choice.targetSceneId ?? ''}
                    onChange={(event) =>
                      updateChoiceTarget(
                        scene.id,
                        choice.id,
                        event.target.value || null
                      )
                    }
                  >
                    <option value="">No target scene</option>

                    {story.scenes.map((targetScene) => (
                      <option key={targetScene.id} value={targetScene.id}>
                        {targetScene.title}
                      </option>
                    ))}
                  </select>

                  <label className="block mt-2">
                    <input
                      type="checkbox"
                      checked={choice.availability.type === 'after_choice'}
                      onChange={(event) => {
                        if (event.target.checked) {
                          updateChoiceAvailability(
                            scene.id,
                            choice.id,
                            {
                              type: 'after_choice',
                              requiredChoiceId: '',
                            }
                          );
                        } else {
                          updateChoiceAvailability(
                            scene.id,
                            choice.id,
                            {
                              type: 'always',
                            }
                          );
                        }
                      }}
                    />

                    Show only after previous choice
                  </label>
                  
                  {choice.availability.type === 'after_choice' && (
                    <label className="block mt-2">
                      Требуется:
                      <select
                        value={choice.availability.requiredChoiceId}
                        onChange={(event) =>
                          updateChoiceAvailability(scene.id, choice.id, {
                            type: 'after_choice',
                            requiredChoiceId: event.target.value,
                          })
                        }
                      >
                      <option value="">No required choice</option>

                      {story.scenes
                        .filter((sourceScene) => sourceScene.id !== scene.id)
                        .map((sourceScene) =>
                          sourceScene.choices.map((targetChoice) => (
                            <option key={targetChoice.id} value={targetChoice.id}>
                              {sourceScene.title}: {targetChoice.text}
                            </option>
                          ))
                        )}
                      </select>
                    </label>
                  )}
                  <button
                    onClick={() => deleteChoice(scene.id, choice.id)}
                    className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete choice
                  </button>
                </div>
              ))
            }
          </div>
        ))}
      </div>
      <pre className="mt-8 text-xs">
        {JSON.stringify(story, null, 2)}
      </pre>
    </main>
  );
}