/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { WORLDS } from "@/lib/worlds";

const featuredWorld = WORLDS[0];

export default function Home() {
  return (
    <main className="min-h-screen overflow-y-auto bg-[#15111d] text-white">
      <section className="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
        <div
          className="absolute inset-0 -z-20 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${featuredWorld.assets.thumbnail})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-[#15111d]/70 to-[#15111d]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(245,181,88,0.22),transparent_35%)]" />

        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-amber-200/20 bg-black/35 px-4 py-2 text-sm font-medium text-amber-100 backdrop-blur">
              Browser-first historical worlds for classrooms
            </p>
            <h1 className="font-serif text-5xl leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Walk Through History
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
              Explore AI-generated 3D reconstructions of ancient civilizations with an AI guide that explains what you see along the way.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/explore/rome"
                className="rounded-full bg-amber-300 px-7 py-3 text-center text-base font-semibold text-stone-950 shadow-[0_0_32px_rgba(252,211,77,0.35)] transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
              >
                Explore Ancient Rome — Free
              </Link>
              <Link
                href="/explore"
                className="rounded-full border border-white/25 bg-white/10 px-7 py-3 text-center text-base font-semibold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
              >
                See all worlds →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/65">
              <span className="rounded-full bg-white/10 px-3 py-1">No install</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Chromebook-minded</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Rome is open access</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-black/35 p-4 shadow-2xl backdrop-blur-md">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src={featuredWorld.assets.thumbnail}
                alt={`${featuredWorld.displayName} preview`}
                className="aspect-video w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-amber-100">{featuredWorld.eraEmoji} {featuredWorld.era}</p>
              <h2 className="mt-2 font-serif text-2xl text-white">{featuredWorld.displayName}</h2>
              <p className="mt-2 text-sm leading-6 text-white/68">{featuredWorld.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 sm:grid-cols-3 sm:px-10 lg:px-16">
        {[
          ["🏛️", "Pick an era", "Choose from reconstructed ancient places."],
          ["🚶", "Walk through it", "Explore a browser-based 3D world."],
          ["🎓", "Learn as you go", "Narration gives context immediately."],
        ].map(([icon, title, copy]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <div className="text-3xl">{icon}</div>
            <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/65">{copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
