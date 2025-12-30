import { useMemo } from 'react';

export function Buildings() {
  const buildings = useMemo(() => {
    const buildingList = [];
    const numBuildings = 16;
    const radius = 25;

    for (let i = 0; i < numBuildings; i++) {
      const angle = (i / numBuildings) * Math.PI * 2;
      const x = Math.cos(angle) * (radius + Math.random() * 10);
      const z = Math.sin(angle) * (radius + Math.random() * 10);
      
      buildingList.push({
        id: i,
        position: [x, 0, z] as [number, number, number],
        width: 4 + Math.random() * 3,
        height: 8 + Math.random() * 15,
        depth: 4 + Math.random() * 3,
        color: i % 3 === 0 ? '#5B9BD5' : i % 3 === 1 ? '#70AD47' : '#ED7D31',
      });
    }

    return buildingList;
  }, []);

  return (
    <group>
      {buildings.map((building) => (
        <mesh
          key={building.id}
          position={[building.position[0], building.height / 2, building.position[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
    </group>
  );
}

