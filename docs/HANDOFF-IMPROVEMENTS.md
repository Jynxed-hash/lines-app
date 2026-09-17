# Lines — Handoff: what to improve next

Reviewed at commit `6b52b82` (initial push to `lines-app`). Written for whoever picks this up next. The design is settled; do not re-derive it. Read `docs/DESIGN.md` once, then work from this file.

## One-paragraph orientation

Lines is a friend-group virtual bar line for NYC nights. A **party of N is one ticket**. Guests join a bar's line from **Tonight**, watch their place on **Queue**, and get a **buzz at 3rd and when called**. The **Door** screen (Call next / Admit / No-show) is what makes the queue real. v1 runs entirely in memory on seed venues (Bar Atlas, Harbor Room, Kiln). Supabase is a SQL stub only; no client is wired. Expo SDK 57, Expo Router, React 19, `reactCompiler: true`.

## What to improve next

Ordered by value to the first real night out, not by code size.

1. **Make "You're next" mean the door actually called you.** Today `notifiedNext` flips when position hits 1 (`applyPositionFlags` in `night-store.tsx`), so the phone says "the door is calling" before anyone tapped Call next. The Queue screen already keys off `status === 'called'`; make the buzz do the same. Keep the 3rd buzz position-based.
2. **Let friends join the ticket.** An invite code is generated and displayed but there is no "Join crew with code" input anywhere. "One ticket for the crew" is a promise the app cannot keep yet. In memory this is trivial: look up the entry by `inviteCode`, set `myEntryId`. Put the input on the Queue empty state.
3. **Add Leave line.** No way for a guest to back out. Add a `'left'` status (client enum + SQL check constraint) and a button on Queue. Do not delete the entry; the door should see it disappear.
4. **Fix the honesty of the wait label.** Tonight says "N parties ahead **for your size**" but `waitForPartySize` ignores size. Either drop "for your size" or return `{ partiesAhead, peopleAhead }` (sum of `partySize`) and show both. Never show minutes.
5. **Gate the Door screen.** Any phone can call/admit/no-show any venue. Before auth exists, use a per-venue door PIN (constant in `seed-venues.ts`, entered once, held in state) and hide the Door tab until it is entered. This is a demo gate, not security; say so in a comment. The PIN will be visible in the client bundle to anyone who inspects it.
6. **Fix `notify.ts` ordering.** Permission is requested lazily inside `buzz`, so the very first buzz (3rd place) is swallowed by the OS permission dialog. Request permission on `joinLine`. Create an Android notification channel at startup (Android 13 shows no permission prompt until a channel exists). Guard `setNotificationHandler` behind `Platform.OS !== 'web'`; it runs at import on web today.
7. **Persist the night across reloads.** Metro reload or an app kill drops you out of line. Before Supabase, serialize `entries` + `myEntryId` to local storage (check SDK 57 docs for the current recommended key-value store; do not guess the package). Demo entries should only seed when storage is empty.
8. **Extract pure queue logic and test it.** `positionIn`, `applyPositionFlags`, `callNext` selection, and the wait calculation are pure functions trapped in a React file. Move them to `src/state/queue-logic.ts` and add `jest-expo` tests. This is where cheaper models will introduce regressions; tests are the guardrail.
9. **Make `queue.tsx` read venues from the store.** It imports `SEED_VENUES` directly; that breaks the moment venues come from a backend. Use `venues` from `useNight()`.
10. **Then, and only then, Supabase.** See RLS pitfalls below. Keep the in-memory store working as the default when `EXPO_PUBLIC_SUPABASE_URL` is empty.

## Pitfalls

### Async and state

