import { useMemo, useRef } from 'react';
import { Line } from '@react-three/drei';
import { useOperatorStore } from '../store/useOperatorStore';
import type { PathPoint } from '../types';
import * as THREE from 'three';

function ControlPoint({ point, onDrag }: { point: PathPoint; onDrag?: (id: string, position: THREE.Vector3) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    
    const onPointerMove = (moveEvent: PointerEvent) => {
      // Simple drag logic - in production, use raycasting
      if (meshRef.current && onDrag) {
        // This is simplified; proper implementation would use raycasting to ground plane
        const newPos = meshRef.current.position.clone();
        onDrag(point.id, newPos);
      }
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  return (
    <mesh
      ref={meshRef}
      position={[point.position.x, point.position.y + 0.5, point.position.z]}
      onPointerDown={handlePointerDown}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color="#3498DB"
        emissive="#3498DB"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export function PathVisualization() {
  const currentPath = useOperatorStore((state) => state.currentPath);
  const updatePathPoint = useOperatorStore((state) => state.updatePathPoint);

  const linePoints = useMemo(() => {
    if (!currentPath || currentPath.points.length < 2) return null;
    
    return currentPath.points.map((p) => [p.position.x, p.position.y, p.position.z] as [number, number, number]);
  }, [currentPath]);

  const pathColor = useMemo(() => {
    if (!currentPath) return '#3498DB';
    
    switch (currentPath.status) {
      case 'draft':
        return '#3498DB'; // Blue
      case 'submitted':
        return '#F39C12'; // Orange
      case 'accepted':
        return '#27AE60'; // Green
      case 'rejected':
        return '#E74C3C'; // Red
      default:
        return '#3498DB';
    }
  }, [currentPath?.status]);

  const handlePointDrag = (pointId: string, position: THREE.Vector3) => {
    updatePathPoint(pointId, {
      x: position.x,
      y: 0.1,
      z: position.z,
    });
  };

  if (!currentPath || currentPath.points.length === 0) return null;

  return (
    <group>
      {/* Path line */}
      {linePoints && linePoints.length >= 2 && (
        <Line
          points={linePoints}
          color={pathColor}
          lineWidth={3}
          dashed={currentPath.status === 'draft'}
          dashScale={2}
          dashSize={0.5}
          gapSize={0.3}
        />
      )}

      {/* Control points */}
      {currentPath.status === 'draft' &&
        currentPath.points.map((point) => (
          <ControlPoint key={point.id} point={point} onDrag={handlePointDrag} />
        ))}

      {/* Start marker */}
      {currentPath.points.length > 0 && (
        <mesh position={[
          currentPath.points[0].position.x,
          currentPath.points[0].position.y + 1,
          currentPath.points[0].position.z
        ]}>
          <coneGeometry args={[0.4, 0.8, 4]} />
          <meshStandardMaterial color="#27AE60" emissive="#27AE60" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* End marker */}
      {currentPath.points.length > 1 && (
        <mesh position={[
          currentPath.points[currentPath.points.length - 1].position.x,
          currentPath.points[currentPath.points.length - 1].position.y + 1,
          currentPath.points[currentPath.points.length - 1].position.z
        ]}>
          <coneGeometry args={[0.4, 0.8, 4]} />
          <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
}

