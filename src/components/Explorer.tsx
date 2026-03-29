"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NarrationPanel from "./NarrationPanel";
import EraBar from "./EraBar";
import ControlsHelp from "./ControlsHelp";
import WebGLError from "./WebGLError";

import { WORLDS, type World } from "@/lib/worlds";

const FADE_TIMEOUT = 5000;

// Default to Rome (free world)
const DEFAULT_WORLD = WORLDS[0];

interface ExplorerProps {
  world?: World;
}

export default function Explorer({ world = DEFAULT_WORLD }: ExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetFadeTimer = useCallback(() => {
    setOverlayVisible(true);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setOverlayVisible(false);
    }, FADE_TIMEOUT);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      scene.background = new THREE.Color(0x1a1a2e);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // SparkJS renderer
      const spark = new SparkRenderer({ renderer });
      scene.add(spark);

      // Load splat — use 500k for balance of quality and performance
      const splatMesh = new SplatMesh({ url: world.assets.spz500k });
      splatMesh.addEventListener("load", () => {
        setLoading(false);
      });
      // Fallback: hide loading after 15s even if load event doesn't fire
      const loadTimeout = setTimeout(() => setLoading(false), 15000);
      scene.add(splatMesh);

      // Position camera at ground level — World Labs SPZ uses Y-up, scene centered at origin
      // groundPlaneOffset is the Y coordinate of the ground plane
      // metricScaleFactor converts real meters to scene units
      const eyeY = world.scale.groundPlaneOffset;
      camera.position.set(0, eyeY, 0);
      // Look forward (level horizon)
      camera.rotation.order = "YXZ";
      camera.rotation.x = 0;

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
        renderer.setAnimationLoop(null);
        window.removeEventListener("resize", onResize);
        controls.dispose();
        splatMesh.dispose();
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
  }, [resetFadeTimer]);

  if (!webglSupported) {
    return <WebGLError />;
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
      <NarrationPanel text={world.narration} visible={overlayVisible} />
      <ControlsHelp />
    </>
  );
}
