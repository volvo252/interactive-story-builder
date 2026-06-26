
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
        return Response.json(
            {
                error: {
                    message: 'Story title is required',
                },
            },
            { status: 400 }
        );
    }

    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!('id' in story) || typeof story.id !== 'string' || !uuidPattern.test(story.id)) {
        return Response.json(
            {
                error: {
                    message: 'Invalid story id',
                },
            },
            { status: 400 }
        );
    }

    if (story.title.trim() === '') {
        return Response.json(
            {
                error: {
                    message: 'Story title is required',
                },
            },
            { status: 400 }
        );
    }

    if (!('scenes' in story) || !Array.isArray(story.scenes)) {
        return Response.json(
            {
                error: {
                    message: 'Story scenes are required',
                },
            },
            { status: 400 }
        );
    }

    try {
        const existingStory = await loadStory(story.id);
        if (existingStory) {
            return Response.json(
                {
                    error: {
                        message: 'Story already exists',
                    },
                },
                { status: 409 }
            );
        }
        const result = await saveStory(story);

        if (!result.success) {
            return Response.json(
                {
                    error: {
                        message: result.message,
                    },
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                data: story,
            },
            { status: 201 }
        );
    } catch {
        return Response.json(
            {
                error: {
                    message: 'Internal server error',
                },
            },
            { status: 500 }
        );
    }
}