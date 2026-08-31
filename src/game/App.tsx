import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, Vector2 } from 'three';
import { GameWorld, type MissionSnapshot } from './World';

type StickVector = { x: number; y: number };

const initialMission: MissionSnapshot = {
  phase: 'briefing',
  progress: 0,
  heat: 9,
  score: 0,
  distance: 0,
};

export function App() {
  const [mission, setMission] = useState(initialMission);
  const [stick, setStick] = useState<StickVector>({ x: 0, y: 0 });
  const [sprinting, setSprinting] = useState(false);
  const [started, setStarted] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const startRun = useCallback(() => {
    setStarted(true);
    setMission((current) => ({ ...current, phase: 'pickup', progress: 3 }));
  }, []);

  const restartRun = useCallback(() => {
    setMission(initialMission);
    setStick({ x: 0, y: 0 });
    setSprinting(false);
    setStarted(false);
    setRunKey((key) => key + 1);
  }, []);

  return (
    <main className="game-shell">
      <Canvas
        key={runKey}
        className="game-canvas"
        camera={{ position: [13, 15, 13], fov: 47, near: 0.1, far: 260 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, toneMapping: ACESFilmicToneMapping }}
        shadows
      >
        <Suspense fallback={null}>
          <GameWorld
            started={started}
            joystick={stick}
            sprinting={sprinting}
            onSnapshot={setMission}
          />
        </Suspense>
      </Canvas>

      <div className="vignette" />
      <div className="scanlines" />
      <Hud mission={mission} started={started} onRestart={restartRun} />

      {!started && (
        <section className="briefing-card glass-card" aria-label="Mission briefing">
          <div className="eyebrow"><span className="pulse-dot" /> NIGHT SHIFT / 01</div>
          <h1>Make the city<br /><em>remember you.</em></h1>
          <p>One package. Two blocks. Leave a mark before the skyline resets.</p>
          <button className="primary-button" type="button" onClick={startRun}>
            Take the run <span>↗</span>
          </button>
          <div className="briefing-meta"><span>TOUCH READY</span><span>•</span><span>WASD / ARROWS</span></div>
        </section>
      )}

      {started && mission.phase !== 'complete' && (
        <TouchControls
          onMove={setStick}
          onSprintChange={setSprinting}
        />
      )}

      {mission.phase === 'complete' && (
        <section className="complete-card glass-card" aria-label="Mission complete">
          <div className="eyebrow"><span className="pulse-dot success" /> RUN COMPLETE</div>
          <div className="complete-score">+{mission.score.toLocaleString()}</div>
          <p>The city noticed. The city always notices.</p>
          <button className="primary-button" type="button" onClick={restartRun}>Run it again <span>↗</span></button>
        </section>
      )}
    </main>
  );
}

function Hud({ mission, started, onRestart }: { mission: MissionSnapshot; started: boolean; onRestart: () => void }) {
  const phaseLabel = mission.phase === 'briefing' ? 'STANDBY' : mission.phase === 'pickup' ? 'COLLECT' : mission.phase === 'drop' ? 'DELIVER' : 'CLEAR';
  const stars = Math.min(5, Math.max(0, Math.ceil(mission.heat / 22)));

  return (
    <div className="hud-layer">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">GTA<span>•</span></div>
          <div><div className="brand-title">CITY AFTER DARK</div><div className="brand-subtitle">AN ORIGINAL URBAN RUN</div></div>
        </div>
        <div className="topbar-actions">
          <div className="signal"><span className="signal-bars"><i /><i /><i /><i /></span><span>LIVE CITY</span></div>
          {started && <button className="icon-button" type="button" onClick={onRestart} aria-label="Restart run">↻</button>}
        </div>
      </header>

      <div className="hud-grid">
        <section className="mission-panel glass-card">
          <div className="panel-kicker"><span>MISSION 01</span><span className="phase-pill">{phaseLabel}</span></div>
          <h2>{mission.phase === 'pickup' ? 'Find the package' : mission.phase === 'drop' ? 'Lose the heat' : mission.phase === 'complete' ? 'Delivered' : 'The Night Run'}</h2>
          <p>{mission.phase === 'pickup' ? 'A dead drop is glowing near the old theater.' : mission.phase === 'drop' ? 'Cross the district. The south docks are waiting.' : 'A tiny job for a city with a long memory.'}</p>
          <div className="progress-track"><span style={{ width: `${mission.progress}%` }} /></div>
          <div className="mission-footer"><span>{Math.round(mission.distance)}m TO TARGET</span><span>{mission.progress}%</span></div>
        </section>

        <MiniMap mission={mission} />
      </div>

      {started && <div className="center-reticle" aria-hidden="true"><span /><span /></div>}

      <div className="bottom-hud">
        <div className="status-cluster glass-card"><span className="status-label">HEAT</span><span className="stars">{Array.from({ length: 5 }, (_, index) => <b key={index} className={index < stars ? 'lit' : ''}>✦</b>)}</span><span className="heat-value">{String(Math.round(mission.heat)).padStart(2, '0')}</span></div>
        <div className="status-cluster glass-card score-cluster"><span className="status-label">CASHFLOW</span><span className="cash">${mission.score.toLocaleString()}</span></div>
      </div>
    </div>
  );
}

function MiniMap({ mission }: { mission: MissionSnapshot }) {
  const player = mission.player ?? { x: 50, y: 58 };
  const target = mission.phase === 'pickup' ? { x: 28, y: 70 } : { x: 78, y: 25 };
  return (
    <section className="minimap-panel glass-card" aria-label="District minimap">
      <div className="map-header"><span>LOWER MERIDIAN</span><span className="map-live">● REC</span></div>
      <div className="minimap">
        <div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" />
        <div className="map-block block-a" /><div className="map-block block-b" /><div className="map-block block-c" />
        {mission.phase !== 'complete' && <span className="map-target" style={{ left: `${target.x}%`, top: `${target.y}%` }}>◆</span>}
        <span className="map-player" style={{ left: `${player.x}%`, top: `${player.y}%` }} />
      </div>
      <div className="map-footer"><span>◉ NORTH</span><span>07:43 PM</span></div>
    </section>
  );
}

function TouchControls({ onMove, onSprintChange }: { onMove: (vector: StickVector) => void; onSprintChange: (active: boolean) => void }) {
  const padRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const radius = rect.width * 0.34;
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    const length = Math.max(1, Math.hypot(dx, dy));
    const amount = Math.min(1, length / radius);
    onMove({ x: (dx / length) * amount, y: (dy / length) * amount });
  };

  const release = () => { pointerId.current = null; onMove({ x: 0, y: 0 }); };

  return (
    <div className="touch-controls">
      <div
        ref={padRef}
        className="joystick"
        onPointerDown={(event) => { pointerId.current = event.pointerId; event.currentTarget.setPointerCapture(event.pointerId); updateFromPointer(event.clientX, event.clientY); }}
        onPointerMove={(event) => { if (pointerId.current === event.pointerId) updateFromPointer(event.clientX, event.clientY); }}
        onPointerUp={release}
        onPointerCancel={release}
      ><span className="joystick-ring" /><span className="joystick-knob" /></div>
      <button
        className="sprint-button"
        type="button"
        onPointerDown={() => onSprintChange(true)}
        onPointerUp={() => onSprintChange(false)}
        onPointerCancel={() => onSprintChange(false)}
        aria-label="Sprint"
      ><span>↯</span><small>RUN</small></button>
    </div>
  );
}

