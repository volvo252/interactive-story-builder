import { jsonError, jsonData } from '@/app/api/_utils/responses';
import { isUuid, validateStoryPayload } from '@/app/api/_utils/validation';
import { deleteStory, loadStory, saveStory } from '@/app/editor/actions';

export async function GET(
  _request: Request,
  context: RouteContext<'/api/stories/[id]'>
) {
  const { id } = await context.params;
  if (!isUuid(id)) {
    return jsonError('Invalid story id', 400);
  }

  try {
    const story = await loadStory(id);

    if (story === null) {
      return jsonError('Story not found', 404);
    }

    return jsonData(story);
  } catch {
    return jsonError('Internal server error', 500);
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<'/api/stories/[id]'>
) {
  const { id } = await context.params;
  if (!isUuid(id)) {
    return jsonError('Invalid story id', 400);
  }

  let storyPayload: unknown;
  try {
    storyPayload = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const validation = validateStoryPayload(storyPayload, id);
  if (!validation.success) {
    return jsonError(validation.message, 400);
  }

  const story = validation.story;

  try {
    const existingStory = await loadStory(id);
    if (!existingStory) {
      return jsonError('Story not found', 404);
    }
    const result = await saveStory(story);

    if (!result.success) {
      return jsonError(result.message, 400);
    }

    return jsonData(story);
  } catch {
    return jsonError('Internal server error', 500);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<'/api/stories/[id]'>
) {
  const { id } = await context.params;
  if (!isUuid(id)) {
    return jsonError('Invalid story id', 400);
  }

  try {
    const existingStory = await loadStory(id);
    if (!existingStory) {
      return jsonError('Story not found', 404);
    }
    const result = await deleteStory(id);

    if (result.success) {
      return jsonData({
        message: 'Story deleted',
      });
    }

    return jsonError(result.message, 400);
  } catch {
    return jsonError('Internal server error', 500);
  }
}
