import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneParameters } from '../App';

interface Scene3DProps {
  parameters: SceneParameters;
  isAnimating: boolean;
}

export function Scene3D({ parameters, isAnimating }: Scene3DProps) {
  const robotaxiRef = useRef<Group>(null);
  const pedestriansRef = useRef<Group[]>([]);
  const vehiclesRef = useRef<Group[]>([]);

  useFrame((state) => {
    if (isAnimating && robotaxiRef.current) {
      // Animate robotaxi along the road
      const time = state.clock.getElapsedTime();
      const roadLength = parameters.roads.length;
      robotaxiRef.current.position.x = Math.sin(time * 0.3) * (roadLength / 2);
      robotaxiRef.current.position.z = (time * 2) % roadLength - roadLength / 2;
      robotaxiRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }

    // Animate pedestrians
    pedestriansRef.current.forEach((ped, i) => {
      if (ped && isAnimating) {
        const time = state.clock.getElapsedTime();
        ped.position.x += Math.sin(time + i) * 0.01 * parameters.pedestrians.speed;
        ped.position.z += Math.cos(time + i) * 0.01 * parameters.pedestrians.speed;
      }
    });

    // Animate other vehicles
    vehiclesRef.current.forEach((vehicle, i) => {
      if (vehicle && isAnimating) {
        const time = state.clock.getElapsedTime();
        const roadLength = parameters.roads.length;
        vehicle.position.z = ((time * 1.5 + i * 10) % roadLength) - roadLength / 2;
      }
    });
  });

  // Generate building positions
  const buildings = Array.from({ length: parameters.buildings.count }, (_, i) => {
    const angle = (i / parameters.buildings.count) * Math.PI * 2;
    const radius = 20 + Math.random() * 10;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      height: parameters.buildings.height * (0.5 + Math.random() * 0.5),
      width: 3 + Math.random() * 2,
      depth: 3 + Math.random() * 2,
    };
  });

  // Generate tree positions
  const trees = Array.from({ length: parameters.trees.count }, (_, i) => {
    const angle = (i / parameters.trees.count) * Math.PI * 2;
    const radius = 15 + Math.random() * 25;
    return {
      x: Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
      z: Math.sin(angle) * radius + (Math.random() - 0.5) * 10,
      scale: 0.8 + Math.random() * parameters.trees.density,
    };
  });

  // Generate pedestrian positions
  const pedestrians = Array.from({ length: parameters.pedestrians.count }, (_, i) => ({
    x: (Math.random() - 0.5) * 30,
    z: (Math.random() - 0.5) * 30,
  }));

  // Generate vehicle positions
  const vehicles = Array.from({ length: parameters.vehicles.count }, (_, i) => ({
    x: -2 + i * 0.5,
    z: -parameters.roads.length / 2 + (i * parameters.roads.length) / parameters.vehicles.count,
  }));

  const getBuildingColor = () => {
    switch (parameters.buildings.type) {
      case 'residential':
        return '#5B9BD5';
      case 'commercial':
        return '#70AD47';
      case 'industrial':
        return '#FFC000';
      default:
        return '#5B9BD5';
    }
  };

  return (
    <group>
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#9BC53D" />
      </mesh>

      {/* Road */}
      <group>
        <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[parameters.roads.lanes * 3.5, parameters.roads.length]} />
          <meshStandardMaterial color="#2C3E50" />
        </mesh>

        {/* Road markings */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              0,
              0.02,
              -parameters.roads.length / 2 + (i * parameters.roads.length) / 10 + 2,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.3, 2]} />
            <meshStandardMaterial color="#F1C40F" />
          </mesh>
        ))}
      </group>

      {/* Buildings */}
      {buildings.map((building, i) => (
        <mesh
          key={`building-${i}`}
          position={[building.x, building.height / 2, building.z]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial color={getBuildingColor()} />
        </mesh>
      ))}

      {/* Trees */}
      {trees.map((tree, i) => (
        <group key={`tree-${i}`} position={[tree.x, 0, tree.z]} scale={tree.scale}>
          {/* Trunk */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, 3, 0]} castShadow>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
      ))}

      {/* Robotaxi (main vehicle) */}
      <group ref={robotaxiRef} position={[0, 0.75, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 1.5, 4]} />
          <meshStandardMaterial color="#E74C3C" />
        </mesh>
        <mesh position={[0, 0.5, 0.5]} castShadow>
          <boxGeometry args={[1.8, 0.8, 2]} />
          <meshStandardMaterial color="#34495E" opacity={0.7} transparent />
        </mesh>
      </group>

      {/* Other vehicles */}
      {vehicles.map((vehicle, i) => (
        <group
          key={`vehicle-${i}`}
          ref={(el) => {
            if (el) vehiclesRef.current[i] = el;
          }}
          position={[vehicle.x, 0.75, vehicle.z]}
        >
          <mesh castShadow>
            <boxGeometry args={[1.8, 1.2, 3.5]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#3498DB' : '#9B59B6'} />
          </mesh>
        </group>
      ))}

      {/* Pedestrians */}
      {pedestrians.map((ped, i) => (
        <group
          key={`pedestrian-${i}`}
          ref={(el) => {
            if (el) pedestriansRef.current[i] = el;
          }}
          position={[ped.x, 0.9, ped.z]}
        >
          {/* Body */}
          <mesh castShadow position={[0, 0, 0]}>
            <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
            <meshStandardMaterial color="#E67E22" />
          </mesh>
          {/* Head */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#FFDAB9" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
