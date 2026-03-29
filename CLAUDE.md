# History Walks — Phase 0 Spike

## What This Is
A Next.js 14 app that loads a Gaussian splat (SPZ format) via SparkJS with first-person WASD controls and a narration text overlay. This is a spike to validate that the concept works on low-end hardware (Chromebooks).

## Tech Stack
- **Next.js 14** (App Router) with TypeScript
- **Three.js** + **@sparkjsdev/spark** for Gaussian splat rendering
- **Tailwind CSS** for overlay styling
- **shadcn/ui** for any UI components needed

## What to Build

### 1. Project Scaffold
- `npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint` (or equivalent)
- Install: `@sparkjsdev/spark`, `three`, `@types/three`
- Set up shadcn/ui

### 2. Main Page (`/`)
A full-viewport 3D Gaussian splat viewer with:

#### SparkJS Integration
- Load a demo SPZ file. Use this public butterfly demo: `https://sparkjs.dev/assets/splats/butterfly.spz` as a placeholder until we get Marble-generated worlds.
- Use `SplatMesh` from `@sparkjsdev/spark` with `{ url: "..." }`
- Three.js scene with WebGL2 renderer
- Full viewport canvas (no scroll, body margin 0)

#### First-Person Camera Controls
- WASD keys for movement (forward/back/strafe left/right)
- Arrow keys as alternative
- Mouse look (pointer lock on canvas click)
- Shift to move faster
- Smooth movement with delta time
- Camera at eye height (~1.7m equivalent in scene units)
- Implement from scratch using Three.js (no OrbitControls — we need FPS-style)

#### Narration Overlay
- Translucent dark panel at the bottom of the screen (full width, ~20% viewport height max)
- Shows hardcoded narration text: "You're standing at the entrance to the Forum. Ahead of you, the Temple of Saturn rises with its eight columns — one of the oldest and most sacred monuments in ancient Rome."
- Era context bar at top: "🏛️ Rome, ~100 AD · The Forum Romanum"
- Both panels auto-fade after 5s of inactivity, reappear on movement
- Typography: system serif for narration, system sans-serif for era bar

#### Controls Help
- On first load, show a translucent overlay explaining WASD + mouse controls
- "Got it" button dismisses it
- Store dismissal in localStorage so it doesn't show again

### 3. Performance Considerations
- WebGL2 required — show a friendly error if not supported
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` to cap pixel ratio
- Handle window resize
- Use `requestAnimationFrame` loop via Three.js `setAnimationLoop`

### 4. File Structure
```
src/
  app/
    layout.tsx
    page.tsx              # Main page, renders the Explorer
    globals.css           # Tailwind imports
  components/
    Explorer.tsx          # Main 3D viewer component (client component)
    NarrationPanel.tsx    # Bottom narration overlay
    EraBar.tsx            # Top era context bar
    ControlsHelp.tsx      # First-time controls overlay
    WebGLError.tsx        # Fallback for no WebGL2
  lib/
    first-person-controls.ts  # Custom FPS camera controls
  types/
    index.ts              # Shared types
```

### 5. Important Notes
- The Explorer component MUST be a client component (`'use client'`)
- SparkJS uses WebGL2 — dynamic import it to avoid SSR issues
- Three.js renderer should be created in a useEffect, mounted to a ref div
- Clean up Three.js resources on unmount (dispose renderer, etc.)
- For the spike, the butterfly splat is fine — it proves SparkJS loads and renders SPZ files

## Success Criteria
- Page loads and renders a Gaussian splat in <5 seconds on broadband
- WASD + mouse controls work smoothly
- Narration overlay displays correctly over the 3D scene
- Works in Chrome, Edge, Safari
- No console errors
- Responsive (works on different viewport sizes)
