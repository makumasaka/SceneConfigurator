import { MeshReflectorMaterial, Float, Text, Html, PivotControls, TransformControls, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'

export default function Experience()
{
    const cube = useRef()
    const sphere = useRef()

    return <>
        <OrbitControls makeDefault enabled={ true } />

        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 4.5 } />
        <ambientLight intensity={ 1.5 } />

        <PivotControls 
            anchor={ [ 0, 0, 0 ] }
            depthTest={ false }
            lineWidth={ 4 }
            axisColors={ [ 'red', 'green', 'blue' ] }
            scale={ 100 }
            fixed={ true }
        >
            <mesh ref={ sphere } position-x={ -2 }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
                <Html 
                    position={[1, 1, 0]}
                    wrapperClass="label"
                    center
                    distanceFactor={ 10 }
                    occlude={[ sphere, cube ]}
                >This is a sphere</Html>
            </mesh>
        </PivotControls>

        <mesh ref={ cube } position-x={ 2 } scale={ 1.5 }>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <TransformControls object={ cube } />

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
                <planeGeometry />
                {/* <meshStandardMaterial color="greenyellow" /> */}
                <MeshReflectorMaterial
                    resolution={ 512 }
                    blur={[ 1000, 1000 ]}
                    mixBlur={ 1 }
                    mirror={ 0.75 }
                    color="greenyellow"
                />
        </mesh>

        <Float
            speed={ 5 }
            rotationIntensity={ 1 }
            floatIntensity={ 2 }
        >
            <Text
                font="./fonts/bangers-v20-latin-regular.woff"
                fontSize={ 1 }
                position-y={ 2 }
                color="salmon"
            >
                I LOVE R3F
            </Text>
        </Float>
    </>
}