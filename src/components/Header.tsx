import { RotateCcw, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onResetWorld: () => void;
  onExportConfig: () => void;
}

export function Header({ activeTab, setActiveTab, onResetWorld, onExportConfig }: HeaderProps) {
  const tabs = ['World', 'Roads', 'Buildings', 'Nature', 'People'];

  return (
    <header className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-xs text-gray-400 tracking-wider uppercase mb-1">
              Procedural World Builder
            </div>
            <h1 className="text-white text-xl">3D World Generator</h1>
          </div>
          
          <nav className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onResetWorld}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            Reset World
          </button>
          <button
            onClick={onExportConfig}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <Download size={16} />
            Export Config
          </button>
        </div>
      </div>
    </header>
  );
}
