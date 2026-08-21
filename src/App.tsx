import { Suspense, useEffect } from 'react'
import { Game } from './game/Game'
import { Hud } from './ui/Hud'
import { useInputStore } from './game/input/inputStore'

function InputBridge() {
  const setMove = useInputStore((state) => state.setMove)
  const setSprint = useInputStore((state) => state.setSprint)
  const addLook = useInputStore((state) => state.addLook)

  useEffect(() => {
    const keys = new Set<string>()
    const syncMovement = () => {
      const x = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'))
      const y = Number(keys.has('KeyW') || keys.has('ArrowUp')) - Number(keys.has('KeyS') || keys.has('ArrowDown'))
      const length = Math.hypot(x, y) || 1
      setMove(x / length, y / length)
      setSprint(keys.has('ShiftLeft') || keys.has('ShiftRight'))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      keys.add(event.code)
      syncMovement()
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.code)
      syncMovement()
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.buttons === 1 && (event.target as HTMLElement)?.tagName === 'CANVAS') {
        addLook(event.movementX * 0.0035, event.movementY * 0.0026)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('pointermove', onPointerMove)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [addLook, setMove, setSprint])

  return null
}

export function App() {
  return (
    <main className="app-shell">
      <InputBridge />
      <Suspense fallback={<div className="loading-screen">Loading district…</div>}>
        <Game />
      </Suspense>
      <Hud />
    </main>
  )
}
