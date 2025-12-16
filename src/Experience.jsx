import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Grid, Text, Line, Sphere, Box, Cylinder, PivotControls } from '@react-three/drei'
import * as THREE from 'three'

// Bus component
function Bus({ position, rotation, speed = 0 }) {
    const busRef = useRef()
    
    return (
        <group ref={busRef} position={position} rotation={rotation}>
            {/* Bus body */}
            <Box args={[3, 2, 6]} position={[0, 1, 0]}>
                <meshStandardMaterial color="#0066cc" />
            </Box>
            {/* Bus windows */}
            <Box args={[2.8, 1, 0.1]} position={[0, 2, -1]}>
                <meshStandardMaterial color="#87ceeb" />
            </Box>
            <Box args={[2.8, 1, 0.1]} position={[0, 2, 1]}>
                <meshStandardMaterial color="#87ceeb" />
            </Box>
            {/* Wheels */}
            {[-2, 2].map((z) => (
                [-1.5, 1.5].map((x) => (
                    <Cylinder key={`${x}-${z}`} args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]} position={[x, 0.3, z]}>
                        <meshStandardMaterial color="#1a1a1a" />
                    </Cylinder>
                ))
            ))}
            {/* Speed indicator */}
            {speed > 0 && (
                <Text
                    position={[0, 3, 0]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {speed.toFixed(1)} km/h
                </Text>
            )}
        </group>
    )
}

// Spline path visualization
function SplinePath({ points, color = "#00ff00", lineWidth = 2 }) {
    if (!points || points.length < 2) return null
    
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
    const curvePoints = curve.getPoints(200)
    const positions = curvePoints.map(p => [p.x, p.y, p.z])
    
    return (
        <Line
            points={positions}
            color={color}
            lineWidth={lineWidth}
        />
    )
}

