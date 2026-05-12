export interface World {
  id: string;
  slug: string;
  displayName: string;
  era: string;
  eraEmoji: string;
  description: string;
  narration: string;
  assets: {
    spz100k: string;
    spz500k: string;
    spzFull: string;
    colliderMesh: string;
    thumbnail: string;
  };
  scale: {
    metricScaleFactor: number;
    groundPlaneOffset: number;
  };
  camera: {
    start: [number, number, number];
    lookAt: [number, number, number];
    fov: number;
  };
  pointsOfInterest: PointOfInterest[];
  free: boolean;
}

export interface PointOfInterest {
  id: string;
  title: string;
  shortLabel: string;
  narration: string;
  screenPosition: {
    left: number;
    top: number;
  };
}

export const WORLDS: World[] = [
  {
    id: "4b0e0e11-78d5-4259-882f-3dc904808ec9",
    slug: "rome",
    displayName: "The Roman Forum",
    era: "Rome, ~100 AD",
    eraEmoji: "🏛️",
    description:
      "Walk through the heart of ancient Rome at its peak. The Temple of Saturn, the Arch of Titus, and the Sacred Way — all as they appeared two millennia ago.",
    narration:
      "You're standing at the entrance to the Forum. Ahead of you, the Temple of Saturn rises with its eight columns — one of the oldest and most sacred monuments in ancient Rome.",
    assets: {
      spz100k:
        "https://cdn.marble.worldlabs.ai/4b0e0e11-78d5-4259-882f-3dc904808ec9/ad90f937-f277-490b-9bd2-f12cdeb730b5_dust_100k.spz",
      spz500k:
        "https://cdn.marble.worldlabs.ai/4b0e0e11-78d5-4259-882f-3dc904808ec9/56697cba-aa47-4bc1-b2a8-5644b6a15bd4_ceramic_500k.spz",
      spzFull:
        "https://cdn.marble.worldlabs.ai/4b0e0e11-78d5-4259-882f-3dc904808ec9/5ee3b68c-59d1-4b4e-a2fa-35f32e6d06ff_ceramic.spz",
      colliderMesh:
        "https://cdn.marble.worldlabs.ai/4b0e0e11-78d5-4259-882f-3dc904808ec9/a9fbe17d.glb",
      thumbnail:
        "https://cdn.marble.worldlabs.ai/4b0e0e11-78d5-4259-882f-3dc904808ec9/f0cc4651-d419-473d-a0d0-a8532d3aa63b_dust_mpi/thumbnail.webp",
    },
    scale: {
      metricScaleFactor: 1.6633737,
      groundPlaneOffset: 0.99795973,
    },
    camera: {
      // Back the visitor out from the center of the splat instead of starting
      // inside dense geometry, which made the first view feel muddy/blobby.
      start: [0, 0.99795973, 6.5],
      lookAt: [0, 1.15, 0],
      fov: 62,
    },
    pointsOfInterest: [
      {
        id: "temple-of-saturn",
        title: "Temple of Saturn",
        shortLabel: "Saturn",
        narration:
          "The Temple of Saturn was one of the Forum's oldest sacred buildings. Romans stored the state treasury here, which made the temple both a religious landmark and a symbol of public wealth.",
        screenPosition: { left: 48, top: 42 },
      },
      {
        id: "sacred-way",
        title: "The Sacred Way",
        shortLabel: "Sacred Way",
        narration:
          "The Sacred Way was the Forum's ceremonial spine. Triumphing generals, merchants, senators, and everyday Romans all moved through this route, turning the Forum into a theater of civic life.",
        screenPosition: { left: 58, top: 58 },
      },
      {
        id: "rostra",
        title: "The Rostra",
        shortLabel: "Rostra",
        narration:
          "The Rostra was Rome's speakers' platform. Public speeches, political arguments, and announcements happened here, so standing near it meant standing close to the sound of Roman power.",
        screenPosition: { left: 38, top: 54 },
      },
    ],
    free: true,
  },
  {
    id: "7c78b373-ee81-44b5-ad9c-f8ea06936eff",
    slug: "giza",
    displayName: "Great Pyramid of Giza",
    era: "Egypt, ~2560 BC",
    eraEmoji: "🏺",
    description:
      "Witness the Great Pyramid during its construction — white limestone casing gleaming in the Egyptian sun, workers on the ramps, the Nile floodplain stretching to the horizon.",
    narration:
      "Before you stands the greatest construction project the ancient world has ever seen. The Great Pyramid is nearly complete, its smooth white limestone casing dazzling in the Egyptian sun.",
    assets: {
      spz100k:
        "https://cdn.marble.worldlabs.ai/7c78b373-ee81-44b5-ad9c-f8ea06936eff/8175b4c6-4873-43a0-a028-343cb84e7062_dust_100k.spz",
      spz500k:
        "https://cdn.marble.worldlabs.ai/7c78b373-ee81-44b5-ad9c-f8ea06936eff/e5f8c731-eabe-4ede-b8e9-a85bfa5f0e50_ceramic_500k.spz",
      spzFull:
        "https://cdn.marble.worldlabs.ai/7c78b373-ee81-44b5-ad9c-f8ea06936eff/d7c3a352-985b-4e2a-8a80-ab5e50335157_ceramic.spz",
      colliderMesh:
        "https://cdn.marble.worldlabs.ai/7c78b373-ee81-44b5-ad9c-f8ea06936eff/16470d5d.glb",
      thumbnail:
        "https://cdn.marble.worldlabs.ai/7c78b373-ee81-44b5-ad9c-f8ea06936eff/62a571de-5be5-4a78-aa26-f93aa655e5d5_dust_mpi/thumbnail.webp",
    },
    scale: {
      metricScaleFactor: 2.2446795,
      groundPlaneOffset: 1.2364373,
    },
    camera: {
      start: [0, 1.2364373, 8],
      lookAt: [0, 1.5, 0],
      fov: 60,
    },
    pointsOfInterest: [
      {
        id: "limestone-casing",
        title: "White limestone casing",
        shortLabel: "Casing",
        narration:
          "The Great Pyramid originally gleamed with smooth white limestone casing stones. Those polished blocks reflected sunlight and made the monument visible from far across the Nile floodplain.",
        screenPosition: { left: 50, top: 38 },
      },
      {
        id: "construction-ramp",
        title: "Construction ramps",
        shortLabel: "Ramps",
        narration:
          "Workers likely used large ramp systems to move stone blocks upward as the pyramid rose. The exact ramp design is still debated, which makes this site a real archaeological puzzle.",
        screenPosition: { left: 62, top: 58 },
      },
      {
        id: "nile-plain",
        title: "Nile floodplain",
        shortLabel: "Nile",
        narration:
          "The Nile made pyramid building possible. Seasonal floods carried stone, food, and workers close to the plateau, connecting this monumental project to Egypt's agricultural calendar.",
        screenPosition: { left: 34, top: 62 },
      },
    ],
    free: false,
  },
  {
    id: "33034dda-3edb-4b4d-aa50-177126c1e733",
    slug: "athens",
    displayName: "The Parthenon",
    era: "Athens, ~432 BC",
    eraEmoji: "⚱️",
    description:
      "Stand before the freshly completed Parthenon, painted in vivid reds, blues, and golds. The golden statue of Athena gleams inside as citizens gather on the steps.",
    narration:
      "The Parthenon stands before you in its full glory — not the ruin you know, but a temple alive with color. Red, blue, and gold paint adorns every surface, as Phidias intended.",
    assets: {
      spz100k:
        "https://cdn.marble.worldlabs.ai/33034dda-3edb-4b4d-aa50-177126c1e733/bd52b4dd-5f8b-400e-bdad-68dc7123bd70_dust_100k.spz",
      spz500k:
        "https://cdn.marble.worldlabs.ai/33034dda-3edb-4b4d-aa50-177126c1e733/049de465-2e8e-47aa-8833-2cf912feb02e_ceramic_500k.spz",
      spzFull:
        "https://cdn.marble.worldlabs.ai/33034dda-3edb-4b4d-aa50-177126c1e733/49be404f-4494-4823-8356-01719d228106_ceramic.spz",
      colliderMesh:
        "https://cdn.marble.worldlabs.ai/33034dda-3edb-4b4d-aa50-177126c1e733/d9f1e639.glb",
      thumbnail:
        "https://cdn.marble.worldlabs.ai/33034dda-3edb-4b4d-aa50-177126c1e733/254e49ba-a0ed-408c-a9b3-8a3bed8c2f52_dust_mpi/thumbnail.webp",
    },
    scale: {
      metricScaleFactor: 2.3562398,
      groundPlaneOffset: 3.1217036,
    },
    camera: {
      start: [0, 3.1217036, 8],
      lookAt: [0, 3.35, 0],
      fov: 60,
    },
    pointsOfInterest: [
      {
        id: "painted-marble",
        title: "Painted marble",
        shortLabel: "Color",
        narration:
          "The Parthenon was not plain white marble in antiquity. Bright red, blue, and gold paint highlighted sculpture and architecture, making the temple far more vivid than modern ruins suggest.",
        screenPosition: { left: 48, top: 40 },
      },
      {
        id: "athena-statue",
        title: "Athena's statue",
        shortLabel: "Athena",
        narration:
          "Inside stood a monumental statue of Athena, covered with gold and ivory. It declared both religious devotion and Athens' political confidence at the height of its power.",
        screenPosition: { left: 55, top: 52 },
      },
      {
        id: "acropolis-steps",
        title: "Acropolis gathering place",
        shortLabel: "Acropolis",
        narration:
          "The Acropolis was a sacred high place and civic symbol. Athenians climbed here for festivals, processions, and rituals that connected the city to its patron goddess.",
        screenPosition: { left: 36, top: 60 },
      },
    ],
    free: false,
  },
];

export function getWorldBySlug(slug: string): World | undefined {
  return WORLDS.find((w) => w.slug === slug);
}
