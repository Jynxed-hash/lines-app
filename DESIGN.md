# Design System — Lines

Visual source of truth. Product premises live in `docs/DESIGN.md` and are not restated here as open questions.

## Product Context

- **What this is:** A phone app a friend crew opens on a night out in NYC. Join a virtual bar line as a party of N, see wait and a short briefing, get a buzz when you are 3rd / next. A door screen makes the queue real.
- **Who it's for:** A friend group standing on a sidewalk, one-handed, slightly cold, not shopping for SaaS.
- **Space/industry:** Nightlife door queue. Not restaurant tables (Resy / OpenTable). Not skip-the-line commerce (Wave, L8TE). Not a city heatmap.
- **Project type:** Consumer mobile app (Expo iOS / Android / web).

**Memorable thing:** a quiet sidewalk and a huge place-in-line number. Someone should screenshot Queue, not a deals chip.

## Aesthetic Direction

- **Direction:** Civic night / ticket stub. Editorial type on industrial asphalt. NYC sodium streetlight, not club neon.
- **Decoration level:** Intentional. Hairline borders, ticket-sharp corners, almost no fill chrome. Texture is implied by warm dark, not by noise overlays.
- **Mood:** Calm, close, slightly late. The crowd already left the sidewalk for their phones. The number is loud. Everything else is quiet.
- **Reference (what to steal / refuse):**
  - Steal the *job* of a paper door list and a highway shield number, not their literal graphics.
  - Refuse Wave / Hoppin / L8TE FOMO: neon, maps, VIP passes, purple glow, skip-the-line cards.
  - Refuse TablesReady / Resy: estimated minutes, table grids, SMS-admin chrome.
  - Refuse Expo starter: cool gray, system-ui, pill buttons, Docs badge.

## Visual thesis

1. The place-in-line number is the product. On Queue it is poster-scale. On Tonight it is the right-hand figure on each door, not a caption.
2. Palettes are warm night, not cool OLED. Asphalt and ticket cream. Sodium amber is rare and therefore meaningful.
3. Corners stay ticket-sharp. Full-radius pills read as every other mobile app.
4. Deals sit in the margin. A deal chip must never outrank wait.
5. Door is a clipboard, denser than guest screens. Tonight and Queue breathe. Door does not.

## Typography

- **Display / product name:** Fraunces 600 — soft, late, a little literary. The opposite of a club flyer and of Inter.
- **Place in line (hero):** Saira Extra Condensed 800 — condensed civic numerals. Reads from across the street. Big Shoulders Display left Google Fonts; this keeps the highway-shield scale.
- **Body / UI:** Instrument Sans 400–600 — human, slightly wide, not a dashboard grotesque. Not Inter, Roboto, or Space Grotesk.
- **UI labels / kickers:** Instrument Sans 600, 11–12px, tracked, uppercase. `TONIGHT · NYC`, `INVITE`, `WALK UP`.
- **Data / codes:** IBM Plex Mono 500 — invite codes and door PINs only. Not for body copy.
- **Loading:** `@expo-google-fonts/*` via `expo-font` `useFonts` on native; Google Fonts CSS on web (`src/global.css`). Hold the splash until fonts are ready.
- **Scale (phone):**
  - Kicker 11 / 14, tracking 1.6
  - Body 16 / 24
  - Label 14 / 20
  - Screen title (Fraunces) 40 / 44
  - Venue name 18 / 24
  - Wait figure on cards 44 / 44
  - Queue position 112–128 / 0.9em, letter-spacing −0.04em
  - Button 16 / 20, weight 600

Never use system-ui / -apple-system as the primary display or body face.

## Color

