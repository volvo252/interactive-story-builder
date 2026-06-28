import type { Story } from '@/app/lib/types';

type StoryPayloadValidationResult =
  | {
      success: true;
      story: Story;
    }
  | {
      success: false;
      message: string;
    };

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function validateStoryPayload(
  value: unknown,
  expectedId?: string
): StoryPayloadValidationResult {
  if (typeof value !== 'object' || value === null) {
    return {
      success: false,
      message: 'Story title is required',
    };
  }

  const payload = value as Record<string, unknown>;

  if (typeof payload.title !== 'string') {
    return {
      success: false,
      message: 'Story title is required',
    };
  }

  if (typeof payload.id !== 'string' || !isUuid(payload.id)) {
    return {
      success: false,
      message: 'Invalid story id',
    };
  }

  if (expectedId !== undefined && payload.id !== expectedId) {
    return {
      success: false,
      message: 'Invalid story id',
    };
  }

  if (payload.title.trim() === '') {
    return {
      success: false,
      message: 'Story title is required',
    };
  }

  if (!Array.isArray(payload.scenes)) {
    return {
      success: false,
      message: 'Story scenes are required',
    };
  }

  return {
    success: true,
    story: value as Story,
  };
}
