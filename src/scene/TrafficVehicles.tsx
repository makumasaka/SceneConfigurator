import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useOperatorStore } from '../store/useOperatorStore';

interface Vehicle {
  id: number;
  lane: number;
  startZ: number;
  speed: number;
  color: string;
}

export function TrafficVehicles() {
  const vehicleRefs = useRef<(Group | null)[]>([]);
  const sceneLayerToggles = useOperatorStore((state) => state.sceneLayerToggles);

  const vehicles = useMemo<Vehicle[]>(() => {
    const vehicleList: Vehicle[] = [];
    const numVehicles = 6;
    const lanes = [-5.25, -1.75, 1.75, 5.25]; // Four lane positions
    const colors = ['#3498DB', '#9B59B6', '#E67E22', '#1ABC9C'];

    for (let i = 0; i < numVehicles; i++) {
      vehicleList.push({
        id: i,
        lane: lanes[i % lanes.length],
        startZ: (i * -15) - 30,
        speed: 0.8 + Math.random() * 0.4,
        color: colors[i % colors.length],
      });
    }

    return vehicleList;
  }, []);

  useFrame((state) => {
    const roadLength = 60;
    vehicleRefs.current.forEach((ref, i) => {
      if (ref && vehicles[i]) {
        // Move vehicle forward
        ref.position.z += vehicles[i].speed * 0.1;

        // Loop back when out of bounds
        if (ref.position.z > roadLength / 2 + 10) {
          ref.position.z = -roadLength / 2 - 10;
        }
      }
    });
  });

  if (!sceneLayerToggles.traffic) return null;

  return (
    <group>
      {vehicles.map((vehicle, i) => (
        <group
          key={vehicle.id}
          ref={(el) => {
            vehicleRefs.current[i] = el;
          }}
          position={[vehicle.lane, 0.6, vehicle.startZ]}
        >
          <mesh castShadow>
            <boxGeometry args={[1.6, 1.2, 3.2]} />
            <meshStandardMaterial color={vehicle.color} />
          </mesh>
          {/* Windows */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[1.5, 0.6, 3]} />
            <meshStandardMaterial color="#34495E" opacity={0.5} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

