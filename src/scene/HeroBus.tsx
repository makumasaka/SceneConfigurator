import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useOperatorStore } from '../store/useOperatorStore';
import * as THREE from 'three';

export function HeroBus() {
  const busRef = useRef<Group>(null);
  const heroBus = useOperatorStore((state) => state.heroBus);
  const cameraMode = useOperatorStore((state) => state.cameraMode);
  const targetPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);

  // Update target position and rotation from store
  useEffect(() => {
    targetPosition.current.set(
      heroBus.position.x,
      heroBus.position.y,
      heroBus.position.z
    );
    targetRotation.current = heroBus.rotation;
  }, [heroBus.position, heroBus.rotation]);

  // Smoothly interpolate to target position and rotation
  useFrame(() => {
    if (busRef.current) {
      // Smooth position interpolation
      busRef.current.position.lerp(targetPosition.current, 0.1);
      
      // Smooth rotation interpolation
      const currentRotation = busRef.current.rotation.y;
      let targetRot = targetRotation.current;
      
      // Handle rotation wrapping
      while (targetRot - currentRotation > Math.PI) targetRot -= Math.PI * 2;
      while (targetRot - currentRotation < -Math.PI) targetRot += Math.PI * 2;
      
      busRef.current.rotation.y += (targetRot - currentRotation) * 0.1;
    }
  });

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

