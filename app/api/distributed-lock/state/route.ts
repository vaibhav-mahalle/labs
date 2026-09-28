import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const LOCK_KEY = "labs:distlock:lock";
const FENCE_KEY = "labs:distlock:fence";
const COMMITTED_TOKEN_KEY = "labs:distlock:committed-token";
const LOG_KEY = "labs:distlock:log";

export async function GET() {
  const [holder, fence, committedToken, rawLog] = await Promise.all([
    redis.get<string>(LOCK_KEY),
    redis.get<number>(FENCE_KEY),
    redis.get<number>(COMMITTED_TOKEN_KEY),
    redis.lrange<string>(LOG_KEY, 0, 19),
  ]);

  const log = rawLog.map((entry) => {
    const [ts, ...rest] = entry.split("::");
    return { ts: Number(ts), message: rest.join("::") };
  });

  return NextResponse.json({
    holder: holder ?? null,
    fence: fence ?? 0,
    committedToken: committedToken ?? null,
    log,
  });
}
