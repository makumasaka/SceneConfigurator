import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Scene3D } from './Scene3D';
import type { SceneParameters, CameraView } from '../App';

interface SceneCanvasProps {
  parameters: SceneParameters;
  cameraView: CameraView;
  isAnimating: boolean;
}

export function SceneCanvas({ parameters, cameraView, isAnimating }: SceneCanvasProps) {
  const getCameraPosition = (): [number, number, number] => {
    switch (cameraView) {
      case 'overview':
        return [30, 40, 30];
      case 'street':
        return [5, 2, 15];
      case 'aerial':
        return [25, 50, 25];
      default:
        return [30, 40, 30];
    }
  };

  return (
    <Canvas shadows className="w-full h-full">
      <color attach="background" args={['#9BC53D']} />
      
      <PerspectiveCamera
        makeDefault
        position={getCameraPosition()}
        fov={50}
      />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={10}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 50, 20]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      <Scene3D parameters={parameters} isAnimating={isAnimating} />
    </Canvas>
  );
}
