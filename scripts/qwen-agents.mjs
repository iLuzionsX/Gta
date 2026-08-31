import process from 'node:process';
import { readFile } from 'node:fs/promises';

const endpoint = 'https://api.inferway.ai/v1/chat/completions';
const model = process.env.INFERWAY_MODEL?.trim() || 'inferway/qwen3.8-27b';
const apiKey = process.env.INFERWAY_API_KEY?.trim();
const contextPaths = ['README.md', 'src/game/App.tsx', 'src/game/World.tsx', 'src/styles.css'];

const briefs = [
  ['creative-director', 'Audit the visual language and player fantasy. Return five high-impact improvements with exact files or components to touch. Preserve the original, legal-safe City After Dark identity; do not propose copyrighted GTA assets.'],
  ['mobile-engineer', 'Audit the iPhone Safari experience. Return five fixes for touch input, camera feel, frame time, resize/safe-area behavior, or accessibility. Rank them by impact and point to exact files or components.'],
  ['world-designer', 'Audit the district as a playable place. Return three premium environmental-storytelling details and one mission-beat improvement that can be built with the existing Three.js primitives, lights, and GLB asset. Keep scope small.'],
];

async function loadRepoBrief() {
  const sections = await Promise.all(contextPaths.map(async (path) => {
    try {
      const content = await readFile(new URL('../' + path, import.meta.url), 'utf8');
      return '\n--- ' + path + ' ---\n' + content.slice(0, 26000);
    } catch (error) {
      return '\n--- ' + path + ' unavailable ---\n' + error.message;
    }
  }));
  return sections.join('');
}

async function ask(role, brief, repoBrief) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: 'Bearer ' + apiKey } : {}) },
    body: JSON.stringify({
      model,
      stream: false,
      max_tokens: 700,
      messages: [
        { role: 'system', content: 'You are the ' + role + ' on a small senior game team. Be decisive, concise, and implementation-aware. The lead engineer will integrate your recommendations; do not write a full patch.' },
        { role: 'user', content: brief + '\n\nHere is the current repository context:' + repoBrief },
      ],
    }),
  });
  const raw = await response.text();
  if (!response.ok) throw new Error(role + ': ' + response.status + ' ' + raw.slice(0, 500));
  const data = JSON.parse(raw);
  return { role, advice: data.choices?.[0]?.message?.content ?? raw };
}

const repoBrief = await loadRepoBrief();
const results = await Promise.allSettled(briefs.map(([role, brief]) => ask(role, brief, repoBrief)));
for (const result of results) {
  console.log(result.status === 'fulfilled' ? JSON.stringify(result.value, null, 2) : JSON.stringify({ status: 'rejected', error: result.reason?.message ?? String(result.reason) }, null, 2));
}
if (results.every((result) => result.status === 'rejected')) process.exitCode = 1;
