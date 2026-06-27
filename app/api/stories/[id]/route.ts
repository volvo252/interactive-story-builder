import { loadStory, saveStory } from '@/app/editor/actions';
import type { Story } from '@/app/lib/types';

export async function GET(
  _request: Request,
  context: RouteContext<'/api/stories/[id]'>
) {
  const { id } = await context.params;
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return Response.json(
      {
        error: {
          message: 'Invalid story id',
        },
      },
      { status: 400 }
    );
  }

  try {
    const story = await loadStory(id);

    if (story === null) {
      return Response.json(
        {
          error: {
            message: 'Story not found',
          },
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        data: story,
      },
      { status: 200 }
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

export async function PATCH(
  request: Request,
  context: RouteContext<'/api/stories/[id]'>
) {
  const { id } = await context.params;
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(id)) {
    return Response.json(
      {
        error: {
          message: 'Invalid story id',
        },
      },
      { status: 400 }
    );
  }

  let story: Story;
  try {
    story = (await request.json()) as Story;
  } catch {
    return Response.json(
      {
        error: {
          message: 'Invalid JSON body',
        },
      },
      { status: 400 }
    );
  }

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

  if (!('id' in story) || typeof story.id !== 'string' || !uuidPattern.test(story.id) || story.id !== id) {
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
    const existingStory = await loadStory(id);
    if (!existingStory) {
      return Response.json(
        {
          error: {
            message: 'Story not found',
          },
        },
        { status: 404 }
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
      { status: 200 }
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