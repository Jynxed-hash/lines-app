# Lines

Phone app for a friend group on a night out: join a **virtual bar line** as a party of N, see wait + deals, get a buzz when you’re 3rd / next. A **door** screen calls the next crew. The sidewalk stays a sidewalk.

v1 is **not** a live NYC heat map. That comes after queues are real.

Approved design: [docs/DESIGN.md](docs/DESIGN.md). GitHub etiquette: [memory/github-etiquette.md](memory/github-etiquette.md).

## Stack

- Expo SDK 57 (`create-expo-app` default + Expo Router)
- In-memory seed venues for demo (Bar Atlas already has two parties ahead)
- Supabase schema stub in `supabase/migrations/001_init.sql` — wire keys later via `.env.local`

## Run

```bash
npm install
npx expo start
```

Open in Expo Go, iOS simulator, Android emulator, or press `w` for web.

**Tonight** — party name + size, filter by deals, get in line.  
**Queue** — your place in line and invite code.  
**Door** — Call next / Admit / No-show. Someone has to run this or the queue is fake.

## GitHub

Repo name: `lines-app`. Use `gh`. Reviewer gate before every commit and pull — see `.cursor/rules/github-etiquette.mdc`.
