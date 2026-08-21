import { useRef } from 'react'
import { useInputStore } from '../game/input/inputStore'

type Point = { x: number; y: number }

export function Hud() {
  const setMove = useInputStore((state) => state.setMove)
  const setSprint = useInputStore((state) => state.setSprint)
  const addLook = useInputStore((state) => state.addLook)
  const joystickOrigin = useRef<Point | null>(null)
  const lookPoint = useRef<Point | null>(null)

  return (
    <div className="hud" data-testid="hud">
      <section className="hud-topbar">
        <div className="brand-lockup">
          <span className="brand-kicker">OPENAI // FIELD TEST</span>
          <strong>PROJECT 56</strong>
        </div>
        <div className="status-chip"><i /> LIVE WORLD</div>
      </section>

      <aside className="mission-card">
        <span>FIRST CONTACT</span>
        <strong>Explore the district</strong>
        <p>Move through the boulevard. Camera: drag anywhere on the world.</p>
      </aside>

      <div className="radar" aria-label="Mini map">
        <div className="radar-road radar-road-v" />
        <div className="radar-road radar-road-h" />
        <div className="radar-player" />
        <span>56</span>
      </div>

      <div
        className="look-zone"
        aria-label="Camera look area"
        onPointerDown={(event) => {
          if (event.pointerType !== 'touch') return
          lookPoint.current = { x: event.clientX, y: event.clientY }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (event.pointerType !== 'touch' || !lookPoint.current) return
          const dx = event.clientX - lookPoint.current.x
          const dy = event.clientY - lookPoint.current.y
          addLook(dx * 0.008, dy * 0.006)
          lookPoint.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={() => { lookPoint.current = null }}
        onPointerCancel={() => { lookPoint.current = null }}
      />

      <div
        className="joystick"
        data-testid="joystick"
        onPointerDown={(event) => {
          joystickOrigin.current = { x: event.clientX, y: event.clientY }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!joystickOrigin.current) return
          const dx = event.clientX - joystickOrigin.current.x
          const dy = event.clientY - joystickOrigin.current.y
          const max = 48
          setMove(Math.max(-1, Math.min(1, dx / max)), Math.max(-1, Math.min(1, -dy / max)))
        }}
        onPointerUp={() => {
          joystickOrigin.current = null
          setMove(0, 0)
        }}
        onPointerCancel={() => {
          joystickOrigin.current = null
          setMove(0, 0)
        }}
      >
        <div className="joystick-ring"><div className="joystick-nub" /></div>
      </div>

      <div className="action-cluster" data-testid="action-cluster">
        <button className="action-button action-button-small" type="button" aria-label="Interact">E</button>
        <button
          className="action-button action-button-run"
          type="button"
          aria-label="Sprint"
          onPointerDown={() => setSprint(true)}
          onPointerUp={() => setSprint(false)}
          onPointerCancel={() => setSprint(false)}
        >RUN</button>
      </div>

      <div className="desktop-hint">WASD move · drag to look · Shift sprint</div>
    </div>
  )
}
