# City After Dark

An original, mobile-first urban action-game vertical slice built with React Three Fiber. The repo is named `Gta`, but the game uses its own world, visual language, characters, and assets: a neon dusk district, a delivery run, touch controls, moving traffic, NPCs, heat, score, and a minimap.

## Run it

```bash
npm install
npm run dev
```

Open the local URL, tap **Take the run**, then use the touch joystick and **RUN** button. On desktop, use WASD/arrows and Shift.

## Qwen delegation

`scripts/qwen-agents.mjs` fans out three independent Qwen roles—creative director, mobile engineer, and world designer—against the current repo context. The lead engineer integrates the returned decisions:

```bash
npm run qwen:agents
```

Inferway permits keyless requests under its free-use caps; set `INFERWAY_API_KEY` later for an authenticated account:

```bash
export INFERWAY_API_KEY="inferway_live_..."
npm run qwen:agents
```

The app itself never ships an API key to the browser. The model is `inferway/qwen3.8-27b` at `https://api.inferway.ai/v1`.

## Checks

```bash
npm run build
npm run test:e2e
```

