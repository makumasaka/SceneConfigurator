import { useMemo } from 'react';

export function RoadNetwork() {
  // Create road markings
  const laneMarkings = useMemo(() => {
    const markings = [];
    const roadLength = 60;
    const numMarkings = 20;
    
    for (let i = 0; i < numMarkings; i++) {
      markings.push({
        key: `marking-${i}`,
        position: [0, 0.02, -roadLength / 2 + (i * roadLength) / numMarkings] as [number, number, number],
      });
    }
    return markings;
  }, []);

  const sidewalks = useMemo(() => {
    const roadWidth = 14;
    const sidewalkWidth = 3;
    const roadLength = 60;
    
    return [
      { position: [(roadWidth / 2 + sidewalkWidth / 2), 0.05, 0], width: sidewalkWidth, length: roadLength },
      { position: [-(roadWidth / 2 + sidewalkWidth / 2), 0.05, 0], width: sidewalkWidth, length: roadLength },
    ];
  }, []);

  return (
    <group>
      {/* Ground plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#9BC53D" />
      </mesh>

      {/* Main road - 4 lanes */}
      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 60]} />
        <meshStandardMaterial color="#2C3E50" />
      </mesh>

      {/* Center line (yellow) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshStandardMaterial color="#F1C40F" />
      </mesh>

      {/* Lane markings (white dashed) */}
      {laneMarkings.map(({ key, position }) => (
        <group key={key}>
          <mesh position={[3.5, position[1], position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-3.5, position[1], position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 2]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      {/* Road edges (white solid) */}
      <mesh position={[7, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-7, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.2, 60]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Sidewalks */}
      {sidewalks.map((sidewalk, i) => (
        <mesh
          key={`sidewalk-${i}`}
          receiveShadow
          position={sidewalk.position as [number, number, number]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[sidewalk.width, sidewalk.length]} />
          <meshStandardMaterial color="#95A5A6" />
        </mesh>
      ))}
    </group>
  );
}

