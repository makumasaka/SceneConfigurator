import { useEffect } from 'react';
import { SceneCanvas } from './components/SceneCanvas';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Header } from './components/Header';
import { useOperatorStore } from './store/useOperatorStore';
import { telemetryService } from './services/telemetryService';

export default function App() {
  const setHeroBus = useOperatorStore((state) => state.setHeroBus);
  const loadStuckScenario = useOperatorStore((state) => state.loadStuckScenario);

  // Initialize telemetry service and load demo scenario on mount
  useEffect(() => {
    // Load stuck scenario on startup
    loadStuckScenario();

    // Start telemetry service
    telemetryService.start(2000);

    // Subscribe to telemetry updates
    const unsubscribe = telemetryService.subscribe((update) => {
      setHeroBus(update);
    });

    return () => {
      telemetryService.stop();
      unsubscribe();
    };
  }, [setHeroBus, loadStuckScenario]);

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      <Header />
      
      <div className="flex-1 flex relative overflow-hidden">
        <LeftPanel />
        
        <div className="flex-1 relative">
          <SceneCanvas />
        </div>
        
        <RightPanel />
      </div>
    </div>
  );
}
