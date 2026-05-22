# LiveFlows Implementation Roadmap

**Last Updated:** 2026-05-22
**Status:** Draft — based on PRD v1.0 and current repo state

---

## Current State Snapshot

| Area | Status |
|---|---|
| Design System | Done — shadcn/ui, Tailwind 4, primitives (Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea) |
| Editor Chrome | Done — EditorNavbar, ProjectSidebar, dialog layout pattern |
| App Shell | Done — sidebar toggle wired on `app/page.tsx` |
| Package Installation | Partial — Next.js 16, React 19, Prisma 7, Tailwind 4 installed; AI/collab packages not yet installed |
| Database Schema | Not started |
| API Layer | Not started |
| Canvas Engine | Not started |
| AI Streaming | Not started |
| Background Jobs | Not started |

---

## Phase 0: Foundation & Tooling (Week 1)

**Goal:** Install all missing dependencies and establish the core infrastructure layers.

| # | Task | Owner | Deliverable |
|---|---|---|---|
| 0.1 | Install runtime packages: `@liveblocks/react`, `@liveblocks/client`, `ai`, `@ai-sdk/google`, `@xyflow/react` (v12), `@clerk/nextjs`, `zod` | Eng | `package.json` updated, lockfile committed |
| 0.2 | Install background/job packages: `@trigger.dev/sdk`, `@trigger.dev/nextjs`, `stripe`, `@stripe/stripe-js`, `upstash-redis`, `@vercel/blob` | Eng | Same as above |
| 0.3 | Set up Prisma schema in `prisma/schema.prisma` with all models from PRD §8 (Organization, Member, Project, Canvas, Node, Edge, AiJob, Task) | Eng | Schema file + initial migration |
| 0.4 | Configure Supabase connection and verify Prisma client generation | Eng | `lib/db.ts` or equivalent |
| 0.5 | Set up Clerk auth provider in `app/layout.tsx` with org support | Eng | Sign-up/sign-in flows working |
| 0.6 | Scaffold tRPC router structure (`app/api/trpc/[trpc]/route.ts`, `server/routers/`) | Eng | Type-safe API shell |
| 0.7 | Define shared Zod schemas in `@/lib/schemas` (canvas, AI, task export) | Eng | `canvas.ts`, `ai.ts`, `task.ts` |

**Exit Criteria:** `pnpm build` passes; `pnpm dev` starts; a test user can sign up via Clerk and an org is created in Supabase.

---

## Phase 1: Canvas Core (Weeks 2–3)

**Goal:** Build the infinite canvas with React Flow and wire it to Liveblocks for real-time sync.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 1.1 | Initialize React Flow canvas on the editor page with pan/zoom (0.1x–5x) and mini-map | P0 | `app/canvas/[id]/page.tsx` |
| 1.2 | Implement custom node types: Service, Database, Queue, Gateway, Group, Sticky Note | P0 | `components/nodes/` registry |
| 1.3 | Implement edge types: straight, step, smoothstep with arrow markers | P0 | `components/edges/` |
| 1.4 | Build left toolbar (Select, Hand, Node palette, Annotation) and wire to canvas | P0 | `components/CanvasToolbar.tsx` |
| 1.5 | Integrate Liveblocks room provider per canvas; map `Canvas` record → Liveblocks room | P0 | `liveblocks.config.ts`, room hooks |
| 1.6 | CRDT sync for nodes/edges: add, delete, move, resize with conflict resolution | P0 | Liveblocks `Storage` schema |
| 1.7 | Real-time presence: multi-player cursors, user avatars, selection states | P0 | `components/UserCursors.tsx` |
| 1.8 | Keyboard shortcuts: `V/H`, `Space+Drag`, `Cmd/Ctrl+K`, `Delete`, `Cmd/Ctrl+Z/Y` | P1 | `hooks/useCanvasShortcuts.ts` |
| 1.9 | Auto-save / sync webhook: persist Liveblocks CRDT state to Supabase every 5 min | P1 | `app/api/liveblocks/webhook/route.ts` |
| 1.10 | "Follow" mode: sync viewport to another user’s view | P1 | `components/FollowMode.tsx` |

**Exit Criteria:** Two users can open the same canvas URL, see each other’s cursors, add/move nodes, and changes sync in real time with <50ms latency.

---

## Phase 2: AI Stream-to-Canvas (Weeks 4–5)

