import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type TrafficCarProps = {
  laneX: number
  startZ: number
  speed: number
  color: string
  reverse?: boolean
}

export function TrafficCar({ laneX, startZ, speed, color, reverse = false }: TrafficCarProps) {
  const car = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!car.current) return
    const direction = reverse ? 1 : -1
    car.current.position.z += direction * speed * delta
    if (!reverse && car.current.position.z < -94) car.current.position.z = 94
    if (reverse && car.current.position.z > 94) car.current.position.z = -94
  })

  return (
    <group ref={car} position={[laneX, 0.46, startZ]} rotation={[0, reverse ? Math.PI : 0, 0]}>
      <mesh castShadow position={[0, 0.26, 0]}>
        <boxGeometry args={[1.72, 0.46, 3.8]} />
        <meshPhysicalMaterial color={color} metalness={0.58} roughness={0.27} clearcoat={0.9} clearcoatRoughness={0.18} />
      </mesh>
      <mesh castShadow position={[0, 0.68, -0.15]}>
        <boxGeometry args={[1.48, 0.52, 1.8]} />
        <meshPhysicalMaterial color="#273440" metalness={0.16} roughness={0.14} transmission={0.08} />
      </mesh>
      {[-0.82, 0.82].flatMap((x) => [-1.22, 1.22].map((z) => (
        <mesh key={`${x}-${z}`} castShadow position={[x, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.2, 14]} />
          <meshStandardMaterial color="#111217" roughness={0.86} />
        </mesh>
      )))}
    </group>
  )
}
