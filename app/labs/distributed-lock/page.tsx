import Link from "next/link";
import DistributedLockDemo from "@/components/DistributedLockDemo";

export const metadata = {
  title: "Distributed Lock with Fencing Tokens — Vaibhav's Labs",
};

export default function DistributedLockPage() {
  return (
    <main className="max-w-content mx-auto px-6 py-16">
      <Link
        href="/"
        className="font-mono text-xs text-muted hover:text-accent transition-colors"
      >
        &larr; all labs
      </Link>

      <h1 className="mt-6 text-3xl md:text-4xl font-semibold">
        Distributed Lock with Fencing Tokens
      </h1>

      <div className="mt-6 space-y-4 max-w-2xl text-muted text-sm leading-relaxed">
        <p>
          A distributed lock lets only one worker process a shared resource
          at a time. The usual implementation: <code>SET key value NX PX
          ttl</code> in Redis &mdash; whoever sets the key first holds the
          lock until the TTL expires.
        </p>
        <p>
          <span className="text-body font-medium">
            The problem: a plain TTL lock isn&apos;t actually safe.
          </span>{" "}
          If a worker pauses for longer than the TTL &mdash; a GC pause, a
          slow network call, a scheduler delay &mdash; its lock silently
          expires while it&apos;s still &quot;holding&quot; it in its own
          mind. Another worker acquires the lock and starts working. When
          the first worker wakes up, it has no idea its lock is gone, and
          may still write to the resource &mdash; corrupting it.
        </p>
        <p>
          <span className="text-body font-medium">The fix: fencing tokens.</span>{" "}
          Every time the lock is acquired, a monotonically increasing token
          is issued alongside it. The resource being protected only accepts
          a write if its token is the highest one it has seen. A stale
          worker&apos;s write is rejected even after its lock has expired
          and moved on to someone else &mdash; the token, not the lock
          itself, is what actually protects the resource.
        </p>
      </div>

      <div className="mt-10">
        <DistributedLockDemo />
      </div>

      <p className="mt-8 font-mono text-xs text-muted">
        Backend: Next.js API routes + Upstash Redis. Source:{" "}
        <a
          href="https://github.com/vaibhav-mahalle/labs"
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          github.com/vaibhav-mahalle/labs
        </a>
      </p>
    </main>
  );
}
