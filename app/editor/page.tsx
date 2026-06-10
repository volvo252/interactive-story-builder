import EditorClient from '@/app/editor/EditorClient';
import { loadStory } from '@/app/editor/actions';
import type { Story } from '@/app/lib/types';

type EditorPageProps = {
  searchParams: Promise<{
    id?: string | string[];
  }>;
};

export default async function EditorPage({ searchParams, }: EditorPageProps) {
  const params = await searchParams;
  const storyId = typeof params.id === 'string' ? params.id : null;

  const loadedStory = storyId ? await loadStory(storyId) : null;

  const initialStory: Story = loadedStory ?? {
    id: crypto.randomUUID(),
    title: 'My first story',
    scenes: [],
    startSceneId: null,
  };

  return <EditorClient initialStory={initialStory} />;
}