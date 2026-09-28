import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST() {
  await redis.del(
    "labs:distlock:lock",
    "labs:distlock:fence",
    "labs:distlock:committed-token",
    "labs:distlock:log"
  );
  return NextResponse.json({ reset: true });
}
