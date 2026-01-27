import React from 'react';
import { Line } from '@react-three/drei';
import { useOperatorStore } from '../store/useOperatorStore';

export function DistanceMeasurement() {
  const distanceMeasurement = useOperatorStore((state) => state.distanceMeasurement);

  const points = distanceMeasurement?.points ?? [];
  const linePoints =
    points.length === 2
      ? points.map((p) => [p.x, p.y, p.z] as [number, number, number])
      : null;

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={`${point.x}-${point.z}-${index}`} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#FBBF24" emissive="#FBBF24" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {linePoints && (
        <Line
          points={linePoints}
          color="#FBBF24"
          lineWidth={2}
          dashed
          dashScale={2}
          dashSize={0.5}
          gapSize={0.3}
        />
      )}
    </group>
  );
}
