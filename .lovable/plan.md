
# MedSorts MVP Build Plan

A modern, AI-powered medical productivity platform. Built in one pass with Lovable Cloud (auth + DB) and Lovable AI Gateway. Most feature pages will be functional shells with the AI Assistant fully working; deeper integrations (Stripe, Google/Outlook calendar sync, voice dictation backend, file parsing) will be UI-complete but flagged as next-step work.

## Design System

- Palette in `src/styles.css` as oklch tokens:
  - `--primary` Medical Blue `#0F6CBD`
  - `--secondary` Healthcare Green `#19B394`
  - `--accent` Indigo `#4F46E5`
  - `--background` `#F7FAFC`, `--card` white, `--foreground` `#1F2937`
  - Dark mode equivalents
- Typography: Inter via `<link>` in `__root.tsx` head (no CSS @import).
- Apple-inspired: large rounded corners (`--radius: 1rem`), soft layered shadows, subtle glassmorphism (`bg-white/60 backdrop-blur-xl` on nav/cards), gradient hero (`primary` → `accent`), Framer Motion fades/slide-ups.
- All colors via semantic tokens — no hardcoded hex in components.

## Backend (Lovable Cloud)

Enable Cloud, then create migration:
- `profiles` (id → auth.users, full_name, hospital, specialty, registration_number, avatar_url)
- `app_role` enum (`admin`, `doctor`) + `user_roles` table + `has_role()` SECURITY DEFINER
- `ai_conversations` (id, user_id, title, created_at)
- `ai_messages` (id, conversation_id, role, parts jsonb, created_at)
- `appointments` (id, user_id, title, starts_at, ends_at, kind, notes)
- `templates` (id, user_id, name, category, body)
- `saved_research` (id, user_id, title, url, snippet, tags)
- Trigger to auto-create profile on signup
- GRANTs + RLS scoped to `auth.uid()` on all tables

Configure social auth (Google) via `supabase--configure_social_auth`.

## Routes (TanStack file-based)

Public:
- `/` — Landing (hero, features, pricing, footer)
- `/features`, `/pricing`, `/about`, `/contact`
- `/auth` — Email/password + Google sign-in

Authenticated (`_authenticated/`):
- `/dashboard` — Welcome, stat cards, today's appointments
- `/assistant` — Streaming AI chat (threaded via `/assistant/$threadId`)
- `/email-generator`
- `/summaries` — Upload + AI summary (UI; parsing stubbed)
- `/research` — Search + filters (AI-powered)
- `/schedule` — Calendar view (week/day) backed by appointments table
- `/templates` — Library + one-click generate
- `/dictation` — Web Speech API → AI structuring
- `/analytics` — Usage charts (Recharts)
- `/profile` — Profile + settings (dark mode toggle)
- `/admin` (role-gated) — Doctors list, AI usage, audit log shell

## AI Integration

- `src/lib/ai-gateway.server.ts` — Lovable AI Gateway provider helper
- `src/routes/api/chat.ts` — streaming chat for assistant (`google/gemini-3-flash-preview`)
- `src/lib/ai.functions.ts` — `createServerFn`s for email generation, summary, research, dictation structuring, template fill (all `requireSupabaseAuth`)
- AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`) for assistant UI
- Custom domain-specific logo (generated medical-cross/stethoscope mark), not Sparkles

## Components

- `AppShell` with sidebar nav (desktop) + bottom nav (mobile)
- `MarketingNav` glassmorphic top nav for public pages
- shadcn primitives throughout
- Framer Motion page transitions and hero animation

## Out of Scope (Stubbed with clear "Coming soon" notices)

- Stripe checkout (pricing page shows tiers, CTAs route to /auth)
- Google/Outlook calendar OAuth sync (local appointments only)
- PDF/DOCX parsing for summaries (textarea paste works; file upload is UI)
- MFA, audit log persistence, hospital admin team management
- DOCX export (PDF export via browser print)

These are deliberately deferred so the MVP ships end-to-end. Each section gets a small "Next: connect X" badge.

## Build Order

1. Enable Cloud + run migrations + configure Google auth
2. Design tokens, fonts, AppShell, MarketingNav, logo
3. Landing + marketing pages
4. Auth page + `_authenticated` integration
5. Dashboard
6. AI Assistant (chat route + thread storage)
7. Email Generator, Summaries, Research, Templates, Dictation (AI server fns)
8. Schedule, Analytics, Profile, Admin
9. SEO meta on every route, polish, mobile QA

Heads up: this is a large build — expect long generation time and a few follow-up iterations to polish individual surfaces.
