'use client';           

import { useState } from 'react';
import type { Story, Scene, Choice } from '@/lib/types';

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
    setStory((currentStory) => ({                                     
      ...currentStory,                                      
      scenes: [...currentStory.scenes, newScene],
    }));

    setSceneCounter((currentCounter) => currentCounter + 1);
  }


  function updateScene(sceneId: string, field: 'title'|'content', value:string) {
    setStory((currentStory) => ({                                                                              
      ...currentStory,                                                                               
      scenes: currentStory.scenes.map((scene) => {                                                   
        if (scene.id === sceneId) {                                                            
          return {                                                                             
            ...scene,                                                                          
            [field]: value,                                                                   
          };
        }
        return scene;                                                                           
      }),
    }));
  }

  function updateChoice(sceneId: string, choiceId: string, value: string) {
    setStory((currentStory) => ({                                                                              
      ...currentStory,                                                                               
      scenes: currentStory.scenes.map((scene) => {                                                   
        if (scene.id === sceneId) {    
          return{
            ...scene,                                                                                                                                
            choices: scene.choices.map((choice) => {   
              if (choice.id === choiceId) {
                return {
                  ...choice,
                  text: value,
                };
              }

              return choice;
            }),
          };
        }

        return scene;                                                                           
      }),
    }));
  }

  function updateChoiceTarget(sceneId: string, choiceId: string, targetSceneId: string | null) {
    setStory((currentStory) => ({                                                                              
      ...currentStory,                                                                               
      scenes: currentStory.scenes.map((scene) => {                                                   
        if (scene.id === sceneId) {    
          return{
            ...scene,                                                                                                                                
            choices: scene.choices.map((choice) => {   
              if (choice.id === choiceId) {
                return {
                  ...choice,
                  targetSceneId,
                };
              }

              return choice;
            }),
          };
        }

        return scene;                                                                           
      }),
    }));
  }

  function addChoice (sceneId: string){
    const newChoice: Choice ={
      id: crypto.randomUUID(),
      text: 'Choice',
      targetSceneId: null,
    };
    
    setStory((currentStory) =>({
      ...currentStory,
      scenes: currentStory.scenes.map((scene) =>{
        if (scene.id === sceneId){
          return {
            ...scene,
            choices: [...scene.choices, newChoice]
          };
        }
        return scene;
      }),
    }));
  }

  function deleteScene(sceneId: string) {
    setStory((currentStory) => ({
      ...currentStory,
      scenes: currentStory.scenes.filter((scene) => scene.id !== sceneId),
    }));
  }

  function deleteChoice(sceneId: string, choiceId: string) {
    setStory((currentStory) => ({
      ...currentStory,
      scenes: currentStory.scenes.map((scene) =>{
        if(scene.id === sceneId){
          
          return {
            ...scene,
            choices: scene.choices.filter((choice) => choice.id !== choiceId),
          }
        }
        return scene;
      }),
    }));
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
              Add choise
            </button>
            {
             scene.choices.map((choice) =>(
              <div key = {choice.id} className="border rounded p-1">
                
              <textarea              
                value={choice.text}
                onChange={(event) =>
                  updateChoice(
                    scene.id,
                    choice.id,
                    event.target.value
                )
              }/>
              <select
                value={choice.targetSceneId ?? ''}
                onChange={(event) =>
                  updateChoiceTarget(
                    scene.id,
                    choice.id,
                    event.target.value || null
                  )
                }
              >
                <option value="">No target scene</option>

                {story.scenes.map((targetScene) => (
                  <option key={targetScene.id} value={targetScene.id}>
                    {targetScene.title}
                  </option>
                ))}
              </select>

              <button
                onClick={() => deleteChoice(scene.id, choice.id)}
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete choice
              </button>
              </div>            
             ))
            }
          </div>
        ))}
      </div>
    </main>
  );
}