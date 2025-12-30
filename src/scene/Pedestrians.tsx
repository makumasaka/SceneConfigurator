import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useOperatorStore } from '../store/useOperatorStore';

interface Pedestrian {
  id: number;
  startX: number;
  startZ: number;
  speed: number;
  direction: number;
  color: string;
}

export function Pedestrians() {
  const pedestrianRefs = useRef<(Group | null)[]>([]);
  const sceneLayerToggles = useOperatorStore((state) => state.sceneLayerToggles);

  const pedestrians = useMemo<Pedestrian[]>(() => {
    const pedList: Pedestrian[] = [];
    const numPeds = 10;
    const colors = ['#E67E22', '#E74C3C', '#3498DB', '#2ECC71', '#F39C12'];

    for (let i = 0; i < numPeds; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      pedList.push({
        id: i,
        startX: side * (9 + Math.random() * 2),
        startZ: (Math.random() - 0.5) * 50,
        speed: 0.3 + Math.random() * 0.2,
        direction: side > 0 ? 1 : -1,
        color: colors[i % colors.length],
      });
    }

    return pedList;
  }, []);

  useFrame(() => {
    pedestrianRefs.current.forEach((ref, i) => {
      if (ref && pedestrians[i]) {
        // Move pedestrian along sidewalk
        ref.position.z += pedestrians[i].speed * pedestrians[i].direction * 0.05;

        // Loop back when out of bounds
        if (ref.position.z > 30) {
          ref.position.z = -30;
        } else if (ref.position.z < -30) {
          ref.position.z = 30;
        }
      }
    });
  });

  if (!sceneLayerToggles.pedestrians) return null;

  return (
    <group>
      {pedestrians.map((ped, i) => (
        <group
          key={ped.id}
          ref={(el) => {
            pedestrianRefs.current[i] = el;
          }}
          position={[ped.startX, 0.9, ped.startZ]}
        >
          {/* Body */}
          <mesh castShadow position={[0, 0, 0]}>
            <capsuleGeometry args={[0.25, 0.8, 4, 8]} />
            <meshStandardMaterial color={ped.color} />
          </mesh>
          {/* Head */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#FFDAB9" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

