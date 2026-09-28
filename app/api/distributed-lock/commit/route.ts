import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const FENCE_KEY = "labs:distlock:fence";
const COMMITTED_TOKEN_KEY = "labs:distlock:committed-token";
const LOG_KEY = "labs:distlock:log";

async function pushLog(entry: string) {
  await redis.lpush(LOG_KEY, `${Date.now()}::${entry}`);
  await redis.ltrim(LOG_KEY, 0, 49);
}

export async function POST(req: NextRequest) {
  const { workerId, token } = await req.json();
  if (!workerId || typeof token !== "number") {
    return NextResponse.json(
      { error: "workerId and numeric token required" },
      { status: 400 }
    );
  }

  const currentFence = (await redis.get<number>(FENCE_KEY)) ?? 0;

  if (token < currentFence) {
    await pushLog(
      `${workerId} REJECTED commit (its token=${token} < current token=${currentFence}) — stale lock holder caught by fencing`
    );
    return NextResponse.json({
      committed: false,
      reason: "stale-token",
      yourToken: token,
      currentToken: currentFence,
    });
  }

  await redis.set(COMMITTED_TOKEN_KEY, token);
  await pushLog(`${workerId} committed successfully (token=${token})`);

  return NextResponse.json({ committed: true, token });
}
