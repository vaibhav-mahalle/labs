import Link from "next/link";
import { concepts } from "@/lib/concepts";

export default function Home() {
  return (
    <main className="max-w-content mx-auto px-6 py-20">
      <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase mb-4">
        vaibhav mahalle / labs
      </p>
      <h1 className="text-4xl md:text-5xl font-semibold leading-tight max-w-2xl">
        Small, running proof of concepts.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Each of these is a bare-minimum, live, working implementation of a
        backend/distributed-systems concept &mdash; built to understand it, not
        just describe it. Generic scenarios, real code, real deployed state.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 gap-4">
        {concepts.map((c) =>
          c.status === "live" ? (
            <Link
              key={c.slug}
              href={`/labs/${c.slug}`}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-6 flex flex-col gap-3 hover:border-accent/50 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-lg font-medium">{c.title}</span>
                <span className="font-mono text-xs text-accent shrink-0 mt-1">
                  live
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {c.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs rounded-full border border-white/15 px-3 py-1 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ) : (
            <div
              key={c.slug}
              className="rounded-lg border border-white/5 bg-white/[0.01] p-6 flex flex-col gap-3 opacity-50"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-lg font-medium">{c.title}</span>
                <span className="font-mono text-xs text-muted shrink-0 mt-1">
                  planned
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {c.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs rounded-full border border-white/15 px-3 py-1 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <footer className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between font-mono text-xs text-muted">
        <a
          href="https://vaibhav-portfolio-black-two.vercel.app/"
          className="hover:text-accent transition-colors"
        >
          &larr; back to portfolio
        </a>
        <a
          href="https://github.com/vaibhav-mahalle/labs"
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent transition-colors"
        >
          source on GitHub
        </a>
      </footer>
    </main>
  );
}
