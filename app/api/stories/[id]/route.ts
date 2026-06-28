import { jsonError, jsonData } from '@/app/api/_utils/responses';
import { isUuid } from '@/app/api/_utils/validation';
import { deleteStory, loadStory, saveStory } from '@/app/editor/actions';
import type { Story } from '@/app/lib/types';

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

  let story: Story;
  try {
    story = (await request.json()) as Story;
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  if (
    typeof story !== 'object' ||
    story === null ||
    !('title' in story) ||
    typeof story.title !== 'string'
  ) {
    return jsonError('Story title is required', 400);
  }

  if (!('id' in story) || typeof story.id !== 'string' || !isUuid(story.id) || story.id !== id) {
    return jsonError('Invalid story id', 400);
  }


  if (story.title.trim() === '') {
    return jsonError('Story title is required', 400);
  }

  if (!('scenes' in story) || !Array.isArray(story.scenes)) {
    return jsonError('Story scenes are required', 400);
  }

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
