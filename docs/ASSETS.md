# Asset direction and provenance

The visual target is a cohesive authored city, not a collection of unrelated marketplace packs. The current procedural geometry is a temporary fallback so gameplay can run before the licensed art pass lands.

## Selected foundation library

| Role | Pack | Why it fits | License | Runtime target |
| --- | --- | --- | --- | --- |
| City / storefronts / street pieces | Quaternius Downtown City MegaKit (May 2026) | 300+ modular Boston/NYC-style pieces, prebuilt buildings, shared texture sets, glTF available | CC0 | Curate only the strongest modules; convert to GLB, merge static batches by block, preserve collider proxies |
| Hero + civilian bases | Quaternius Universal Base Characters (Aug 2025) | humanoid rig, 6 body bases, 20 hairstyles, ~13k triangles, glTF | CC0 | Build one proprietary hero treatment plus civilian variants; keep a common humanoid skeleton |
| Locomotion / reactions | Quaternius Universal Animation Library (Mar 2025) | 120+ humanoid animations, GLB, compatible with the base characters | CC0 | Retarget to the shared skeleton; trim clips and load action groups on demand |
| Traffic / first drivable cars | Quaternius Cars Pack (Nov 2018) | 8 coherent car silhouettes with commercial-safe license | CC0 | Convert selected FBX to GLB; separate wheels; add low-cost collision hulls; author LOD1/LOD2 |
| Trees / planting | Quaternius Stylized Nature MegaKit (Jul 2024) | 110+ vegetation assets and interchangeable foliage | CC0 | Keep silhouettes but re-grade materials to the city palette; aggressive distance LOD / instancing |

Official source pages are the provenance authority. Never rely on a mirror's license text when the original creator's page is available.

## Art-direction rules

1. **One material language.** Re-grade imported assets into the same asphalt, concrete, painted metal, glass, vegetation, skin and cloth response rather than preserving each pack's defaults.
2. **Hero assets get bespoke work.** The player and first drivable vehicle should not read as stock Quaternius assets: custom silhouette details, materials, decals, accessories and authored animation polish are required.
3. **Web budgets are explicit.** Mobile first-load should not include the whole library. The starter district gets a curated subset, with additional districts and animation banks loaded on demand.
4. **Collision is authored separately.** Render meshes never become automatic trimesh colliders for dynamic gameplay objects. Use simple hulls/boxes/capsules and block-level fixed colliders.
5. **Every import is traceable.** Record original pack/version, file name, license, conversion command/settings and final GLB path in this file when assets are actually added.

## Initial quality budget

- Hero character visible geometry: ~60k triangles maximum before accessories; LODs required.
- Civilian near LOD: ~20k triangles maximum; far pedestrians should be dramatically cheaper.
- Hero vehicle near LOD: ~120k triangles maximum; traffic LOD substantially lower.
- Environment: prioritize batching/instancing and texture reuse over individual mesh triangle counting.
- Textures: KTX2/Basis for production; avoid uncompressed 4K textures on the mobile critical path.

These are starting budgets, not permanent caps. Frame time and memory measurements decide exceptions.
