"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NarrationPanel from "./NarrationPanel";
import EraBar from "./EraBar";
import ControlsHelp from "./ControlsHelp";
import WebGLError from "./WebGLError";

import { WORLDS, type World } from "@/lib/worlds";

const FADE_TIMEOUT = 5000;
const FULL_RES_SWAP_DELAY = 3500;
const INITIAL_LOADING_TIMEOUT = 2200;

// Default to Rome (free world)
const DEFAULT_WORLD = WORLDS[0];

interface ExplorerProps {
  world?: World;
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
    (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
}

function shouldAttemptFullResolution(): boolean {
  if (typeof window === "undefined") return false;

  const searchParams = new URLSearchParams(window.location.search);
  const requestedQuality = searchParams.get("quality");
  if (requestedQuality === "full") return true;
  if (requestedQuality === "fast" || requestedQuality === "500k") return false;

  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  if (connection?.saveData) return false;
  if (connection?.effectiveType && ["slow-2g", "2g", "3g"].includes(connection.effectiveType)) {
    return false;
  }

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return !deviceMemory || deviceMemory >= 8;
}

function createSkyTexture(THREE: typeof import("three")) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) return new THREE.Color(0x182033);

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#7387a6");
  gradient.addColorStop(0.45, "#c9b28a");
  gradient.addColorStop(0.72, "#6f5f50");
  gradient.addColorStop(1, "#16131d");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function Explorer({ world = DEFAULT_WORLD }: ExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPoi = world.pointsOfInterest.find((poi) => poi.id === selectedPoiId);
  const narrationText = selectedPoi?.narration ?? world.narration;

  const resetFadeTimer = useCallback(() => {
    setOverlayVisible(true);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setOverlayVisible(false);
    }, FADE_TIMEOUT);
  }, []);

  const showPointOfInterest = useCallback((poiId: string) => {
    setSelectedPoiId(poiId);
    setOverlayVisible(true);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect mobile — Gaussian Splatting doesn't work reliably on mobile GPUs
    if (isMobileDevice()) {
      setIsMobile(true);
      setLoading(false);
      return;
    }

    // Check WebGL2 support
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl2");
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    let disposed = false;

    async function init() {
      const THREE = await import("three");
      const { SplatMesh, SparkRenderer } = await import("@sparkjsdev/spark");
      const { FirstPersonControls } = await import(
        "@/lib/first-person-controls"
      );

      if (disposed || !container) return;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = createSkyTexture(THREE);
      scene.fog = new THREE.FogExp2(0x2b2430, 0.024);

      const camera = new THREE.PerspectiveCamera(
        world.camera.fov,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x1a1a2e, 1);
      container.appendChild(renderer.domElement);

      // SparkJS renderer
      const spark = new SparkRenderer({ renderer });
      scene.add(spark);

      // Load the 500k splat first so the scene appears quickly, then upgrade
      // capable desktop devices to the full-res Marble export. The URL query
      // param `?quality=fast` disables the upgrade for Chromebook testing;
      // `?quality=full` forces it for visual QA.
      const previewSplat = new SplatMesh({ url: world.assets.spz500k });
      scene.add(previewSplat);

      let fullResSplat: InstanceType<typeof SplatMesh> | undefined;
      const fullResTimeout = shouldAttemptFullResolution()
        ? setTimeout(() => {
            if (disposed) return;
            fullResSplat = new SplatMesh({ url: world.assets.spzFull });
            scene.add(fullResSplat);

            window.setTimeout(() => {
              if (disposed) return;
              scene.remove(previewSplat);
              previewSplat.dispose();
            }, 1800);
          }, FULL_RES_SWAP_DELAY)
        : undefined;

      // Hide loading screen after a brief delay to let the SPZ start rendering
      // SplatMesh streams data progressively, so content appears within seconds
      const loadTimeout = setTimeout(() => setLoading(false), INITIAL_LOADING_TIMEOUT);

      // Position camera at ground level — World Labs SPZ uses Y-up, scene centered at origin
      // groundPlaneOffset is the Y coordinate of the ground plane
      // metricScaleFactor converts real meters to scene units
      const eyeY = world.scale.groundPlaneOffset;
      camera.position.set(...world.camera.start);
      camera.rotation.order = "YXZ";
      camera.lookAt(...world.camera.lookAt);

      // FPS controls
      const controls = new FirstPersonControls(camera, renderer.domElement, {
        eyeHeight: eyeY,
        moveSpeed: 3 * world.scale.metricScaleFactor,
      });
      controls.onMovement(() => resetFadeTimer());

      // Start fade timer
      resetFadeTimer();

      // Clock for delta time
      const clock = new THREE.Clock();

      // Handle resize
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      // Animation loop
      renderer.setAnimationLoop(() => {
        if (disposed) return;
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render(scene, camera);
      });

      // Cleanup function stored for disposal
      return () => {
        disposed = true;
        clearTimeout(loadTimeout);
        if (fullResTimeout) clearTimeout(fullResTimeout);
        renderer.setAnimationLoop(null);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        previewSplat.dispose();
        fullResSplat?.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    let cleanup: (() => void) | undefined;
    init().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      disposed = true;
      cleanup?.();
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [resetFadeTimer, world]);

  if (!webglSupported) {
    return <WebGLError />;
  }

  // Mobile fallback: show thumbnail with panoramic Ken Burns effect
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 overflow-hidden bg-[#1a1a2e]">
          {/* Thumbnail background with slow zoom */}
          <div
            className="absolute inset-0 animate-slow-zoom"
            style={{
              backgroundImage: `url(${world.assets.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        </div>

        {/* Mobile notice */}
        <div className="fixed left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 text-center px-6">
          <p className="text-white/80 text-sm mb-2">
            🖥️ For the full 3D walkthrough, visit on desktop
          </p>
          <p className="text-white/40 text-xs">
            Gaussian Splatting requires desktop GPU
          </p>
        </div>

        <EraBar era={`${world.eraEmoji} ${world.era} · ${world.displayName}`} visible={true} />
        <NarrationPanel text={narrationText} visible={true} />
      </>
    );
  }

  return (
    <>
      <div ref={containerRef} className="fixed inset-0" />
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a2e]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="mt-4 text-sm text-white/60">Loading {world.displayName}…</p>
        </div>
      )}
      <EraBar era={`${world.eraEmoji} ${world.era} · ${world.displayName}`} visible={overlayVisible} />
      {!loading && (
        <div className="fixed inset-0 z-20 pointer-events-none" aria-label="Points of interest">
          {world.pointsOfInterest.map((poi) => {
            const isSelected = poi.id === selectedPoiId;

            return (
              <button
                key={poi.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`Learn about ${poi.title}`}
                onClick={() => showPointOfInterest(poi.id)}
                className={`group absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 rounded-full border text-left shadow-[0_0_30px_rgba(251,191,36,0.28)] backdrop-blur transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                  isSelected
                    ? "border-amber-200 bg-amber-300 text-stone-950"
                    : "border-amber-200/50 bg-black/55 text-white hover:bg-black/70"
                }`}
                style={{ left: `${poi.screenPosition.left}%`, top: `${poi.screenPosition.top}%` }}
              >
                <span className="relative flex items-center gap-2 px-3 py-2 text-xs font-semibold sm:text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${isSelected ? "bg-stone-950" : "bg-amber-300"}`} />
                  <span className="hidden sm:inline">{poi.shortLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      <NarrationPanel title={selectedPoi?.title} text={narrationText} visible={overlayVisible} />
      <ControlsHelp />
    </>
  );
}