**Goal:** Enable natural-language prompts that stream structured nodes directly onto the canvas.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 2.1 | Create `POST /api/ai/stream` edge route using Vercel AI SDK with `streamObject` | P0 | `app/api/ai/stream/route.ts` |
| 2.2 | Define Zod schema for AI output (nodes + edges array) | P0 | `lib/schemas/ai.ts` |
| 2.3 | Wire prompt bar UI (bottom-center, collapsible, `Cmd/Ctrl+K`) to stream endpoint | P0 | `components/AIPromptBar.tsx` |
| 2.4 | Implement incremental rendering: nodes/edges appear as stream chunks parse | P0 | React Flow state updater with partial merge |
| 2.5 | Integrate auto-layout engine (Dagre or ELK) for generated diagrams | P0 | `lib/layout.ts` |
| 2.6 | Context awareness: pass existing canvas state into prompt context for "add-on" prompts | P1 | `context.existingNodes/Edges` in stream payload |
| 2.7 | Cancellation support: AbortController stops generation without corrupting canvas | P0 | Cancel button + abort signal |
| 2.8 | Provider fallback chain: Gemini 1.5 Pro → GPT-4o → Claude 3.5 Sonnet | P1 | Provider router in stream handler |
| 2.9 | Error handling: malformed JSON, hallucinated node types → graceful fallback UI | P0 | Zod validation + toast error |
| 2.10 | Upstash rate-limiting and credit ledger (1 credit per 10 nodes) | P1 | `lib/rate-limit.ts`, credit middleware |

**Exit Criteria:** User types "Design a resilient ledger with message queue and reconciliation service" → first node appears in <1.5s, full diagram in <10s, layout is non-overlapping.

---

## Phase 3: Specification & Task Orchestration (Weeks 6–7)

**Goal:** Transform canvas state into technical specs and actionable tasks via background jobs.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 3.1 | Set up Trigger.dev project and worker; define `spec-generation-v1` job | P0 | `trigger/spec-generation.ts` |
| 3.2 | Trigger.dev job: fetch canvas state → prompt LLM for Markdown spec → render Mermaid diagram → upload to Vercel Blob | P0 | Background job + Blob storage |
| 3.3 | UI for triggering spec generation and viewing result in right drawer | P0 | `components/SpecDrawer.tsx` |
| 3.4 | Task extraction job: identify work units from nodes → structured task list | P0 | `trigger/task-extraction.ts` |
| 3.5 | Task list UI in right drawer (status, node linkage) | P0 | `components/TaskPanel.tsx` |
| 3.6 | Jira export integration: OAuth connect, map nodes to Stories, batch create via Jira API | P0 | `trigger/task-sync-jira.ts` |
| 3.7 | GitHub Issues export integration: similar flow via GitHub REST API | P0 | `trigger/task-sync-github.ts` |
| 3.8 | Bi-directional linkage: store LiveFlows canvas URL in exported tickets | P1 | `metadata.liveflowsUrl` in ticket body |
| 3.9 | Credit consumption: 5 credits per spec job, 2 credits per export | P1 | Upstash atomic Lua scripts |

**Exit Criteria:** From a 10-node canvas, user clicks "Generate Spec" → receives a Markdown doc with Mermaid diagram in <60s; clicks "Export to Jira" → Jira Epic created with linked Stories.

---

## Phase 4: Collaboration & Workspaces (Week 8)

**Goal:** Add team hierarchy, RBAC, and in-canvas communication.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 4.1 | Clerk Organizations: multi-workspace per org, invite flows | P0 | Org switcher, invite modal |
| 4.2 | RBAC: Admin/Editor/Viewer roles enforced at UI + API level | P0 | Middleware + UI guards |
| 4.3 | In-canvas threaded comments linked to nodes/coordinates | P1 | `components/CanvasComments.tsx` |
| 4.4 | Activity feed: who moved what, spec generations, exports | P2 | `components/ActivityFeed.tsx` |
| 4.5 | Share dialog: public view-only links, invite by email | P1 | `components/ShareDialog.tsx` |

**Exit Criteria:** Viewer cannot move nodes (UI blocks + tooltip); Admin can invite members; public link renders canvas read-only.

---

## Phase 5: Templates & Marketplace (Week 9)

**Goal:** Bootstrap user onboarding with pre-built architecture patterns.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 5.1 | Template data model + CRUD (Supabase + tRPC) | P1 | `server/routers/template.ts` |
| 5.2 | Template gallery page (`/templates`) with preview thumbnails | P1 | `app/templates/page.tsx` |
| 5.3 | One-click "Fork" template into personal workspace as new project | P1 | `components/ForkTemplateButton.tsx` |
| 5.4 | Seed 10 high-quality community templates (e.g., Next.js + Supabase + Stripe, Event-Driven, Pub/Sub) | P1 | `prisma/seed.ts` or migration |
| 5.5 | Template submission flow: mark project as public template | P2 | `components/PublishTemplateDialog.tsx` |

**Exit Criteria:** New user lands on `/templates`, previews "Next.js + Supabase + Stripe", forks it, and is on a populated canvas in <5s.

---

## Phase 6: Monetization & Billing (Week 10)

**Goal:** Implement Stripe subscriptions, credit packs, and tier gating.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 6.1 | Stripe checkout integration: Pro/Enterprise plans | P0 | `app/api/stripe/checkout/route.ts` |
| 6.2 | Webhook handler for subscription events (`invoice.paid`, `customer.subscription.updated`) | P0 | `app/api/stripe/webhook/route.ts` |
| 6.3 | Feature gating by plan (Free/Pro/Enterprise) — middleware + UI components | P0 | `lib/plan-gating.ts`, `<ProFeature>` wrapper |
| 6.4 | Credit top-up: one-time credit pack purchases | P1 | Stripe product for credits |
| 6.5 | Billing portal (Stripe Customer Portal) | P1 | `app/billing/page.tsx` |

