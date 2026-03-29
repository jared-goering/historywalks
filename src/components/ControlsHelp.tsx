"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "historywalks-controls-dismissed";

export default function ControlsHelp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900/90 border border-white/10 rounded-2xl p-8 max-w-sm text-center space-y-6">
        <h2 className="text-white text-xl font-bold">How to Explore</h2>
        <div className="space-y-3 text-gray-300 text-sm">
          <div className="flex items-center justify-center gap-3">
            <kbd className="px-2 py-1 bg-white/10 rounded text-white font-mono text-xs">W</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded text-white font-mono text-xs">A</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded text-white font-mono text-xs">S</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded text-white font-mono text-xs">D</kbd>
            <span>or Arrow Keys to move</span>
          </div>
          <p>Click to enable mouse look</p>
          <p>
            Hold <kbd className="px-2 py-1 bg-white/10 rounded text-white font-mono text-xs">Shift</kbd>{" "}
            to move faster
          </p>
          <p className="text-gray-500 text-xs mt-2">Press Esc to release mouse</p>
        </div>
        <Button
          onClick={dismiss}
          className="w-full bg-white text-black hover:bg-gray-200"
        >
          Got it
        </Button>
      </div>
    </div>
  );
}
