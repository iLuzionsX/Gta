import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useInputStore } from '../input/inputStore'

const target = new THREE.Vector3()
const desired = new THREE.Vector3()
const lookAt = new THREE.Vector3()

export function FollowCamera() {
  const camera = useThree((state) => state.camera)

  useFrame((_, delta) => {
    const { playerX, playerY, playerZ, lookYaw, lookPitch } = useInputStore.getState()
    target.set(playerX, playerY + 1.25, playerZ)

    const distance = 6.8
    const horizontal = Math.cos(lookPitch) * distance
    desired.set(
      target.x + Math.sin(lookYaw) * horizontal,
      target.y + 1.25 + Math.sin(lookPitch) * distance,
      target.z + Math.cos(lookYaw) * horizontal,
    )

    const smoothing = 1 - Math.exp(-delta * 9)
    camera.position.lerp(desired, smoothing)
    lookAt.lerp(target, 1 - Math.exp(-delta * 13))
    camera.lookAt(lookAt)
  })

  return null
}