**Exit Criteria:** Free user hits 10 AI credits → sees upgrade CTA; Pro user subscribes → features unlock instantly via webhook.

---

## Phase 7: Polish, Performance & Observability (Week 11)

**Goal:** Hit the 60fps, <2s TTI, and 99.9% reliability targets.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 7.1 | React Flow virtualization for >200 nodes | P1 | `react-flow` viewport culling or custom virtualizer |
| 7.2 | Sentry integration: error tracking + performance spans (AI + Liveblocks) | P1 | `sentry.client.config.ts`, `sentry.server.config.ts` |
| 7.3 | PII scrubbing on outbound LLM calls | P0 | `lib/sanitize-prompt.ts` |
| 7.4 | Canvas load optimization: skeleton states, lazy drawers, code-splitting | P1 | `loading.tsx`, `dynamic()` imports |
| 7.5 | Stress test: 500 nodes, 4+ simultaneous editors | P1 | Load test script + report |
| 7.6 | Prompt-injection hardening: input sanitization, max length enforcement | P0 | Middleware + Zod validators |
| 7.7 | Dead letter queue + retry logic for Trigger.dev failures | P1 | `trigger.config.ts` retry policy |

**Exit Criteria:** Lighthouse TTI <2s on 4G; 60fps maintained at 500 nodes; zero unhandled Sentry issues in 48h soak test.

---

## Phase 8: Launch Preparation (Week 12)

**Goal:** Ship alpha/beta and gather feedback.

| # | Task | Priority | Deliverable |
|---|---|---|---|
| 8.1 | Feature flags for beta-gated features (Jira/GitHub exports, SSO) | P1 | `lib/flags.ts` (or LaunchDarkly/simple env flags) |
| 8.2 | Analytics instrumentation: `ai_prompt_submitted`, `ai_stream_completed`, `spec_job_triggered`, `task_exported`, `presence_joined` | P1 | `lib/analytics.ts` (Segment/PostHog) |
| 8.3 | Onboarding flow: product tour for first-time canvas users | P1 | `components/OnboardingTour.tsx` |
| 8.4 | Alpha release: internal + 5 design partners | P0 | Deploy to production, invite-only |
| 8.5 | Feedback loop: in-app feedback widget + partner interview schedule | P1 | `components/FeedbackWidget.tsx` |

**Exit Criteria:** 5 design partners complete the "blank canvas → AI generation → spec export" flow without blocking bugs.

---

## Dependency Graph

```
Phase 0 (Foundation)
    │
    ├──► Phase 1 (Canvas Core)
    │       │
    │       ├──► Phase 2 (AI Streaming)
    │       │       │
    │       │       ├──► Phase 3 (Spec & Tasks)
    │       │               │
    │       │               ├──► Phase 4 (Collab & RBAC)
    │       │               │
    │       ├──► Phase 5 (Templates) ──► Phase 6 (Billing)
    │
    └──► Phase 7 (Perf & Obs) ──► Phase 8 (Launch)
```

---

## Key Decisions Needed Before Phase 1

1. **Liveblocks plan:** Free tier has usage limits; confirm paid plan for >100 concurrent rooms.
2. **AI provider API keys:** Obtain Gemini 1.5 Pro, OpenAI, and Anthropic keys; set up provider fallback testing.
3. **Stripe product catalog:** Define exact Pro/Enterprise prices and credit pack SKUs.
4. **Jira/GitHub app registrations:** Create OAuth apps for export integrations.
5. **Vercel Blob pricing:** Estimate storage for specs + PDFs + thumbnails.

---

## Open Questions from PRD §16 — Resolution Target

| Question | Resolution Phase | Owner |
|---|---|---|
| AI data privacy / opt-out toggle | Phase 6 (Enterprise contract review) | Security & Compliance |
| Bi-directional Jira sync (v1 or v1.1?) | Phase 3 (ship one-way in v1) | Product Lead |
| Credit pack USD pricing | Phase 6 | Growth / GTM |
| Download JSON backup | Phase 5 (add "Export JSON" to template drawer) | Engineering |
| Multi-region edge deploy | Phase 7 (latency testing) | Engineering |
| Free-tier watermark on PDFs | Phase 6 (yes, watermark until Pro) | Growth / GTM |
| Template moderation workflow | Phase 5 (manual admin approval v1) | Product Lead |
| Hard concurrency cap per room | Phase 7 (load-test to find limit) | Engineering |
| SOC2 audit log granularity | Phase 4 (node-level history in DB) | Security & Compliance |
| Enterprise BYO API keys | Phase 6 (Enterprise tier config) | Engineering |

---

*End of Roadmap — aligned with PRD v1.0 and current repo state as of 2026-05-22.*
