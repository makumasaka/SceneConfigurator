import React, { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useOperatorStore } from '../store/useOperatorStore';

export function Environment({ onPointerDown }: { onPointerDown?: (event: ThreeEvent<PointerEvent>) => void }) {
  const sceneLayerToggles = useOperatorStore((state) => state.sceneLayerToggles);

  const trees = useMemo(() => {
    const treeList: {
      id: number;
      position: [number, number, number];
      scale: number;
      trunkHeight: number;
      foliageRadius: number;
    }[] = [];
    const numTrees = 24;
    const minRadius = 20;
    const maxRadius = 40;

    for (let i = 0; i < numTrees; i++) {
      const angle = (i / numTrees) * Math.PI * 2 + Math.random() * 0.5;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      treeList.push({
        id: i,
        position: [x, 0, z] as [number, number, number],
        scale: 0.8 + Math.random() * 0.6,
        trunkHeight: 2 + Math.random() * 1,
        foliageRadius: 1.5 + Math.random() * 0.5,
      });
    }

    return treeList;
  }, []);

  if (!sceneLayerToggles.foliage) return null;

  return (
    <group onPointerDown={onPointerDown}>
      {trees.map((tree) => (
        <group key={tree.id} position={tree.position} scale={tree.scale}>
          {/* Trunk */}
          <mesh position={[0, tree.trunkHeight / 2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, tree.trunkHeight, 8]} />
            <meshStandardMaterial color="#5D4037" />
          </mesh>
          {/* Foliage */}
          <mesh position={[0, tree.trunkHeight + tree.foliageRadius * 0.5, 0]} castShadow>
            <sphereGeometry args={[tree.foliageRadius, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

