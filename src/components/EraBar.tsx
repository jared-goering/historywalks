"use client";

interface EraBarProps {
  era: string;
  visible: boolean;
}

export default function EraBar({ era, visible }: EraBarProps) {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 flex justify-center pointer-events-none transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mt-4 px-6 py-2 bg-black/60 backdrop-blur-sm rounded-full">
        <p className="text-white text-sm font-sans tracking-wide">{era}</p>
      </div>
    </div>
  );
}
