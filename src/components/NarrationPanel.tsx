"use client";

interface NarrationPanelProps {
  title?: string;
  text: string;
  visible: boolean;
}

export default function NarrationPanel({ title, text, visible }: NarrationPanelProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-4 mb-4 p-6 bg-black/60 backdrop-blur-sm rounded-xl max-h-[20vh] overflow-y-auto">
        {title && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/90">
            {title}
          </p>
        )}
        <p className="text-white/90 text-base leading-relaxed font-serif">
          {text}
        </p>
      </div>
    </div>
  );
}
