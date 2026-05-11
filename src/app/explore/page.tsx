/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { WORLDS } from "@/lib/worlds";

export default function ExplorePage() {
  return (
    <main className="min-h-screen overflow-y-auto bg-[#15111d] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/60 transition hover:text-white">
          ← Back home
        </Link>
        <header className="mt-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200/80">World Gallery</p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-6xl">Choose where to begin</h1>
          <p className="mt-5 text-lg leading-8 text-white/70">
            Start with open-access Rome, then preview the next reconstructed worlds planned for classroom explorations.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {WORLDS.map((world) => (
            <article
              key={world.slug}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-xl transition hover:-translate-y-1 hover:border-amber-200/35 hover:bg-white/[0.09]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={world.assets.thumbnail}
                  alt={`${world.displayName} preview`}
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {world.eraEmoji} {world.era}
                </div>
                {!world.free && (
                  <div className="absolute right-3 top-3 rounded-full bg-amber-300/90 px-3 py-1 text-xs font-semibold text-stone-950">
                    Preview
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-serif text-2xl text-white">{world.displayName}</h2>
                <p className="mt-3 min-h-[5rem] text-sm leading-6 text-white/65">{world.description}</p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-white/45">~10 min exploration</span>
                  <Link
                    href={`/explore/${world.slug}`}
                    className="rounded-full bg-amber-300 px-4 py-2 font-semibold text-stone-950 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