- **Approach:** Restrained. One accent. Color means state (close, called, wrong PIN), not decoration.
- **Dark (default night):**
  - Background `#12100C` asphalt
  - Surface `#1C1914`
  - Selected `#2A241C`
  - Hairline `#3A342C`
  - Text `#F4EDE0` ticket cream
  - Text secondary `#9C9180`
  - Accent / sodium `#E8A317` — 3rd in line, primary CTA fill, focused tab
  - On-accent `#12100C`
  - Called / walk-up `#C6E07A` taxi-green, only when status is `called`
  - Danger `#D48A78` no-show / errors
- **Light (afternoon / outdoor):**
  - Background `#F3EDE1` paper
  - Surface `#E8DFD0`
  - Selected `#D9CCB8`
  - Hairline `#C9BBA6`
  - Text `#1A1612`
  - Text secondary `#6F6558`
  - Accent `#C47A0A` deeper sodium so it holds on paper
  - On-accent `#F3EDE1`
  - Called `#3D6B2F`
  - Danger `#8C3A2A`
- **Primary CTA:** sodium fill, asphalt (or paper) label. Not inverted cream-on-black. Not a gradient.
- **Dark mode strategy:** Dark is the real product. Light is a readable outdoor sibling with the same hierarchy, not a desaturated copy of Material gray.

Contrast: cream on asphalt and asphalt on sodium must stay WCAG AA for body and buttons.

## Spacing

- **Base unit:** 8px (4px half-step for hairlines and compact door rows)
- **Density:** Spacious on Queue, comfortable on Tonight, compact on Door
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)
- Screen horizontal padding: 24. Guest screens stack with 24 gaps. Door rows with 12.

## Layout

- **Approach:** Hybrid. Queue is a poster (one idea, left-aligned, number breaks the scale). Tonight is a stacked door list. Door is a clipboard.
- **Grid:** Single column, phone-first. Max content width 430 on web so the number still feels huge, not a dashboard.
- **Border radius:** ticket 2, sm 4, md 8. No 9999 pills. Chips and buttons share ticket/sm.
- **Composition:** Left-align. Do not center the hero number. Empty Queue is still a poster with quiet copy, not a blank card.

## Motion

- **Approach:** Minimal-functional. The number does not bounce. Called state is a color shift to taxi-green plus the word `NOW`.
- **Easing:** enter ease-out, exit ease-in, move ease-in-out
- **Duration:** micro 80ms (press opacity), short 180ms (filter / chip), medium 280ms (screen). No elastic splash branding leftover as personality.

## Components (this app)

- **Kicker** above every screen title.
- **Place number** (`PlaceNumber`) for Queue hero and Tonight card waits.
- **Night button** primary (sodium) / ghost (hairline) / danger (text only).
- **Venue row:** name + neighborhood + vibe; wait figure on the right; deals as a single quiet line, not a nested card stack.
- **Tabs:** asphalt bar, cream labels, sodium when selected. No Expo Docs chrome on web.

## Anti-patterns (do not ship)

- Purple, cyan-neon, or Expo blue `#208AEF` as brand
- Gradient CTAs, gradient type, blobs
- Inter / Roboto / Poppins / Montserrat / Space Grotesk as primary
- Uniform 16px rounded cards wrapping every block
- Fake minute ETAs as typography (“12 min”)
- City map chrome, heat dots, Uber-style reroute sheets

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-17 | Civic night + ticket stub, not club neon | Memorable thing is a quiet sidewalk and a giant number. Nightlife category language sells FOMO and skip-the-line. Lines sells waiting without a mob. |
| 2026-09-17 | Fraunces + Saira Extra Condensed + Instrument Sans | Literary product voice, civic numerals, human UI. Avoids Inter and Space Grotesk convergence. |
| 2026-09-17 | Sodium `#E8A317` as the only accent | Streetlight, not nightclub. Reserved for 3rd / CTA / selected tab. |
| 2026-09-17 | Ticket-sharp radii, max content 430 | A phone in a pocket, not a SaaS column. |
| 2026-09-17 | Repo-root DESIGN.md is visual; `docs/DESIGN.md` stays product | Office-hours premises stay locked. |
