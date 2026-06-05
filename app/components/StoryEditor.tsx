import type { ChoiceAvailability, Story } from '@/app/lib/types';
import type { ValidationIssue } from '@/app/lib/story/validateStory';
import ValidationPanel from '@/app/editor/ValidationPanel';

type StoryEditorProps = {
    story: Story;
    validationIssues: ValidationIssue[];
    onAddScene: () => void;
    onStartPreview: () => void;
    onUpdateScene: (
        sceneId: string,
        field: 'title' | 'content',
        value: string,
    ) => void;
    onDeleteScene: (sceneId: string) => void;
    onAddChoice: (sceneId: string) => void;
    onUpdateChoice: (
        sceneId: string,
        choiceId: string,
        value: string,
    ) => void;
    onUpdateChoiceTarget: (
        sceneId: string,
        choiceId: string,
        targetSceneId: string | null,
    ) => void;
    onUpdateChoiceAvailability: (
        sceneId: string,
        choiceId: string,
        availability: ChoiceAvailability,
    ) => void;
    onDeleteChoice: (sceneId: string, choiceId: string) => void;
    onSetStartScene: (sceneId: string) => void;
};

export default function StoryEditor(props: StoryEditorProps) {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Story Editor</h1>

            <button
                onClick={props.onAddScene}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Add scene
            </button>

            <button
                onClick={props.onStartPreview}
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
                Preview
            </button>

            <div className="mt-6 space-y-4">
                {props.story.scenes.map((scene) => (
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
                                props.onUpdateScene(
                                    scene.id,
                                    'title',
                                    event.target.value
                                )
                            } />
                        <textarea
                            value={scene.content}
                            onChange={(event) =>
                                props.onUpdateScene(
                                    scene.id,
                                    'content',
                                    event.target.value
                                )
                            } />
                        <button
                            onClick={() => props.onDeleteScene(scene.id)}
                            className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Delete scene
                        </button>
                        <button
                            onClick={() => props.onAddChoice(scene.id)}
                            className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
                        >
                            Add choice
                        </button>
                        <button
                            onClick={() => props.onSetStartScene(scene.id)}
                            className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
                        >
                            Make start
                        </button>
                        {
                            scene.choices.map((choice) => (
                                <div key={choice.id} className="border rounded p-1">

                                    <textarea
                                        value={choice.text}
                                        onChange={(event) =>
                                            props.onUpdateChoice(
                                                scene.id,
                                                choice.id,
                                                event.target.value
                                            )
                                        } />
                                    Leads to:
                                    <select
                                        value={choice.targetSceneId ?? ''}
                                        onChange={(event) =>
                                            props.onUpdateChoiceTarget(
                                                scene.id,
                                                choice.id,
                                                event.target.value || null
                                            )
                                        }
                                    >
                                        <option value="">No target scene</option>

                                        {props.story.scenes.map((targetScene) => (
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
                                                    props.onUpdateChoiceAvailability(
                                                        scene.id,
                                                        choice.id,
                                                        {
                                                            type: 'after_choice',
                                                            requiredChoiceId: '',
                                                        }
                                                    );
                                                } else {
                                                    props.onUpdateChoiceAvailability(
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
                                            Required:
                                            <select
                                                value={choice.availability.requiredChoiceId}
                                                onChange={(event) =>
                                                    props.onUpdateChoiceAvailability(scene.id, choice.id, {
                                                        type: 'after_choice',
                                                        requiredChoiceId: event.target.value,
                                                    })
                                                }
                                            >
                                                <option value="">No required choice</option>
                                                {props.story.scenes
                                                    .filter((sourceScene) => sourceScene.id !== scene.id)
                                                    .flatMap((sourceScene) =>
                                                        sourceScene.choices
                                                            .filter((targetChoice) => targetChoice.kind === 'decision')
                                                            .map((targetChoice) => (
                                                                <option key={targetChoice.id} value={targetChoice.id}>
                                                                    {sourceScene.title}: {targetChoice.text}
                                                                </option>
                                                            ))
                                                    )}
                                            </select>
                                        </label>
                                    )}
                                    <button
                                        onClick={() => props.onDeleteChoice(scene.id, choice.id)}
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
            {props.story.scenes.length > 0 && (
                <ValidationPanel issues={props.validationIssues} />
            )}
            <pre className="mt-8 text-xs">
                {JSON.stringify(props.story, null, 2)}
            </pre>
        </main>
    );
}