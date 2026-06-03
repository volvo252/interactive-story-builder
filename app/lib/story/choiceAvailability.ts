import type { Choice } from '@/app/lib/types';

export function isChoiceAvailable(
  choice: Choice,
  selectedChoiceIds: string[],
): boolean {
  if (choice.availability.type === 'always') {
    return true;
  }

  return selectedChoiceIds.includes(choice.availability.requiredChoiceId);
}