- `joinLine` reads `myEntryId` from the closure to drop the previous entry. Fine for one tap; if a rejoin is ever triggered from an effect or from network data, use the functional updater on `myEntryId` too, or you will orphan an entry.
- `applyPositionFlags` uses `position === 3` and `position === 1`. In memory positions move one step at a time. With a live backend, a batch of admits can jump you from 5 to 2 and the 3rd buzz never fires. Use `<= 3` (and keep the "already notified" latch).
- The buzz side effect lives in a `useEffect` on `entries`. That works because state changes are local. Once state arrives from Realtime, the phone must be **foregrounded** for that effect to run. A phone in a pocket will not buzz. Local notifications cannot fix this; only server-sent push can (see Notifications).
- `buzzedRef` dedupes per entry id in memory only. After persistence lands, a reload will re-buzz the 3rd notice unless the latch is persisted too (the `notifiedThird` / `notifiedNext` flags already are; use them as the latch instead of the ref).
- `callNext` will mark a second party `called` while the first is still unresolved. That is acceptable, but the Door UI should pin called parties to the top so the bouncer sees them.
- `reactCompiler: true` is on. The `useCallback`/`useMemo` wrapping is mostly redundant but harmless. Do not mutate refs during render; the compiler will not save you.

### Expo notifications (SDK 57, verified against the versioned docs)

- Local notifications (what `buzz` does) work in Expo Go on both platforms.
- **Remote push does not work in Expo Go on Android** since SDK 53. When you move to server-sent push you need a development build (EAS or `npx expo run:android`). Plan for that; do not debug "push works on iOS Go but not Android Go" for an hour.
- Android 13+: the permission prompt does not appear until at least one notification channel is created. Call `setNotificationChannelAsync` before requesting permission or fetching a token.
- On iOS, read `permissions.ios.status` rather than the root `granted` if you ever care about provisional auth. For v1, `granted` is fine.
- `Notifications.setNotificationHandler` is what makes a foreground notification visible. It is set. Do not remove it thinking it is boilerplate.
- Do not set `sound: 'default'` and also expect silent behavior; sound is controlled per channel on Android 8+.

### Supabase / RLS (`supabase/migrations/001_init.sql`)

- **RLS is enabled on every table with zero policies.** This is intentional and documented in the SQL header. It means the anon key can read and write nothing. The first time someone wires `createClient` and sees empty arrays with no error, this is why. Do not "fix" it by disabling RLS.
- `parties` has no owner or member column, so you cannot write a "my party" policy yet. Add `owner_id uuid references auth.users` (or a `device_id text` if you choose anonymous auth) before writing policies.
- Suggested v1 policy shape: `venues` and `deals` public `select`; `queue_entries` `select` for all (positions are public by design), `insert` only for the party owner; **no direct `update`** from clients. Door actions (call/admit/no-show) go through a `security definer` RPC that checks a door PIN or a `door_staff` row. That is also where status transitions (`waiting → called → admitted | no_show`) get enforced; the schema does not enforce them.
- `notified_third` / `notified_next` are stored in the DB but nothing server-side sets them. When push exists, a trigger or Edge Function on `queue_entries` status change should own them, not the client.
- `venues.occupancy` is a static number. Either label it "approx" in the UI or derive it from admits minus a manual reset. Do not present it as live.
- Nothing prevents one party from sitting in two active lines. Add a partial unique index on `(party_id) where status in ('waiting','called')` when you want to enforce it.

### Door without auth

- Today anyone with the app can operate any venue's door. This is fine for a demo among friends and unacceptable the moment a non-friend has the build. Door PIN first (item 5), real auth with the backend later. Never ship a store build with an open Door tab.

### Math.random IDs and invite codes

- `makeId` and `makeInviteCode` use `Math.random`. Entry ids collide rarely but can; invite codes are 4 chars from a 36-char alphabet (~1.7M space) and are guessable. Acceptable in memory. When the backend arrives, ids come from `gen_random_uuid()` and invite codes must be generated server-side with a uniqueness check (the `unique` constraint is already there; handle the conflict). Do not use `Math.random` for anything a stranger could enumerate.

### Wait-for-N honesty

- The design rule: **unknown beats a fake ETA.** Show counts (parties ahead, people ahead), never minutes, until there are real door events to learn from. If someone proposes "estimate 4 min per party," say no and point at `docs/DESIGN.md` § Technical sketch.

## Suggested work order

Each step is one PR into `main` (`feat/...` or `fix/...`). Run `code-reviewer` and `security-reviewer` before every commit and every pull (see `memory/github-etiquette.md`). Run `npm run typecheck` and `npm run lint` before opening a PR.

