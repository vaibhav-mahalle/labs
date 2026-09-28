# Vaibhav's Labs

Small, live, running demos of backend/distributed-systems concepts — built to
understand them, not just describe them. Each concept is a generic, invented
scenario with real backing infrastructure (no proprietary or employer code).

## Concepts

- **Distributed Lock with Fencing Tokens** (`/labs/distributed-lock`) — two
  workers race for a lock; watch a plain TTL lock go unsafe under a slow
  worker, and a fencing token catch the stale write. Backed by real Upstash
  Redis.

More concepts get added over time as new routes under `app/labs/<slug>`.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion, same design
system as [vaibhav-portfolio](https://github.com/vaibhav-mahalle/vaibhav-portfolio).
Server-backed concepts use [Upstash Redis](https://upstash.com) (REST-based,
serverless-friendly).

## Getting started

Requires Node 18.17+.

```bash
npm install
cp .env.local.example .env.local   # fill in your own Upstash credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```
