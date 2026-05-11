import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getWorldBySlug, WORLDS } from "@/lib/worlds";

const Explorer = dynamic(() => import("@/components/Explorer"), {
  ssr: false,
});

export function generateStaticParams() {
  return WORLDS.map((world) => ({ slug: world.slug }));
}

interface ExploreWorldPageProps {
  params: {
    slug: string;
  };
}

export default function ExploreWorldPage({ params }: ExploreWorldPageProps) {
  const world = getWorldBySlug(params.slug);

  if (!world) notFound();

  return <Explorer world={world} />;
}
