export type Story = {
  id: string;
  title: string;
  scenes: Scene[];
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
};