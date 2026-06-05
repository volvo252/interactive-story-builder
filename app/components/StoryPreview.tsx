import type { Choice, Scene } from '@/app/lib/types';

type StoryPreviewProps = {
    currentScene: Scene | null;
    availableChoices: Choice[];
    currentSceneId: string | null;
    visitedSceneIds: string[];
    selectedChoiceIds: string[];
    onExitPreview: () => void;
    onRestartPreview: () => void;
    onSelectChoice: (choice: Choice) => void;
};

export default function StoryPreview(props: StoryPreviewProps) {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Story Preview</h1>

            <div className="mt-4 flex gap-2">
                <button

                    onClick={props.onExitPreview}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Back to editor
                </button>
                <button
                    onClick={props.onRestartPreview}
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Restart Story
                </button>
            </div>

            {props.currentScene ? (
                <div className="mt-4 flex flex-col items-start gap-2">
                    <h2 className="text-xl font-semibold">{props.currentScene.title}</h2>
                    <p className="mt-4">{props.currentScene.content}</p>
                    {props.availableChoices.map((choice) => (
                        <button
                            key={choice.id}
                            onClick={() => props.onSelectChoice(choice)}
                            disabled={choice.targetSceneId === null}
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            {choice.text}
                        </button>
                    ))}
                    {props.availableChoices.length === 0 && (
                        <p className="mt-4 font-semibold">The End</p>
                    )}
                </div>

            ) : (
                <p className="mt-6">Start scene not found.</p>
            )}
            <pre className="mt-8 text-xs">
                {JSON.stringify(
                    {
                        currentSceneId: props.currentSceneId,
                        visitedSceneIds: props.visitedSceneIds,
                        selectedChoiceIds: props.selectedChoiceIds,
                    },
                    null,
                    2
                )}
            </pre>
        </main>
    );
}