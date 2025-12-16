import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'

function ADUModel({ modelId, finishId, roofId, windowsId }) {
    // Map model IDs to actual file names (fallback to model1 if not found)
    const modelFile = modelId && ['model1', 'model2', 'model3'].includes(modelId) 
        ? modelId 
        : 'model1'
    
    const { scene } = useGLTF(`/models/${modelFile}.glb`)
    const modelRef = useRef()

    useEffect(() => {
        if (scene && modelRef.current) {
            // Clone the scene to avoid issues with multiple instances
            const clonedScene = scene.clone()
            
            // Clear previous children
            while (modelRef.current.children.length > 0) {
                modelRef.current.remove(modelRef.current.children[0])
            }
            
            modelRef.current.add(clonedScene)

            // Apply material changes based on selections
            clonedScene.traverse((child) => {
                if (child.isMesh) {
                    // Apply exterior finish
                    if (child.name.toLowerCase().includes('wall') || child.name.toLowerCase().includes('siding')) {
                        const finishColors = {
                            'siding-wood': '#8B7355',
                            'siding-metal': '#6B7280',
                            'siding-fiber': '#E5E7EB',
                            'siding-stone': '#9CA3AF'
                        }
                        if (child.material) {
                            child.material.color.set(finishColors[finishId] || finishColors['siding-wood'])
                        }
                    }

                    // Apply roof material
                    if (child.name.toLowerCase().includes('roof')) {
                        const roofColors = {
                            'roof-shingle': '#1F2937',
                            'roof-metal': '#4B5563',
                            'roof-tile': '#6B7280'
                        }
                        if (child.material) {
                            child.material.color.set(roofColors[roofId] || roofColors['roof-shingle'])
                        }
                    }

                    // Ensure materials are properly set up
                    if (child.material && !child.material.isMeshStandardMaterial) {
                        const newMaterial = new THREE.MeshStandardMaterial({
                            color: child.material.color || '#ffffff',
                            roughness: 0.7,
                            metalness: 0.1
                        })
                        child.material = newMaterial
                    }
                }
            })
        }
    }, [scene, modelId, finishId, roofId, windowsId])

    return <primitive ref={modelRef} object={scene} scale={1} position={[0, 0, 0]} />
}

export default function Experience({ modelId, finishId, roofId, windowsId }) {
    return (
        <>
            <OrbitControls 
                makeDefault 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={20}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
            />

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} />
            <pointLight position={[0, 8, 0]} intensity={0.3} />

            {/* Environment for realistic lighting */}
            <Environment preset="sunset" />

            {/* Ground plane with shadows */}
            <ContactShadows 
                position={[0, -0.01, 0]} 
                opacity={0.4} 
                scale={10} 
                blur={2.5} 
                far={4.5} 
            />

            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
            </mesh>

            {/* ADU Model */}
            <ADUModel 
                modelId={modelId || 'model1'} 
                finishId={finishId || 'siding-wood'}
                roofId={roofId || 'roof-shingle'}
                windowsId={windowsId || 'windows-standard'}
            />
        </>
    )
}

// Preload models
useGLTF.preload('/models/model1.glb')
useGLTF.preload('/models/model2.glb')
useGLTF.preload('/models/model3.glb')
