'use client';           

import { useState } from 'react';
import type { Story, Scene } from '@/lib/types';
import { Choice } from '../lib/types';

export default function EditorPage() {
  const [sceneCounter, setSceneCounter] = useState(1);
  const [story, setStory] = useState<Story>({
    id: crypto.randomUUID(),
    title: 'My first story',
    scenes: [],
  });

  function addScene() {
    const newScene: Scene = {
      id: crypto.randomUUID(),
      title: `Scene ${sceneCounter}`,
      content: '',
      choices: [],
    };
    setStory({                                     
      ...story,                                      
      scenes: [...story.scenes, newScene],
    });

    setSceneCounter(sceneCounter + 1);
  }

  function updateScene(sceneId: string, field: 'title'|'content', value:string) {
    setStory({                                                                              
      ...story,                                                                               
      scenes: story.scenes.map((scene) => {                                                   
        if (scene.id === sceneId) {                                                            
          return {                                                                             
            ...scene,                                                                          
            [field]: value,                                                                   
          };
        }
        return scene;                                                                           
      }),
    });
  }


  function addChoice (sceneId: string){
    const newChoice: Choice ={
      id: crypto.randomUUID(),
      text: '123',
      targetSceneId: null,
    };
    
    setStory({
      ...story,
      scenes: story.scenes.map((scene) =>{
        if (scene.id === sceneId){
          return {
            ...scene,
            choices: [...scene.choices, newChoice]
          };
        }
        return scene;
      }),
    });
  }


  function deleteScene(sceneId: string) {
    setStory({
      ...story,
      scenes: story.scenes.filter((scene) => scene.id !== sceneId),
    });
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Story Editor</h1>

      <button
        onClick={addScene}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Add scene
      </button>


      <div className="mt-6 space-y-4">
        {story.scenes.map((scene) => (
          <div
            key={scene.id}

            className="border rounded p-4"
          >
            <h2 className="font-semibold">{scene.title}</h2>

            <p className="text-sm text-gray-600">
              Scene ID: {scene.id}
            </p>
            <input
              value={scene.title}
              onChange={(event) =>
                updateScene(
                  scene.id,
                  'title',
                  event.target.value
                )
              }/>
            <textarea
              value={scene.content}
              onChange={(event) =>
                updateScene(
                  scene.id,
                  'content',
                  event.target.value
                )
              }/>
            <button
              onClick={() => deleteScene(scene.id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete scene
            </button>
                        <button
              onClick={() => addChoice(scene.id)}
              className="mt-3 bg-green-600 text-white px-3 py-1 rounded"
            >
              add Choise
            </button>
            {
             scene.choices.map((choice) =>(
              <div key = {choice.id } className="border rounded p-1">
                {choice.text} 
              </div>            
             ))
            }
          </div>
        ))}
      </div>
    </main>
  );
}