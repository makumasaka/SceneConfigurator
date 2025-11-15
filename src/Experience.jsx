import { useMatcapTexture, Center, Text3D, OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
// import { useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

const torusGeometry = new THREE.TorusGeometry( 1, 0.4, 16, 64 )
const material = new THREE.MeshMatcapMaterial()

export default function Experience()
{
    const donutsGroup = useRef()

    const [ matcapTexture ] = useMatcapTexture( '7B5254_E9DCC7_B19986_C8AC91', 256 )

    useEffect(() => {
        matcapTexture.colorSpace = THREE.SRGBColorSpace
        matcapTexture.needsUpdate = true

        material.matcap = matcapTexture
        material.needsUpdate = true
    }, [])

    useFrame((state, delta) => {
        for(const donut of donutsGroup.current.children) {
            donut.rotation.y += delta * 0.1
        }
    })

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <Center>
            <Text3D 
                material={ material }
                font={ '/fonts/helvetiker_regular.typeface.json' } 
                size={ 0.5 }
                height={ 0.2 }
                curveSegments={ 12 }
                bevelEnabled={ true }
                bevelThickness={ 0.03 }
                bevelSize={ 0.02 }
                bevelOffset={ 0 }
                bevelSegments={ 5 }
            >
                Hello World
            </Text3D>
        </Center>

        <group ref={ donutsGroup }>
            { [...Array(100)].map((value, index) =>
                <mesh
                    key={ index }
                    geometry={ torusGeometry }
                    material={ material }
                    position={ [
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    ]}
                    scale={ 0.2 + Math.random() * 0.2 }
                    rotation={ [
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2,
                        0
                    ]}
                />
            )}
        </group>

    </>
}