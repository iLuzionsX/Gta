import { useMemo, useRef } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TrafficCar } from '../vehicles/TrafficCar'

type BuildingSpec = {
  x: number
  z: number
  width: number
  depth: number
  height: number
  tint: string
  accent: string
}

const buildingPalette = ['#6f777d', '#8e8379', '#645f61', '#889093', '#776e68', '#7d8582']
const accentPalette = ['#ffb560', '#8fd3ff', '#d2e8ce']

function makeBuildings(): BuildingSpec[] {
  const items: BuildingSpec[] = []
  for (let z = -72; z <= 72; z += 18) {
    for (const side of [-1, 1]) {
      for (let slot = 0; slot < 2; slot += 1) {
        const seed = Math.abs((z + 89) * 17 + side * 13 + slot * 29)
        items.push({
          x: side * (18 + slot * 10),
          z: z + (slot === 0 ? -3 : 4),
          width: 7.5 + (seed % 5),
          depth: 11 + (seed % 4),
          height: 8 + (seed % 22),
          tint: buildingPalette[seed % buildingPalette.length],
          accent: accentPalette[seed % accentPalette.length],
        })
      }
    }
  }
  return items
}

function Building({ spec }: { spec: BuildingSpec }) {
  const rows = Math.max(2, Math.floor(spec.height / 3.5))
  return (
    <group position={[spec.x, 0, spec.z]}>
      <mesh castShadow receiveShadow position={[0, spec.height / 2, 0]}>
        <boxGeometry args={[spec.width, spec.height, spec.depth]} />
        <meshStandardMaterial color={spec.tint} roughness={0.86} metalness={0.05} />
      </mesh>
      <mesh castShadow position={[0, spec.height + 0.35, 0]}>
        <boxGeometry args={[spec.width * 0.78, 0.7, spec.depth * 0.76]} />
        <meshStandardMaterial color="#3b4144" roughness={0.8} />
      </mesh>
      {Array.from({ length: rows }).map((_, row) => (
        <mesh key={row} position={[spec.x > 0 ? -spec.width / 2 - 0.012 : spec.width / 2 + 0.012, 2.2 + row * 3.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1.25, spec.depth * 0.78]} />
          <meshStandardMaterial color={spec.accent} emissive={spec.accent} emissiveIntensity={0.16 + (row % 3) * 0.05} roughness={0.46} />
        </mesh>
      ))}
    </group>
  )
}

function Palm({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh castShadow position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 5.4, 8]} />
        <meshStandardMaterial color="#71523e" roughness={1} />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => (
        <mesh key={index} castShadow position={[0, 5.35, 0]} rotation={[0.18 + (index % 2) * 0.14, index * (Math.PI * 2 / 7), 0.72]}>
          <boxGeometry args={[0.18, 2.5, 0.62]} />
          <meshStandardMaterial color="#496b4e" roughness={0.98} />
        </mesh>
      ))}
    </group>
  )
}

function Pedestrian({ startX, startZ, phase, jacket }: { startX: number; startZ: number; phase: number; jacket: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime * 0.62 + phase
    ref.current.position.z = startZ + Math.sin(t) * 9
    ref.current.rotation.y = Math.cos(t) >= 0 ? 0 : Math.PI
  })
  return (
    <group ref={ref} position={[startX, 0, startZ]}>
      <mesh castShadow position={[0, 1.25, 0]}>
        <capsuleGeometry args={[0.24, 0.86, 4, 8]} />
        <meshStandardMaterial color={jacket} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#aa745d" roughness={0.95} />
      </mesh>
    </group>
  )
}

function StreetFurniture() {
  const lamps = useMemo(() => Array.from({ length: 13 }, (_, index) => -72 + index * 12), [])
  return (
    <>
      {lamps.map((z) => (
        <group key={z}>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 8.2, 0, z]}>
              <mesh castShadow position={[0, 2.7, 0]}>
                <cylinderGeometry args={[0.07, 0.11, 5.4, 8]} />
                <meshStandardMaterial color="#25292d" metalness={0.62} roughness={0.52} />
              </mesh>
              <mesh position={[side * -0.45, 5.2, 0]}>
                <boxGeometry args={[0.9, 0.12, 0.12]} />
                <meshStandardMaterial color="#272b2f" metalness={0.55} roughness={0.5} />
              </mesh>
              <mesh position={[side * -0.83, 5.05, 0]}>
                <sphereGeometry args={[0.13, 8, 8]} />
                <meshStandardMaterial color="#ffd693" emissive="#ffad4e" emissiveIntensity={2.2} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </>
  )
}

export function StarterDistrict() {
  const buildings = useMemo(makeBuildings, [])

  return (
    <group>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[48, 0.1, 98]} position={[0, -0.12, 0]} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[96, 196]} />
          <meshStandardMaterial color="#716d67" roughness={1} />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
          <planeGeometry args={[14, 196]} />
          <meshStandardMaterial color="#252a2d" roughness={0.98} />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-9.6, 0.03, 0]}>
          <planeGeometry args={[4.7, 196]} />
          <meshStandardMaterial color="#a9a7a0" roughness={0.96} />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[9.6, 0.03, 0]}>
          <planeGeometry args={[4.7, 196]} />
          <meshStandardMaterial color="#a9a7a0" roughness={0.96} />
        </mesh>
      </RigidBody>

      {Array.from({ length: 18 }).map((_, index) => (
        <mesh key={index} position={[0, 0.045, -82 + index * 10]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 4]} />
          <meshBasicMaterial color="#e9dcc2" />
        </mesh>
      ))}

      {buildings.map((spec, index) => <Building key={`${spec.x}-${spec.z}-${index}`} spec={spec} />)}
      <StreetFurniture />

      {[-60, -28, 8, 42, 69].flatMap((z, index) => [
        <Palm key={`left-${z}`} x={-12.6} z={z} scale={0.85 + (index % 2) * 0.12} />,
        <Palm key={`right-${z}`} x={12.6} z={z + 5} scale={0.92 + ((index + 1) % 2) * 0.1} />,
      ])}

      <TrafficCar laneX={-3.1} startZ={48} speed={11} color="#d84b3d" />
      <TrafficCar laneX={-3.1} startZ={-16} speed={8.5} color="#ece9de" />
      <TrafficCar laneX={3.1} startZ={-42} speed={10} color="#355c76" reverse />
      <TrafficCar laneX={3.1} startZ={22} speed={7.6} color="#272b2d" reverse />

      <Pedestrian startX={-10.2} startZ={20} phase={0} jacket="#bd5b43" />
      <Pedestrian startX={10.4} startZ={-12} phase={1.8} jacket="#3d5972" />
      <Pedestrian startX={-11.1} startZ={-48} phase={3.2} jacket="#d3c36a" />
      <Pedestrian startX={11} startZ={54} phase={4.3} jacket="#55765c" />
    </group>
  )
}
