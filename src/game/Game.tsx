import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import { Player } from './player/Player'
import { FollowCamera } from './player/FollowCamera'
import { StarterDistrict } from './world/StarterDistrict'

export function Game() {
  return (
    <Canvas
      className="game-canvas"
      shadows
      dpr={[1, 1.6]}
      camera={{ fov: 52, near: 0.1, far: 520, position: [7, 6, 14] }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMappingExposure = 1.08
      }}
    >
      <color attach="background" args={['#a7b2bd']} />
      <fog attach="fog" args={['#a8b2bc', 80, 270]} />
      <Sky distance={450000} sunPosition={[8, 5, -14]} turbidity={6} rayleigh={1.1} mieCoefficient={0.007} />
      <hemisphereLight intensity={1.1} color="#d9e9ff" groundColor="#3a2d2a" />
      <directionalLight
        castShadow
        position={[34, 52, 18]}
        intensity={3.2}
        color="#ffe0b1"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-72}
        shadow-camera-right={72}
        shadow-camera-top={72}
        shadow-camera-bottom={-72}
      />
      <Physics gravity={[0, -22, 0]} timeStep="vary">
        <StarterDistrict />
        <Player />
      </Physics>
      <FollowCamera />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
