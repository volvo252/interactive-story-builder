
import { jsonData, jsonError } from '@/app/api/_utils/responses';
import { validateStoryPayload } from '@/app/api/_utils/validation';
import { loadStory, saveStory } from '@/app/editor/actions';

export async function POST(request: Request) {
    let storyPayload: unknown;

    try {
        storyPayload = await request.json();
    } catch {
        return jsonError('Invalid JSON body', 400);
    }

    const validation = validateStoryPayload(storyPayload);
    if (!validation.success) {
        return jsonError(validation.message, 400);
    }

    const story = validation.story;

    try {
        const existingStory = await loadStory(story.id);
        if (existingStory) {
            return jsonError('Story already exists', 409);
        }
        const result = await saveStory(story);

        if (!result.success) {
            return jsonError(result.message, 400);
        }

        return jsonData(story, 201);
    } catch {
        return jsonError('Internal server error', 500);
    }
}
