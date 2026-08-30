import process from 'node:process';

const endpoint = 'https://api.inferway.ai/v1/chat/completions';
const model = 'inferway/qwen3.8-27b';
const apiKey = process.env.INFERWAY_API_KEY;

const briefs = [
  ['creative-director', 'You are the creative director. Audit the current concept for City After Dark, an original mobile-first urban action game. Return five high-impact visual or gameplay improvements, concise and practical. Avoid copyrighted GTA assets.'],
  ['mobile-engineer', 'You are a senior mobile web game engineer. Review this vertical-slice brief: React Three Fiber, touch joystick, third-person movement, procedural city, small delivery mission. Return five performance or input improvements that matter on iPhone Safari.'],
  ['world-designer', 'You are a game-world designer. Propose three tiny environmental storytelling details for a neon dusk district that can be implemented with simple Three.js primitives and lights. Keep the scope small but the result premium.'],
];

async function ask(role, system) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}) },
    body: JSON.stringify({ model, stream: false, max_tokens: 500, messages: [{ role: 'system', content: system }, { role: 'user', content: 'Use the repo brief above. Be decisive; do not write code.' }] }),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${role}: ${response.status} ${text}`);
  const data = JSON.parse(text);
  return { role, advice: data.choices?.[0]?.message?.content ?? text };
}

const results = await Promise.allSettled(briefs.map(([role, system]) => ask(role, system)));
for (const result of results) console.log(result.status === 'fulfilled' ? JSON.stringify(result.value, null, 2) : result.reason.message);
