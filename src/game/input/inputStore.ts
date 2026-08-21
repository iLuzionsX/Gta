import { create } from 'zustand'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

type InputState = {
  moveX: number
  moveY: number
  sprint: boolean
  lookYaw: number
  lookPitch: number
  playerX: number
  playerY: number
  playerZ: number
  setMove: (x: number, y: number) => void
  setSprint: (value: boolean) => void
  addLook: (yawDelta: number, pitchDelta: number) => void
  setPlayerPosition: (x: number, y: number, z: number) => void
}

export const useInputStore = create<InputState>((set) => ({
  moveX: 0,
  moveY: 0,
  sprint: false,
  lookYaw: 0.55,
  lookPitch: 0.22,
  playerX: 0,
  playerY: 1,
  playerZ: 8,
  setMove: (moveX, moveY) => set({ moveX, moveY }),
  setSprint: (sprint) => set({ sprint }),
  addLook: (yawDelta, pitchDelta) =>
    set((state) => ({
      lookYaw: state.lookYaw - yawDelta,
      lookPitch: clamp(state.lookPitch + pitchDelta, -0.12, 0.72),
    })),
  setPlayerPosition: (playerX, playerY, playerZ) => set({ playerX, playerY, playerZ }),
}))
