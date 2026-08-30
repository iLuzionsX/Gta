import { useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF } from '@react-three/drei';
import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

export type MissionPhase = 'briefing' | 'pickup' | 'drop' | 'complete';
export type MissionSnapshot = { phase: MissionPhase; progress: number; heat: number; score: number; distance: number; player?: { x: number; y: number } };

type WorldProps = {
  started: boolean;
  joystick: { x: number; y: number };
  sprinting: boolean;
  onSnapshot: (snapshot: MissionSnapshot) => void;
};

const pickupPoint = new THREE.Vector3(-16, 0, 12);
const dropPoint = new THREE.Vector3(24, 0, -14);
const cityPalette = ['#171421', '#21182b', '#2b1c32', '#19262c', '#301d2d', '#182532'];

export function GameWorld({ started, joystick, sprinting, onSnapshot }: WorldProps) {
  const playerRef = useRef<THREE.Group>(null);
  const playerPosition = useRef(new THREE.Vector3(-28, 0, 26));
  const missionPhase = useRef<MissionPhase>(started ? 'pickup' : 'briefing');
  const progress = useRef(started ? 3 : 0);
  const heat = useRef(9);
  const score = useRef(0);
  const lastUiUpdate = useRef(0);
  const keyState = useRef(new Set<string>());
  const { camera } = useThree();

  useEffect(() => {
    missionPhase.current = started ? 'pickup' : 'briefing';
    progress.current = started ? 3 : 0;
    heat.current = 9;
    score.current = 0;
    playerPosition.current.set(-28, 0, 26);
  }, [started]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => keyState.current.add(event.key.toLowerCase());
    const up = (event: KeyboardEvent) => keyState.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;
    const keys = keyState.current;
    const keyboardX = Number(keys.has('d') || keys.has('arrowright')) - Number(keys.has('a') || keys.has('arrowleft'));
    const keyboardY = Number(keys.has('s') || keys.has('arrowdown')) - Number(keys.has('w') || keys.has('arrowup'));
    const input = new THREE.Vector2(keyboardX + joystick.x, keyboardY + joystick.y);
    if (input.lengthSq() > 1) input.normalize();
    const isRunning = sprinting || keys.has('shift');
    const speed = isRunning ? 10.6 : 6.2;

    if (started && missionPhase.current !== 'complete') {
      playerPosition.current.x = THREE.MathUtils.clamp(playerPosition.current.x + input.x * speed * delta, -43, 43);
      playerPosition.current.z = THREE.MathUtils.clamp(playerPosition.current.z + input.y * speed * delta, -39, 39);
      const distanceToTarget = playerPosition.current.distanceTo(missionPhase.current === 'pickup' ? pickupPoint : dropPoint);
      if (missionPhase.current === 'pickup' && distanceToTarget < 3.4) {
        missionPhase.current = 'drop';
        progress.current = 54;
        heat.current = 39;
      }
      if (missionPhase.current === 'drop' && distanceToTarget < 3.8) {
        missionPhase.current = 'complete';
        progress.current = 100;
        score.current = Math.round(420 + Math.max(0, 160 - heat.current));
      }
      heat.current = THREE.MathUtils.clamp(heat.current + (isRunning ? delta * 4.5 : -delta * 1.5), 7, 100);
    }

    player.position.copy(playerPosition.current);
    if (input.lengthSq() > 0.02) player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, Math.atan2(input.x, input.y), 0.22);
    const cameraTarget = new THREE.Vector3(player.position.x + 9, 15.5, player.position.z + 10.5);
    camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 3.2));
    camera.lookAt(player.position.x, 0.6, player.position.z);

    lastUiUpdate.current += delta;
    if (lastUiUpdate.current > 0.12) {
      lastUiUpdate.current = 0;
      const target = missionPhase.current === 'drop' ? dropPoint : pickupPoint;
      onSnapshot({
        phase: missionPhase.current,
        progress: Math.round(progress.current),
        heat: Math.round(heat.current),
        score: score.current,
        distance: started ? playerPosition.current.distanceTo(target) : 0,
        player: { x: ((playerPosition.current.x + 43) / 86) * 100, y: ((playerPosition.current.z + 39) / 78) * 100 },
      });
    }
  });

  return (
    <>
      <color attach="background" args={['#090812']} />
      <fog attach="fog" args={['#0c0a15', 46, 148]} />
      <ambientLight intensity={0.42} color="#ada6d9" />
      <directionalLight position={[-30, 45, 12]} intensity={1.5} color="#ffd4ae" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
      <pointLight position={[-16, 9, 12]} intensity={15} distance={30} color="#ff835f" />
      <pointLight position={[24, 7, -14]} intensity={18} distance={34} color="#44d9db" />
      <Skyline />
      <StreetGrid />
      <CityBlocks />
      <Traffic />
      <Pedestrians />
      <ObjectiveMarker point={missionPhase.current === 'drop' ? dropPoint : pickupPoint} phase={missionPhase.current} />
      <group ref={playerRef} position={[-28, 0, 26]}>
        <PlayerAvatar />
        <pointLight position={[0, 2, 0]} intensity={3.5} distance={5} color="#70e0c6" />
      </group>
    </>
  );
}

