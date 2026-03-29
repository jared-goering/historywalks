"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NarrationPanel from "./NarrationPanel";
import EraBar from "./EraBar";
import ControlsHelp from "./ControlsHelp";
import WebGLError from "./WebGLError";

const SPLAT_URL = "https://sparkjs.dev/assets/splats/butterfly.spz";
const FADE_TIMEOUT = 5000;

const NARRATION_TEXT =
  "You\u2019re standing at the entrance to the Forum. Ahead of you, the Temple of Saturn rises with its eight columns \u2014 one of the oldest and most sacred monuments in ancient Rome.";
const ERA_TEXT = "\uD83C\uDFDB\uFE0F Rome, ~100 AD \u00B7 The Forum Romanum";

export default function Explorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
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

      // Load splat
      const splatMesh = new SplatMesh({ url: SPLAT_URL });
      scene.add(splatMesh);

      // FPS controls
      const controls = new FirstPersonControls(camera, renderer.domElement);
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
      <EraBar era={ERA_TEXT} visible={overlayVisible} />
      <NarrationPanel text={NARRATION_TEXT} visible={overlayVisible} />
      <ControlsHelp />
    </>
  );
}
