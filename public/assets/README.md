# Runtime assets

Do not drop arbitrary models into this folder.

Each production asset family gets its own directory:

- `characters/hero/`
- `characters/civilians/`
- `vehicles/traffic/`
- `vehicles/hero/`
- `city/buildings/`
- `city/props/`
- `nature/`

Ship web-ready `.glb` plus compressed textures, LODs where useful, and lightweight collider proxies. Record the source, license, original file, conversion settings, scale, forward axis, and compression pass in `docs/ASSETS.md` before the asset is used by gameplay code.
