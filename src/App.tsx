import { useState } from 'react';
import { SceneCanvas } from './components/SceneCanvas';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Header } from './components/Header';
import { AnimationControls } from './components/AnimationControls';

export interface SceneParameters {
  buildings: {
    count: number;
    type: 'residential' | 'commercial' | 'industrial';
    height: number;
  };
  trees: {
    count: number;
    density: number;
  };
  pedestrians: {
    count: number;
    speed: number;
  };
  roads: {
    lanes: number;
    length: number;
  };
  vehicles: {
    count: number;
  };
}

export type CameraView = 'overview' | 'street' | 'aerial';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('World');
  const [cameraView, setCameraView] = useState<CameraView>('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [parameters, setParameters] = useState<SceneParameters>({
    buildings: {
      count: 10,
      type: 'residential',
      height: 15,
    },
    trees: {
      count: 12,
      density: 0.6,
    },
    pedestrians: {
      count: 8,
      speed: 1,
    },
    roads: {
      lanes: 2,
      length: 40,
    },
    vehicles: {
      count: 3,
    },
  });

  const handleExport = (format: 'json' | 'glb') => {
    if (format === 'json') {
      const data = JSON.stringify(parameters, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'robotaxi-scene-config.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'glb') {
      // Mock GLB export
      alert('GLB export functionality would export the 3D scene as a GLB file');
    }
  };

  const handleResetWorld = () => {
    setParameters({
      buildings: {
        count: 10,
        type: 'residential',
        height: 15,
      },
      trees: {
        count: 12,
        density: 0.6,
      },
      pedestrians: {
        count: 8,
        speed: 1,
      },
      roads: {
        lanes: 2,
        length: 40,
      },
      vehicles: {
        count: 3,
      },
    });
    setIsAnimating(false);
    setIsRecording(false);
  };

  const updateParameter = <K extends keyof SceneParameters>(
    category: K,
    updates: Partial<SceneParameters[K]>
  ) => {
    setParameters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates,
      },
    }));
  };

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetWorld={handleResetWorld}
        onExportConfig={() => handleExport('json')}
      />
      
      <div className="flex-1 flex relative overflow-hidden">
        <LeftPanel
          cameraView={cameraView}
          setCameraView={setCameraView}
          onExport={handleExport}
        />
        
        <div className="flex-1 relative">
          <SceneCanvas
            parameters={parameters}
            cameraView={cameraView}
            isAnimating={isAnimating}
          />
          
          <AnimationControls
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
        </div>
        
        <RightPanel
          activeTab={activeTab}
          parameters={parameters}
          updateParameter={updateParameter}
        />
      </div>
    </div>
  );
}
