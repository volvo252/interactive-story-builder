import { loadStory } from '@/app/editor/actions';

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
