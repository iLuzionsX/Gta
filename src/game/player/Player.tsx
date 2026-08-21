import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useInputStore } from '../input/inputStore'

const direction = new THREE.Vector3()
const forward = new THREE.Vector3()
const right = new THREE.Vector3()

function StreetwearAvatar() {
  return (
    <group position={[0, -0.02, 0]}>
      <mesh castShadow position={[0, 1.24, 0]}>
        <capsuleGeometry args={[0.34, 0.72, 5, 10]} />
        <meshStandardMaterial color="#10131a" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.27, 16, 12]} />
        <meshStandardMaterial color="#a96f52" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 2.06, -0.01]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.47]} />
        <meshStandardMaterial color="#15171b" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-0.16, 0.55, 0]}>
        <capsuleGeometry args={[0.105, 0.62, 4, 8]} />
        <meshStandardMaterial color="#293247" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0.16, 0.55, 0]}>
        <capsuleGeometry args={[0.105, 0.62, 4, 8]} />
        <meshStandardMaterial color="#293247" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0.31]}>
        <boxGeometry args={[0.46, 0.22, 0.08]} />
        <meshStandardMaterial color="#ebddc2" emissive="#ff7a39" emissiveIntensity={0.16} roughness={0.82} />
      </mesh>
    </group>
  )
}

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const avatar = useRef<THREE.Group>(null)
  const setPlayerPosition = useInputStore((state) => state.setPlayerPosition)

  useFrame((_, delta) => {
    const rigidBody = body.current
    if (!rigidBody) return

    const { moveX, moveY, sprint, lookYaw } = useInputStore.getState()
    const velocity = rigidBody.linvel()
    const speed = sprint ? 8.8 : 5.4

    forward.set(-Math.sin(lookYaw), 0, -Math.cos(lookYaw))
    right.set(Math.cos(lookYaw), 0, -Math.sin(lookYaw))
    direction.copy(forward).multiplyScalar(moveY).addScaledVector(right, moveX)
    if (direction.lengthSq() > 0.001) direction.normalize()

    rigidBody.setLinvel(
      {
        x: THREE.MathUtils.damp(velocity.x, direction.x * speed, 10, delta),
        y: velocity.y,
        z: THREE.MathUtils.damp(velocity.z, direction.z * speed, 10, delta),
      },
      true,
    )

    if (avatar.current && direction.lengthSq() > 0.001) {
      const targetYaw = Math.atan2(direction.x, direction.z)
      let deltaYaw = targetYaw - avatar.current.rotation.y
      deltaYaw = Math.atan2(Math.sin(deltaYaw), Math.cos(deltaYaw))
      avatar.current.rotation.y += deltaYaw * Math.min(1, delta * 12)
    }

    const position = rigidBody.translation()
    setPlayerPosition(position.x, position.y, position.z)
  })

  return (
    <RigidBody ref={body} colliders={false} lockRotations position={[0, 2.2, 9]} friction={0.4} linearDamping={4.6}>
      <CapsuleCollider args={[0.64, 0.4]} position={[0, 1.03, 0]} />
      <group ref={avatar}>
        <StreetwearAvatar />
      </group>
    </RigidBody>
  )
}
