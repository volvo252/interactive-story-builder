
import { jsonData, jsonError } from '@/app/api/_utils/responses';
import { isUuid } from '@/app/api/_utils/validation';
import { loadStory, saveStory } from '@/app/editor/actions';
import type { Story } from '@/app/lib/types';

export async function POST(request: Request) {
    const story = (await request.json()) as Story;


    if (
        typeof story !== 'object' ||
        story === null ||
        !('title' in story) ||
        typeof story.title !== 'string'
    ) {
        return jsonError('Story title is required', 400);
    }

    if (!('id' in story) || typeof story.id !== 'string' || !isUuid(story.id)) {
        return jsonError('Invalid story id', 400);
    }

    if (story.title.trim() === '') {
        return jsonError('Story title is required', 400);
    }

    if (!('scenes' in story) || !Array.isArray(story.scenes)) {
        return jsonError('Story scenes are required', 400);
    }

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
