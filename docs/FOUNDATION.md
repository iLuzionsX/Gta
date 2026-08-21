# Project 56 foundation

This repository starts as a focused open-world vertical slice, not a fake city-scale prototype.

## Non-negotiables

- React owns application/UI composition; Three.js is rendered through React Three Fiber.
- Physics and gameplay state live outside presentation components so vehicles, NPCs, missions, and streamed districts can grow independently.
- Desktop and touch share one normalized input store. New input devices map into that store rather than branching gameplay logic.
- The starter district is deliberately cheap to render: simple geometry, short draw distance, restrained shadow budget, adaptive DPR, and low NPC/traffic counts.
- Art can be replaced without rewriting gameplay. Current procedural meshes are legal-safe stand-ins while the final licensed asset library is curated.

## Next asset pass

Replace stand-ins in this order: hero + locomotion set, one hero vehicle with interior, civilian archetype library, modular storefront/building kit, road prop kit, vegetation, then traffic variants. Every imported model should ship as glTF/GLB with KTX2 textures, meshopt/Draco compression where it wins, LODs, explicit collider proxies, and a provenance/license record.
