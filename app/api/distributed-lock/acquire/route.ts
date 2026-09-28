import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const LOCK_KEY = "labs:distlock:lock";
const FENCE_KEY = "labs:distlock:fence";
const LOG_KEY = "labs:distlock:log";
const LOCK_TTL_MS = 4000;

async function pushLog(entry: string) {
  await redis.lpush(LOG_KEY, `${Date.now()}::${entry}`);
  await redis.ltrim(LOG_KEY, 0, 49);
}

export async function POST(req: NextRequest) {
  const { workerId } = await req.json();
  if (!workerId) {
    return NextResponse.json({ error: "workerId required" }, { status: 400 });
  }

  const acquired = await redis.set(LOCK_KEY, workerId, {
    nx: true,
    px: LOCK_TTL_MS,
  });

  if (!acquired) {
    const holder = await redis.get<string>(LOCK_KEY);
    await pushLog(`${workerId} tried to acquire — lock held by ${holder ?? "unknown"}`);
    return NextResponse.json({ acquired: false, holder });
  }

  const token = await redis.incr(FENCE_KEY);
  await pushLog(`${workerId} acquired lock (fencing token=${token})`);

  return NextResponse.json({ acquired: true, token, ttlMs: LOCK_TTL_MS });
}
