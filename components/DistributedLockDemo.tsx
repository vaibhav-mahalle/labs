"use client";

import { useEffect, useRef, useState } from "react";

type StateResponse = {
  holder: string | null;
  fence: number;
  committedToken: number | null;
  log: { ts: number; message: string }[];
};

const LOCK_TTL_MS = 4000;
const WORKER_A_PAUSE_MS = 6000;
const WORKER_B_START_DELAY_MS = 4500;
const WORKER_B_WORK_MS = 800;

async function post(path: string, body?: object) {
  const res = await fetch(`/api/distributed-lock/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export default function DistributedLockDemo() {
  const [state, setState] = useState<StateResponse | null>(null);
  const [running, setRunning] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = async () => {
    const res = await fetch("/api/distributed-lock/state");
    const data = await res.json();
    setState(data);
  };

  useEffect(() => {
    refresh();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(refresh, 400);
  };

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const runRace = async () => {
    setRunning(true);
    await post("reset");
    await refresh();
    startPolling();

    // Worker A acquires the lock, then simulates a long pause (GC/network delay)
    // that outlives the lock's TTL.
    const a = await post("acquire", { workerId: "Worker A" });

    // While A is "paused," Worker B waits until A's TTL has already expired,
    // then acquires the now-free lock.
    setTimeout(async () => {
      const b = await post("acquire", { workerId: "Worker B" });
      if (b.acquired) {
        setTimeout(async () => {
          await post("commit", { workerId: "Worker B", token: b.token });
          await refresh();
        }, WORKER_B_WORK_MS);
      }
    }, WORKER_B_START_DELAY_MS);

    // Worker A wakes up from its pause and tries to commit with its now-stale token.
    setTimeout(async () => {
      if (a.acquired) {
        await post("commit", { workerId: "Worker A", token: a.token });
        await refresh();
      }
      setTimeout(() => {
        stopPolling();
        setRunning(false);
      }, 600);
    }, WORKER_A_PAUSE_MS + 200);
  };

  const reset = async () => {
    stopPolling();
    setRunning(false);
    await post("reset");
    await refresh();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={runRace}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-md bg-white text-black px-6 py-3 text-sm font-medium hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {running ? "Race running…" : "Run the race"}
        </button>
        <button
          onClick={reset}
          disabled={running}
          className="font-mono text-sm rounded-md border border-white/15 px-6 py-3 hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          reset
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="font-mono text-xs text-muted uppercase mb-1">
            lock holder
          </p>
          <p className="text-lg font-medium">{state?.holder ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="font-mono text-xs text-muted uppercase mb-1">
            current fencing token
          </p>
          <p className="font-mono text-lg font-medium text-accent">
            {state?.fence ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <p className="font-mono text-xs text-muted uppercase mb-1">
            last committed token
          </p>
          <p className="font-mono text-lg font-medium">
            {state?.committedToken ?? "—"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono text-xs text-muted uppercase mb-3">
          event timeline
        </p>
        {(!state || state.log.length === 0) && (
          <p className="text-sm text-muted">
            No events yet &mdash; click &quot;Run the race&quot; to start.
          </p>
        )}
        <ul className="space-y-2 font-mono text-xs">
          {state?.log.map((entry, i) => (
            <li
              key={entry.ts + i}
              className={
                entry.message.includes("REJECTED")
                  ? "text-red-400"
                  : entry.message.includes("committed successfully")
                  ? "text-accent"
                  : "text-muted"
              }
            >
              {entry.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
