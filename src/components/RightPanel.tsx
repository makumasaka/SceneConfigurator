import type { SceneParameters } from '../App';

interface RightPanelProps {
  activeTab: string;
  parameters: SceneParameters;
  updateParameter: <K extends keyof SceneParameters>(
    category: K,
    updates: Partial<SceneParameters[K]>
  ) => void;
}

export function RightPanel({ activeTab, parameters, updateParameter }: RightPanelProps) {
  return (
    <div className="w-80 bg-[#0f0f0f] border-l border-gray-800 p-4">
      <div className="text-xs text-gray-500 tracking-wider uppercase mb-4">
        World Parameters
      </div>
      
      <div className="space-y-6">
        {(activeTab === 'World' || activeTab === 'Buildings') && (
          <div className="space-y-4">
            <h3 className="text-white">Buildings</h3>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Building Count</label>
                <span className="text-gray-400">{parameters.buildings.count} buildings</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={parameters.buildings.count}
                onChange={(e) =>
                  updateParameter('buildings', { count: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-300 block mb-2">Building Type</label>
              <div className="space-y-2">
                {(['residential', 'commercial', 'industrial'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateParameter('buildings', { type })}
                    className={`w-full px-4 py-2 rounded-lg text-sm transition-all ${
                      parameters.buildings.type === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Building Height</label>
                <span className="text-gray-400">{parameters.buildings.height}m</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={parameters.buildings.height}
                onChange={(e) =>
                  updateParameter('buildings', { height: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        )}
        
        {(activeTab === 'World' || activeTab === 'Nature') && (
          <div className="space-y-4">
            <h3 className="text-white">Trees</h3>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Tree Count</label>
                <span className="text-gray-400">{parameters.trees.count} trees</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={parameters.trees.count}
                onChange={(e) =>
                  updateParameter('trees', { count: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Density</label>
                <span className="text-gray-400">{Math.round(parameters.trees.density * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={parameters.trees.density}
                onChange={(e) =>
                  updateParameter('trees', { density: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>
        )}
        
        {(activeTab === 'World' || activeTab === 'People') && (
          <div className="space-y-4">
            <h3 className="text-white">Pedestrians</h3>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Pedestrian Count</label>
                <span className="text-gray-400">{parameters.pedestrians.count} people</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={parameters.pedestrians.count}
                onChange={(e) =>
                  updateParameter('pedestrians', { count: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Movement Speed</label>
                <span className="text-gray-400">{parameters.pedestrians.speed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={parameters.pedestrians.speed}
                onChange={(e) =>
                  updateParameter('pedestrians', { speed: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </div>
        )}
        
        {(activeTab === 'World' || activeTab === 'Roads') && (
          <div className="space-y-4">
            <h3 className="text-white">Roads</h3>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Lane Count</label>
                <span className="text-gray-400">{parameters.roads.lanes} lanes</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={parameters.roads.lanes}
                onChange={(e) =>
                  updateParameter('roads', { lanes: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Road Length</label>
                <span className="text-gray-400">{parameters.roads.length}m</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                value={parameters.roads.length}
                onChange={(e) =>
                  updateParameter('roads', { length: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="text-gray-300">Vehicle Count</label>
                <span className="text-gray-400">{parameters.vehicles.count} vehicles</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                value={parameters.vehicles.count}
                onChange={(e) =>
                  updateParameter('vehicles', { count: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
