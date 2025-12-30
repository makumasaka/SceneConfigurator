import { useOperatorStore } from '../store/useOperatorStore';
import type { Obstacle as ObstacleType } from '../types';

function ObstacleMesh({ obstacle }: { obstacle: ObstacleType }) {
  const { position, rotation, type, scale = 1 } = obstacle;

  if (type === 'cone') {
    return (
      <group position={[position.x, position.y, position.z]} rotation={[0, rotation, 0]} scale={scale}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.3, 1, 8]} />
          <meshStandardMaterial color="#FF6B35" />
        </mesh>
        {/* Reflective stripes */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.1, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.1, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
    );
  }

  if (type === 'barrier') {
    return (
      <group position={[position.x, position.y, position.z]} rotation={[0, rotation, 0]} scale={scale}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 0.2]} />
          <meshStandardMaterial color="#F39C12" />
        </mesh>
        {/* Stripes */}
        {[-1, 0, 1].map((x) => (
          <mesh key={x} position={[x, 0.5, 0.11]}>
            <boxGeometry args={[0.4, 1, 0.05]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === 'debris') {
    return (
      <group position={[position.x, position.y, position.z]} rotation={[0, rotation, 0]} scale={scale}>
        <mesh position={[0, 0.3, 0]} castShadow rotation={[0.2, 0.3, 0.1]}>
          <boxGeometry args={[0.8, 0.6, 0.5]} />
          <meshStandardMaterial color="#7F8C8D" />
        </mesh>
      </group>
    );
  }

  if (type === 'vehicle') {
    return (
      <group position={[position.x, position.y + 0.75, position.z]} rotation={[0, rotation, 0]} scale={scale}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 3.5]} />
          <meshStandardMaterial color="#95A5A6" />
        </mesh>
      </group>
    );
  }

  return null;
}

export function Obstacles() {
  const obstacles = useOperatorStore((state) => state.obstacles);
  const sceneLayerToggles = useOperatorStore((state) => state.sceneLayerToggles);

  if (!sceneLayerToggles.obstacles) return null;

  return (
    <group>
      {obstacles.map((obstacle) => (
        <ObstacleMesh key={obstacle.id} obstacle={obstacle} />
      ))}
    </group>
  );
}

