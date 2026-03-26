

## Refactor SplashCluster: Unified Text Core + Particle Shell

### What changes

Replace the current `SplashCluster` component with a refactored version. No other files change.

### Current problem

The canvas-based particles and the HTML text overlay are in separate coordinate systems. The canvas draws particles using its own pixel space while text is positioned via CSS flex — they don't feel like one object.

### New approach: DOM-based particles in a shared container

**Replace the canvas with DOM-based particles** (small `div` elements positioned via `transform`). This puts text and particles in the exact same coordinate system.

**Container**: A single `relative` div (280x280px) with the cluster's absolute position. Everything lives inside it.

**Particles** (~90 dots): Each is an `absolute` div positioned from the center using `left: 50%; top: 50%; transform: translate(x, y)`. Animated via `requestAnimationFrame` updating inline transforms.

**Text core**: An `absolute inset-0 flex items-center justify-center` div layered on top (z-10). Contains:
- **Default**: Label text (uppercase, `opacity: 0.5`)
- **Hover**: Content lines with staggered blur-to-sharp reveal

**Particle physics** (same logic, just applied to DOM transforms):
- Generate particles with polar coordinates (angle + radius)
- `INNER_RADIUS: 40px` — particles never enter the text zone
- `ORBIT_RADIUS: 80px` — default ring
- `SPLASH_RADIUS: 120px` — hover expansion
- Slow orbit rotation + breathing drift
- Smooth lerp between states (`splashRef += (target - current) * 0.06`)

### Technical details

**File**: `src/components/AboutOverlay.tsx` — replace `SplashCluster` component only

**Particle rendering**: Use a single `useRef` array of particle data. On each `rAF` tick, compute positions and batch-update via a parent ref's children styles (or use a single state update with `useRef` + `forceUpdate` pattern to avoid React reconciliation overhead). Each particle is a `<div>` with `position: absolute; left: 50%; top: 50%; width/height: 2px; borderRadius: 50%; background: rgba(225,222,215,alpha)` and `transform: translate(xpx, ypx)`.

**Container size**: 280px square (larger than current 220px to accommodate the bigger radii).

**Text transitions**: Keep existing framer-motion `animate` props for blur/opacity/scale on label and content lines. The text div gets `pointer-events-none` so hover detection stays on the outer container.

**What stays the same**: `SPLASH_CLUSTERS` data, cluster positions, `AboutOverlay` structure, identity core, all other overlay elements.