1. `fix/next-means-called` — buzz "next" on `status === 'called'`; `<= 3` for third. Small, ships alone.
2. `feat/join-crew` — invite-code input on Queue; `joinCrew(code)` in store. Add Leave line in the same PR (both touch the Queue screen and status enum).
3. `fix/wait-label-honesty` — return people-ahead, fix the label text.
4. `feat/door-pin` — gate Door tab behind per-venue PIN held in state.
5. `fix/notify-ordering` — request permission on join, Android channel at startup, web guard.
6. `refactor/queue-logic` — pure module + `jest-expo` tests. Do this **before** persistence and backend so regressions are caught.
7. `feat/persist-night` — local storage for entries/myEntryId; seed demo only when empty.
8. `feat/supabase-read-path` — `.env.local`, client, policies for public reads, load venues/deals/queue from DB when URL is set, otherwise in-memory. Realtime subscription on `queue_entries` for the venue you're in.
9. `feat/supabase-write-path` — join/leave insert, door RPC with PIN check.
10. `feat/push-on-status-change` — Edge Function → Expo Push on `called` and on reaching 3rd; dev build required for Android testing.
11. **Real night with the friend group.** Only after that: any v2 talk.

## Files that matter

| File | What it is | Touch it when |
| --- | --- | --- |
| `src/state/night-store.tsx` | All night state, position flags, buzz effect | Any queue behavior change. Extract pure logic first. |
| `src/app/index.tsx` | Tonight: party box, deals filter, venue cards, Get in line | Wait label, join flow |
| `src/app/queue.tsx` | Queue: my position, invite code, status copy | Join crew, Leave line, empty state |
| `src/app/door.tsx` | Door: venue chips, Call next, Admit / No-show | PIN gate, pin called parties to top |
| `src/app/_layout.tsx` | Root layout: `NightProvider`, tabs, splash | Startup work (Android channel, storage hydrate) |
| `src/lib/notify.ts` | Permission + local buzz | All notification changes |
| `src/lib/seed-venues.ts` | Bar Atlas / Harbor Room / Kiln + deals | New seed venue, door PIN constants |
| `supabase/migrations/001_init.sql` | Schema stub, RLS on, no policies | Add owner column, policies, RPC, `left` status |
| `.env.example` | `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` (empty) | Never commit real values |
| `docs/DESIGN.md` | Approved design, premises, out-of-scope list | Read; do not rewrite |
| `memory/github-etiquette.md`, `.cursor/rules/github-etiquette.mdc` | Reviewer gate, branch/PR rules, no Cursor origin | Before every commit/pull/push |
| `app.json` | `expo-notifications` plugin, `reactCompiler`, `typedRoutes` | Notification icon/channel config for builds |

Not present and not needed yet: a Supabase client module, tests, CI. Add tests (item 8) before CI.

## What NOT to build yet

These were explicitly deferred in the approved design. If a task asks for them, push back and point here.

- **City heat map.** No map of NYC, no neighborhood map, no pins with wait times. A map is a lie until many real queues exist. Even "just one block" is v2.
- **Uber-style auto-reroute.** No "wait blew up, switch to Harbor Room?" suggestions, no tap-to-switch. The crew decides; the app shows counts.
- **Stranger pickup groups.** Parties are friends who share an invite code. No public "join a group" browsing.
- **Payments, cover, ID scan, bouncer OS.** No Stripe, no cover collection, no ID verification, no staff scheduling.
- **Resy-for-restaurants.** No tables, no reservations, no restaurant venues. Bars only.
- **Fake ETAs.** Covered above; listed again because it is the most tempting shortcut.

## Quick sanity checklist for any PR

- Does the buzz still fire at 3rd and on `called`, and not before?
- Can the door still Call next / Admit / No-show on all three seed venues?
- Does `npm run typecheck` pass? Does the web build (`w` in `expo start`) still load without a notifications error?
- Did you add a minute-based ETA, a map, or a reroute? Revert it.
- Did reviewers run before the commit?