// Control point for path editing
function ControlPoint({ position, index, onDrag, color = "#ff6b6b" }) {
    const pointRef = useRef()
    const lastPosition = useRef(new THREE.Vector3(...position))
    
    useFrame(() => {
        if (pointRef.current && onDrag) {
            const worldPos = new THREE.Vector3()
            pointRef.current.getWorldPosition(worldPos)
            
            // Check if position changed significantly
            if (worldPos.distanceTo(lastPosition.current) > 0.1) {
                onDrag([worldPos.x, worldPos.y, worldPos.z])
                lastPosition.current.copy(worldPos)
            }
        }
    })
    
    return (
        <PivotControls
            anchor={[0, 0, 0]}
            depthTest={false}
            lineWidth={2}
            axisColors={['#ff6b6b', '#4ecdc4', '#ffe66d']}
            scale={50}
            fixed={true}
        >
            <group ref={pointRef} position={position}>
                <Sphere args={[0.3, 16, 16]}>
                    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                </Sphere>
                <Text
                    position={[0, 0.5, 0]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {index + 1}
                </Text>
            </group>
        </PivotControls>
    )
}

// External agent types
function Car({ position, rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <Box args={[1.5, 1, 3]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#ff4444" />
            </Box>
            <Box args={[1.3, 0.8, 0.1]} position={[0, 1, 0]}>
                <meshStandardMaterial color="#87ceeb" />
            </Box>
        </group>
    )
}

function Bike({ position, rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <Cylinder args={[0.3, 0.3, 0.1]} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#333" />
            </Cylinder>
            <Box args={[0.1, 0.5, 0.1]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#666" />
            </Box>
        </group>
    )
}

function Pedestrian({ position, rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <Sphere args={[0.15, 8, 8]} position={[0, 1.2, 0]}>
                <meshStandardMaterial color="#ffdbac" />
            </Sphere>
            <Cylinder args={[0.15, 0.15, 0.8]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#4a90e2" />
            </Cylinder>
        </group>
    )
}

function Animal({ position, rotation = [0, 0, 0], type = 'dog' }) {
    const color = type === 'dog' ? '#8b4513' : '#f4a460'
    return (
        <group position={position} rotation={rotation}>
            <Box args={[0.4, 0.3, 0.6]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color={color} />
            </Box>
            <Sphere args={[0.2, 8, 8]} position={[0, 0.4, 0.3]}>
                <meshStandardMaterial color={color} />
            </Sphere>
        </group>
    )
}

function Building({ position, size = [2, 4, 2] }) {
    return (
        <group position={position}>
            <Box args={size} position={[0, size[1] / 2, 0]}>
                <meshStandardMaterial color="#888" />
            </Box>
            {/* Windows */}
            {[0, 1, 2].map((i) => (
                [0, 1].map((j) => (
                    <Box key={`${i}-${j}`} args={[0.3, 0.4, 0.05]} position={[-0.5 + j, 1 + i * 1.2, size[2] / 2 + 0.01]}>
                        <meshStandardMaterial color="#ffff99" emissive="#ffff99" emissiveIntensity={0.3} />
                    </Box>
                ))
            ))}
        </group>
    )
}

export default function Experience({ 
    pathPoints = [],
    busPosition = [0, 0, 0],
    busRotation = [0, 0, 0],
    busSpeed = 0,
    isRunning = false,
    editingPath = false,
    onPathUpdate,
    agents = {},
    showAgents = {}
}) {
    const { camera } = useThree()
    const [localPathPoints, setLocalPathPoints] = useState(pathPoints.length > 0 ? pathPoints : [[0, 0, 0], [5, 0, 5], [10, 0, 0]])
    
    // Update local path when prop changes
    useEffect(() => {
        if (pathPoints.length > 0) {
            setLocalPathPoints(pathPoints)
        }
    }, [pathPoints])
    
    // Generate default agents if not provided
    const defaultAgents = {
        cars: [
            { id: 1, position: [8, 0, 3], rotation: [0, Math.PI / 2, 0] },
            { id: 2, position: [-5, 0, -3], rotation: [0, -Math.PI / 2, 0] },
            { id: 3, position: [15, 0, -5], rotation: [0, 0, 0] }
        ],
        bikes: [
            { id: 1, position: [3, 0, 4], rotation: [0, Math.PI / 4, 0] },
            { id: 2, position: [-3, 0, -4], rotation: [0, -Math.PI / 4, 0] }
        ],
        pedestrians: [
            { id: 1, position: [6, 0, 2], rotation: [0, Math.PI / 3, 0] },
            { id: 2, position: [-4, 0, 5], rotation: [0, -Math.PI / 6, 0] },
            { id: 3, position: [12, 0, -2], rotation: [0, Math.PI, 0] }
        ],
        animals: [
            { id: 1, position: [2, 0, -3], rotation: [0, Math.PI / 2, 0], type: 'dog' },
            { id: 2, position: [-6, 0, 2], rotation: [0, -Math.PI / 2, 0], type: 'cat' }
        ],
        buildings: [
            { id: 1, position: [10, 0, 8], size: [3, 5, 3] },
            { id: 2, position: [-8, 0, -8], size: [4, 6, 4] },
            { id: 3, position: [15, 0, 5], size: [2, 4, 2] },
            { id: 4, position: [-10, 0, 6], size: [3, 5, 3] }
        ]
    }
    
    const activeAgents = Object.keys(agents).length > 0 ? agents : defaultAgents
    const activeShowAgents = Object.keys(showAgents).length > 0 ? showAgents : {
        cars: true,
        bikes: true,
        pedestrians: true,
        animals: true,
        buildings: true
    }
    
    return (
        <>
            <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
            
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <directionalLight position={[-10, 5, -5]} intensity={0.5} />
            
            {/* Ground grid */}
            <Grid args={[50, 50]} cellColor="#444" sectionColor="#666" fadeDistance={30} fadeStrength={1} />
            
            {/* Road surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#2a2a2a" />
            </mesh>
            
            {/* Spline path */}
            {localPathPoints.length >= 2 && (
                <SplinePath points={localPathPoints} color="#00ff00" lineWidth={3} />
            )}
            
            {/* Path control points */}
            {editingPath && localPathPoints.map((point, index) => (
                <ControlPoint
                    key={`point-${index}`}
                    position={point}
                    index={index}
                    onDrag={(newPos) => {
                        const updated = [...localPathPoints]
                        updated[index] = newPos
                        setLocalPathPoints(updated)
                        if (onPathUpdate) {
                            onPathUpdate(updated)
                        }
                    }}
                />
            ))}
            
            {/* Bus */}
            <Bus position={busPosition} rotation={busRotation} speed={busSpeed} />
            
            {/* External Agents */}
            {/* Cars */}
            {activeShowAgents.cars && activeAgents.cars?.map(car => (
                <Car key={car.id} position={car.position} rotation={car.rotation} />
            ))}
            
            {/* Bikes */}
            {activeShowAgents.bikes && activeAgents.bikes?.map(bike => (
                <Bike key={bike.id} position={bike.position} rotation={bike.rotation} />
            ))}
            
            {/* Pedestrians */}
            {activeShowAgents.pedestrians && activeAgents.pedestrians?.map(ped => (
                <Pedestrian key={ped.id} position={ped.position} rotation={ped.rotation} />
            ))}
            
            {/* Animals */}
            {activeShowAgents.animals && activeAgents.animals?.map(animal => (
                <Animal key={animal.id} position={animal.position} rotation={animal.rotation} type={animal.type} />
            ))}
            
            {/* Buildings */}
            {activeShowAgents.buildings && activeAgents.buildings?.map(building => (
                <Building key={building.id} position={building.position} size={building.size} />
            ))}
        </>
    )
}
