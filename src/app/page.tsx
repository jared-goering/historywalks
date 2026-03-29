import dynamic from "next/dynamic";

const Explorer = dynamic(() => import("@/components/Explorer"), {
  ssr: false,
});

export default function Home() {
  return <Explorer />;
}
