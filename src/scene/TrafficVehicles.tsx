import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useOperatorStore } from '../store/useOperatorStore';

interface Vehicle {
  id: number;
  lane: number;
  startZ: number;
  speed: number;
  direction: 1 | -1; // 1 = forward (positive Z), -1 = backward (negative Z)
  color: string;
}

export function TrafficVehicles() {
  const vehicleRefs = useRef<(Group | null)[]>([]);
  const sceneLayerToggles = useOperatorStore((state) => state.sceneLayerToggles);

  const vehicles = useMemo<Vehicle[]>(() => {
    const vehicleList: Vehicle[] = [];
    const numVehicles = 8;
    // Four lanes: negative X = left side (go backward), positive X = right side (go forward)
    const leftLanes = [-5.25, -1.75];  // Travel in negative Z direction (backward)
    const rightLanes = [1.75, 5.25];   // Travel in positive Z direction (forward)
    const colors = ['#3498DB', '#9B59B6', '#E67E22', '#1ABC9C', '#E74C3C', '#F39C12'];

    for (let i = 0; i < numVehicles; i++) {
      const isRightSide = i % 2 === 0;
      const lanes = isRightSide ? rightLanes : leftLanes;
      const lane = lanes[(i >> 1) % lanes.length];
      const direction = isRightSide ? 1 : -1;
      
      vehicleList.push({
        id: i,
        lane,
        startZ: direction === 1 ? ((i * -15) - 30) : ((i * 15) + 30),
        speed: 0.8 + Math.random() * 0.4,
        direction,
        color: colors[i % colors.length],
      });
    }

    return vehicleList;
  }, []);

  useFrame(() => {
    const roadLength = 60;
    vehicleRefs.current.forEach((ref, i) => {
      if (ref && vehicles[i]) {
        const vehicle = vehicles[i];
        
        // Move vehicle in its direction
        ref.position.z += vehicle.speed * 0.1 * vehicle.direction;

        // Loop back when out of bounds
        if (vehicle.direction === 1) {
          // Going forward (positive Z)
          if (ref.position.z > roadLength / 2 + 10) {
            ref.position.z = -roadLength / 2 - 10;
          }
        } else {
          // Going backward (negative Z)
          if (ref.position.z < -roadLength / 2 - 10) {
            ref.position.z = roadLength / 2 + 10;
          }
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
          rotation={[0, vehicle.direction === 1 ? 0 : Math.PI, 0]} // Rotate 180° if going backward
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

