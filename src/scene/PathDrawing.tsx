import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Plane, Vector3 } from 'three';
import { useOperatorStore } from '../store/useOperatorStore';

export function PathDrawing() {
  const { camera, raycaster } = useThree();
  const groundPlane = useRef(new Plane(new Vector3(0, 1, 0), 0));
  const [isDrawing, setIsDrawing] = useState(false);

  const isDrawingPath = useOperatorStore((state) => state.isDrawingPath);
  const addPathPoint = useOperatorStore((state) => state.addPathPoint);
  const currentPath = useOperatorStore((state) => state.currentPath);

  const handlePointerDown = (e: any) => {
    if (!isDrawingPath) return;
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    setIsDrawing(true);

    const intersectionPoint = new Vector3();
    raycaster.ray.intersectPlane(groundPlane.current, intersectionPoint);

    if (intersectionPoint) {
      const pointId = `point-${Date.now()}-${Math.random()}`;
      const index = currentPath ? currentPath.points.length : 0;

      addPathPoint({
        id: pointId,
        position: {
          x: intersectionPoint.x,
          y: 0.1, // Slightly above ground
          z: intersectionPoint.z,
        },
        index,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  // Invisible clickable plane for drawing
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      visible={false}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

