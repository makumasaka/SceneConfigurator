import { Eye, Camera, Move, Navigation2, Eye as EyeIcon, Users, Car, Trees, Bug, AlertTriangle } from 'lucide-react';
import { useOperatorStore } from '../store/useOperatorStore';
import type { CameraMode } from '../types';

export function LeftPanel() {
  const cameraMode = useOperatorStore((state) => state.cameraMode);
  const setCameraMode = useOperatorStore((state) => state.setCameraMode);
  const sceneLayerToggles = useOperatorStore((state) => state.sceneLayerToggles);
  const toggleSceneLayer = useOperatorStore((state) => state.toggleSceneLayer);
  const loadStuckScenario = useOperatorStore((state) => state.loadStuckScenario);

  const cameraViews: { mode: CameraMode; icon: any; label: string; description: string }[] = [
    { mode: 'free', icon: Eye, label: 'Free', description: 'Manual camera control' },
    { mode: 'follow', icon: Navigation2, label: 'Follow Bus', description: 'Track hero vehicle' },
    { mode: 'overhead', icon: Camera, label: 'Overhead', description: 'Top-down view' },
    { mode: 'street', icon: Move, label: 'Street', description: 'Ground-level view' },
  ];

  return (
    <div className="w-64 bg-[#0f0f0f] border-r border-gray-800 p-4 space-y-6 overflow-y-auto">
      <div>
        <div className="text-xs text-gray-500 tracking-wider uppercase mb-3">
          Camera Modes
        </div>
        
        <div className="space-y-2">
          {cameraViews.map(({ mode, icon: Icon, label, description }) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                cameraMode === mode
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs opacity-70">{description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-800">
        <div className="text-xs text-gray-500 tracking-wider uppercase mb-3">
          Scene Layers
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => toggleSceneLayer('pedestrians')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
              sceneLayerToggles.pedestrians
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={16} />
              <span className="text-sm">Pedestrians</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${sceneLayerToggles.pedestrians ? 'bg-green-500' : 'bg-gray-600'}`} />
          </button>
          
          <button
            onClick={() => toggleSceneLayer('traffic')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
              sceneLayerToggles.traffic
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Car size={16} />
              <span className="text-sm">Traffic</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${sceneLayerToggles.traffic ? 'bg-green-500' : 'bg-gray-600'}`} />
          </button>
          
          <button
            onClick={() => toggleSceneLayer('foliage')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
              sceneLayerToggles.foliage
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trees size={16} />
              <span className="text-sm">Foliage</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${sceneLayerToggles.foliage ? 'bg-green-500' : 'bg-gray-600'}`} />
          </button>
          
          <button
            onClick={() => toggleSceneLayer('obstacles')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
              sceneLayerToggles.obstacles
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={16} />
              <span className="text-sm">Obstacles</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${sceneLayerToggles.obstacles ? 'bg-green-500' : 'bg-gray-600'}`} />
          </button>
          
          <button
            onClick={() => toggleSceneLayer('debug')}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
              sceneLayerToggles.debug
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bug size={16} />
              <span className="text-sm">Debug</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${sceneLayerToggles.debug ? 'bg-green-500' : 'bg-gray-600'}`} />
          </button>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-800">
        <div className="text-xs text-gray-500 tracking-wider uppercase mb-3">
          Demo Scenarios
        </div>
        
        <button
          onClick={loadStuckScenario}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white transition-all"
        >
          <AlertTriangle size={18} />
          <div className="text-left">
            <div className="text-sm font-medium">Blocked Lane</div>
            <div className="text-xs text-gray-400">Load stuck scenario</div>
          </div>
        </button>
      </div>
    </div>
  );
}