function PlayerAvatar() {
  const { scene, animations } = useGLTF('/assets/robot-expressive.glb') as unknown as { scene: THREE.Group; animations: THREE.AnimationClip[] };
  const clone = useMemo(() => scene.clone(true), [scene]);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(clone);
    const clip = animations.find((item) => /walk|run|idle/i.test(item.name)) ?? animations[0];
    if (clip) mixer.current.clipAction(clip).play();
    return () => { mixer.current?.stopAllAction(); };
  }, [animations, clone]);
  useFrame((_, delta) => mixer.current?.update(delta));
  return <primitive object={clone} scale={1.25} position={[0, 0, 0]} />;
}

function Skyline() {
  return (
    <group>
      <mesh position={[0, -0.8, 0]} receiveShadow><boxGeometry args={[110, 1, 100]} /><meshStandardMaterial color="#0d0b14" roughness={1} /></mesh>
      {Array.from({ length: 15 }, (_, index) => {
        const x = -66 + index * 9;
        const height = 8 + ((index * 17) % 15);
        return <mesh key={index} position={[x, height / 2 - 0.6, -61]}><boxGeometry args={[6, height, 4]} /><meshStandardMaterial color={cityPalette[index % cityPalette.length]} roughness={0.8} /></mesh>;
      })}
      {Array.from({ length: 12 }, (_, index) => {
        const z = -46 + index * 8;
        const height = 6 + ((index * 11) % 13);
        return <mesh key={index} position={[58, height / 2 - 0.6, z]}><boxGeometry args={[5, height, 5]} /><meshStandardMaterial color={cityPalette[(index + 2) % cityPalette.length]} roughness={0.8} /></mesh>;
      })}
    </group>
  );
}

function StreetGrid() {
  const roads = [-30, -10, 10, 30];
  return (
    <group>
      <mesh position={[0, -0.25, 0]} receiveShadow><planeGeometry args={[92, 84]} /><meshStandardMaterial color="#26202d" roughness={0.95} /></mesh>
      {roads.map((coordinate) => <group key={coordinate}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[coordinate, -0.16, 0]}><planeGeometry args={[8, 84]} /><meshStandardMaterial color="#101117" roughness={0.94} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, coordinate]}><planeGeometry args={[92, 8]} /><meshStandardMaterial color="#101117" roughness={0.94} /></mesh>
        <RoadMarkings axis="x" coordinate={coordinate} />
        <RoadMarkings axis="z" coordinate={coordinate} />
      </group>)}
    </group>
  );
}

