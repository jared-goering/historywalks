"use client";

interface NarrationPanelProps {
  text: string;
  visible: boolean;
}

export default function NarrationPanel({ text, visible }: NarrationPanelProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-4 mb-4 p-6 bg-black/60 backdrop-blur-sm rounded-xl max-h-[20vh] overflow-y-auto">
        <p className="text-white/90 text-base leading-relaxed font-serif">
          {text}
        </p>
      </div>
    </div>
  );
}
