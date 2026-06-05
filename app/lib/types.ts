export type Story = {
  id: string;
  title: string;
  scenes: Scene[];
  startSceneId: string | null;
};

export type Scene = {
  id: string;
  title: string;
  content: string;
  choices: Choice[];
};

export type Choice = {
  id: string;
  text: string;
  targetSceneId: string | null;
  availability: ChoiceAvailability;
  // decision is a real reader choice; continuation is a future "Next" transition.
  kind: 'decision' | 'continuation';
};

export type ChoiceAvailability =
  | {
      type: 'always';
    }
  | {
      type: 'after_choice';
      requiredChoiceId: string;
    };
