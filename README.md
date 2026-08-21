# Project 56

A mobile-first, GTA-like open-world browser game foundation built with React, Three.js (React Three Fiber), Rapier physics, and TypeScript.

## Start

```bash
npm install
npm run dev
```

Desktop: WASD + drag the world to look + Shift to sprint. Mobile: left joystick + drag the right side to look + RUN.

## Quality gates

```bash
npm run build
npm run test:e2e
```

The Playwright suite exercises 1440×900 desktop and 412×915 mobile layouts and records screenshots for visual inspection.

See `docs/FOUNDATION.md` for the architecture and asset strategy.
