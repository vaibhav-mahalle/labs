export type Concept = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "planned";
};

export const concepts: Concept[] = [
  {
    slug: "distributed-lock",
    title: "Distributed Lock with Fencing Tokens",
    description:
      "Two workers race for the same lock. Watch a plain TTL lock go unsafe under a slow worker — and a fencing token catch the stale write.",
    tags: ["Redis", "Distributed Systems", "Concurrency"],
    status: "live",
  },
  {
    slug: "rate-limiter",
    title: "Rate Limiter (Token Bucket)",
    description:
      "Hammer a fake endpoint and watch requests get allowed or throttled in real time.",
    tags: ["Distributed Systems", "API Design"],
    status: "planned",
  },
  {
    slug: "hashmap",
    title: "HashMap From Scratch",
    description:
      "Insert keys and watch bucket assignment, collisions, and resizing happen live.",
    tags: ["Data Structures", "Java"],
    status: "planned",
  },
];
