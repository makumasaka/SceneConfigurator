import { Eye, Navigation, Plane, FileJson, Box } from 'lucide-react';
import type { CameraView } from '../App';

interface LeftPanelProps {
  cameraView: CameraView;
  setCameraView: (view: CameraView) => void;
  onExport: (format: 'json' | 'glb') => void;
}

export function LeftPanel({ cameraView, setCameraView, onExport }: LeftPanelProps) {
  return (
    <div className="w-64 bg-[#0f0f0f] border-r border-gray-800 p-4 space-y-6">
      <div>
        <div className="text-xs text-gray-500 tracking-wider uppercase mb-3">
          Camera Views
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => setCameraView('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              cameraView === 'overview'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Eye size={18} />
              <div>
                <div className="text-sm">Overview</div>
                <div className="text-xs text-gray-500">Bird's-eye view of the entire world</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setCameraView('street')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              cameraView === 'street'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Navigation size={18} />
              <div>
                <div className="text-sm">Street Level</div>
                <div className="text-xs text-gray-500">Ground-level perspective</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setCameraView('aerial')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              cameraView === 'aerial'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Plane size={18} />
              <div>
                <div className="text-sm">Aerial</div>
                <div className="text-xs text-gray-500">High angle diagonal view</div>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-800">
        <div className="text-xs text-gray-500 tracking-wider uppercase mb-3">
          Export Options
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => onExport('json')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
          >
            <FileJson size={18} />
            <span className="text-sm">JSON</span>
          </button>
          
          <button
            onClick={() => onExport('glb')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
          >
            <Box size={18} />
            <span className="text-sm">GLB</span>
          </button>
        </div>
      </div>
    </div>
  );
}
