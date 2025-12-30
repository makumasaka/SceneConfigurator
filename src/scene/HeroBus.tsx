import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useOperatorStore } from '../store/useOperatorStore';

export function HeroBus() {
  const busRef = useRef<Group>(null);
  const heroBus = useOperatorStore((state) => state.heroBus);
  const cameraMode = useOperatorStore((state) => state.cameraMode);

  // Update bus position and rotation from store
  useEffect(() => {
    if (busRef.current) {
      busRef.current.position.set(
        heroBus.position.x,
        heroBus.position.y,
        heroBus.position.z
      );
      busRef.current.rotation.y = heroBus.rotation;
    }
  }, [heroBus.position, heroBus.rotation]);

  // Optional: Smooth camera follow in follow mode
  useFrame(({ camera }) => {
    if (cameraMode === 'follow' && busRef.current) {
      const targetX = busRef.current.position.x;
      const targetZ = busRef.current.position.z - 15;
      const targetY = 8;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      
      camera.lookAt(busRef.current.position);
    }
  });

  // Color based on autonomy state
  const getBusColor = () => {
    switch (heroBus.autonomyState) {
      case 'stuck':
        return '#E74C3C'; // Red
      case 'awaiting_guidance':
        return '#F39C12'; // Orange
      case 'manual':
        return '#3498DB'; // Blue
      case 'autonomous':
      default:
        return '#27AE60'; // Green
    }
  };

  return (
    <group ref={busRef}>
      {/* Main bus body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.5, 2.5, 6]} />
        <meshStandardMaterial color={getBusColor()} />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.3, 1.2, 5.8]} />
        <meshStandardMaterial color="#34495E" opacity={0.6} transparent />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, -0.5, 3.2]} castShadow>
        <boxGeometry args={[2.5, 0.5, 0.3]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>

      {/* Wheels */}
      {[
        [-0.9, -1, 2],
        [0.9, -1, 2],
        [-0.9, -1, -2],
        [0.9, -1, -2],
      ].map((pos, i) => (
        <mesh key={`wheel-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#2C3E50" />
        </mesh>
      ))}

      {/* Status indicator light on top */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={heroBus.autonomyState === 'stuck' ? '#E74C3C' : '#27AE60'}
          emissive={heroBus.autonomyState === 'stuck' ? '#E74C3C' : '#27AE60'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