function RoadMarkings({ axis, coordinate }: { axis: 'x' | 'z'; coordinate: number }) {
  return <group>{Array.from({ length: 9 }, (_, index) => {
    const position = -36 + index * 9;
    return <mesh key={index} rotation={[-Math.PI / 2, 0, 0]} position={axis === 'x' ? [position, -0.1, coordinate] : [coordinate, -0.1, position]}><planeGeometry args={axis === 'x' ? [3.2, 0.12] : [0.12, 3.2]} /><meshBasicMaterial color="#dba87c" transparent opacity={0.48} /></mesh>;
  })}</group>;
}

function CityBlocks() {
  const buildings = useMemo(() => [
    [-38, -29, 10, 11, 12, '#251d32', '#e26f61'], [-20, -29, 7, 11, 17, '#1d2732', '#45c9c2'], [-1, -29, 12, 11, 9, '#312036', '#edb36e'],
    [20, -29, 10, 11, 14, '#202337', '#ee7765'], [39, -29, 9, 11, 19, '#2a1c2f', '#4bcbc2'], [-39, -10, 10, 8, 14, '#1c2431', '#f0bb74'],
    [-20, -10, 7, 8, 10, '#35202e', '#ef7867'], [20, -10, 9, 8, 13, '#242036', '#67d6c9'], [39, -10, 9, 8, 9, '#302032', '#c86af1'],
    [-39, 11, 10, 8, 18, '#262037', '#4bc8c0'], [-20, 11, 7, 8, 11, '#282a31', '#ecac6b'], [20, 11, 9, 8, 17, '#281c31', '#e66a71'],
    [39, 11, 9, 8, 13, '#202735', '#61d0b7'], [-38, 30, 10, 8, 10, '#2f2033', '#db7768'], [-20, 30, 7, 8, 16, '#1e2633', '#57c7cd'],
    [20, 30, 9, 8, 10, '#322133', '#e5aa6d'], [39, 30, 9, 8, 15, '#252033', '#cb74e4'],
  ] as const, []);
  return <group>{buildings.map(([x, z, width, depth, height, color, accent], index) => <Building key={index} x={x} z={z} width={width} depth={depth} height={height} color={color} accent={accent} index={index} />)}</group>;
}

function Building({ x, z, width, depth, height, color, accent, index }: { x: number; z: number; width: number; depth: number; height: number; color: string; accent: string; index: number }) {
  const rows = Math.max(2, Math.floor(height / 2));
  const cols = Math.max(2, Math.floor(width / 2));
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2 - 0.2, 0]} castShadow receiveShadow><boxGeometry args={[width, height, depth]} /><meshStandardMaterial color={color} roughness={0.82} metalness={0.12} /></mesh>
      <mesh position={[0, height + 0.06, 0]}><boxGeometry args={[width + 0.35, 0.18, depth + 0.35]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.22} /></mesh>
      {Array.from({ length: rows * cols }, (_, windowIndex) => {
        const col = windowIndex % cols;
        const row = Math.floor(windowIndex / cols);
        const windowX = -width / 2 + 1.2 + col * ((width - 2.4) / Math.max(1, cols - 1));
        const windowY = 1.6 + row * ((height - 2.7) / Math.max(1, rows - 1));
        const lit = (windowIndex + index * 3) % 4 !== 0;
        return <mesh key={windowIndex} position={[windowX, windowY, depth / 2 + 0.012]}><planeGeometry args={[0.72, 0.5]} /><meshBasicMaterial color={lit ? accent : '#0c1018'} transparent opacity={lit ? 0.8 : 0.65} /></mesh>;
      })}
    </group>
  );
}

function ObjectiveMarker({ point, phase }: { point: THREE.Vector3; phase: MissionPhase }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ring.current) return;
    ring.current.rotation.z = state.clock.elapsedTime * 1.6;
    ring.current.position.y = 0.18 + Math.sin(state.clock.elapsedTime * 2.4) * 0.12;
  });
  if (phase === 'briefing' || phase === 'complete') return null;
  const isDrop = phase === 'drop';
  return <group position={point.toArray()}>
    <mesh ref={ring} rotation={[0, 0, 0]}><torusGeometry args={[1.35, 0.075, 10, 36]} /><meshBasicMaterial color={isDrop ? '#55e6d0' : '#ff8a68'} toneMapped={false} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}><circleGeometry args={[1.7, 32]} /><meshBasicMaterial color={isDrop ? '#55e6d0' : '#ff8a68'} transparent opacity={0.12} toneMapped={false} /></mesh>
    <pointLight color={isDrop ? '#55e6d0' : '#ff8a68'} intensity={10} distance={9} />
    <Html center distanceFactor={11} position={[0, 2.4, 0]}><div className={`world-label ${isDrop ? 'teal' : ''}`}><b>{isDrop ? 'SOUTH DOCKS' : 'DEAD DROP'}</b><span>{isDrop ? 'DELIVER' : 'PICK UP'}</span></div></Html>
  </group>;
}

function Traffic() {
  const cars = useMemo(() => [
    { lane: -30, z: -28, color: '#df735e', speed: 4.8 }, { lane: 10, z: 27, color: '#4bc7c0', speed: -5.6 },
    { lane: -10, z: -3, color: '#d8a463', speed: 3.2 }, { lane: 30, z: 15, color: '#b86bea', speed: -4.4 },
  ], []);
  return <group>{cars.map((car, index) => <MovingCar key={index} {...car} />)}</group>;
}

function MovingCar({ lane, z, color, speed }: { lane: number; z: number; color: string; speed: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.z += speed * delta;
    if (ref.current.position.z > 42) ref.current.position.z = -42;
    if (ref.current.position.z < -42) ref.current.position.z = 42;
  });
  return <group ref={ref} position={[lane, 0, z]} rotation={[0, speed > 0 ? 0 : Math.PI, 0]}>
    <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[1.8, 0.55, 3.2]} /><meshStandardMaterial color={color} roughness={0.42} metalness={0.28} /></mesh>
    <mesh position={[0, 0.84, 0.12]}><boxGeometry args={[1.42, 0.42, 1.35]} /><meshStandardMaterial color="#18202b" roughness={0.2} metalness={0.3} /></mesh>
    {[-0.68, 0.68].flatMap((x) => [-1.05, 1.05].map((wheelZ) => <mesh key={`${x}-${wheelZ}`} rotation={[Math.PI / 2, 0, 0]} position={[x, 0.28, wheelZ]}><cylinderGeometry args={[0.25, 0.25, 0.16, 12]} /><meshStandardMaterial color="#08090d" /></mesh>))}
    <pointLight position={[0, 0.66, -1.65]} color={speed > 0 ? '#ff3737' : '#f5f1cc'} intensity={1.8} distance={4} />
  </group>;
}

function Pedestrians() {
  const people = useMemo(() => [-26, -8, 12, 28].map((x, index) => ({ x, z: index % 2 ? -18 : 19, color: ['#d16c64', '#65c9bd', '#e9b46c', '#aa78db'][index] })), []);
  return <group>{people.map((person, index) => <Pedestrian key={index} {...person} offset={index * 0.9} />)}</group>;
}

function Pedestrian({ x, z, color, offset }: { x: number; z: number; color: string; offset: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = x + Math.sin(state.clock.elapsedTime * 0.35 + offset) * 2.7;
    ref.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 2.5 + offset)) * 0.04;
  });
  return <group ref={ref} position={[x, 0, z]}>
    <mesh position={[0, 1.05, 0]} castShadow><capsuleGeometry args={[0.28, 0.82, 5, 8]} /><meshStandardMaterial color={color} roughness={0.78} /></mesh>
    <mesh position={[0, 1.86, 0]} castShadow><sphereGeometry args={[0.28, 12, 8]} /><meshStandardMaterial color="#c98b75" roughness={0.88} /></mesh>
    <pointLight position={[0, 1.4, 0]} color={color} intensity={0.55} distance={2.5} />
  </group>;
}

useGLTF.preload('/assets/robot-expressive.glb');
