# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Lines
**Generated:** 2026-09-17
**Category:** Nightlife queue (entertainment / social)

CLI `--design-system` recommended **Vibrant & Block-based**, **Righteous + Poppins**, and CTA `#F97316`. Color/style searches for nightlife then shifted the canvas to **Theater / Podcast dark** (`#0F0F23`) so Tonight, Queue, and Door share one paired light/dark token set — readable at 1am, not a SaaS dashboard, not near-black `#000`.

Raw generator output: `design-system/lines/MASTER.md`.

---

## Global Rules

### Color Palette (paired light / dark)

| Role | Light | Dark | CSS / token |
|------|-------|------|-------------|
| Background | `#F8FAFC` | `#0F0F23` | `background` |
| Surface / card | `#EEF2FF` | `#1B1B30` | `backgroundElement` |
| Selected surface | `#E0E7FF` | `#27273B` | `backgroundSelected` |
| Text | `#1E293B` | `#F8FAFC` | `text` |
| Secondary text | `#475569` | `#CBD5E1` | `textSecondary` |
| Primary / CTA | `#F97316` | `#F97316` | `primary` |
| On primary | `#0F172A` | `#0F172A` | `onPrimary` |
| Accent | `#2563EB` | `#818CF8` | `accent` |
| On accent | `#FFFFFF` | `#0F0F23` | `onAccent` |
| Danger | `#DC2626` | `#F87171` | `danger` |
| Border | `#CBD5E1` | `#3F3F63` | `border` |
| Focus ring | `#2563EB` | `#F97316` | `focus` |

Navy-on-orange (`onPrimary`) keeps CTA type ≥4.5:1. Do not put white type on `#F97316`.

### Typography

- **Heading / hero:** Righteous (web) · SF Pro Rounded (iOS) · system (Android)
- **Body:** Poppins (web) · system-ui (native)
- **Mood:** music, entertainment, fun, energetic, bold, performance
- **Hero number:** 72–80px, Righteous/rounded, one number owns the Queue screen
- **Body:** 16px / 24px line-height minimum

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Righteous&display=swap');
```

### Spacing / touch / motion

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4 | Tight gaps |
| `--space-sm` | 8 | Icon gaps, **min touch spacing** |
| `--space-md` | 16 | Standard padding |
| `--space-lg` | 24 | Section padding |
| `--space-xl` | 32 | Large gaps |
| `--touch-min` | 44 | All pressables |
| `--motion-press` | 180ms | Press in |
| `--motion-release` | 220ms | Press out |
| `--radius-md` | 12 | Cards |
| `--radius-lg` | 16 | Hero blocks |
| `--radius-pill` | 999 | Chips / primary CTA |

---

## Component Specs

### Buttons

One **primary CTA per screen**. Secondary actions (filter, leave, admit) use surface chips.

- Primary: orange fill, navy type, min height 44, pill, `accessibilityRole="button"` + label
- Press: opacity + scale 0.97 over 180ms; skip scale when reduced motion
- Focus: 3px ring in `focus` token
- Web: `cursor: pointer`

### Cards

Block layout, 16px radius, indigo-tinted surfaces (not gray SaaS cards). Selected venue: 2px accent/primary border. Do not treat every card join as a primary button.

### Inputs

Visible label above the field. Placeholder is hint only (never the only name). Height ≥44. Error in `danger` under the field, `accessibilityLiveRegion="polite"`.

### Icons

Vector only (`expo-symbols` / SF Symbols / Material). No emoji icons. Outline vs fill: outline idle, fill selected on tabs.

---

## Style Guidelines

**Style:** Vibrant & Block-based on a nightlife canvas (OLED-friendly dark, not cyberpunk neon)

**Keywords:** Bold blocks, high contrast, geometric, energetic, quiet sidewalk, huge place-in-line

**Key Effects:** Large type (32px+), 48px section gaps on Queue hero, 180–220ms press, no decorative parallax

### Screen pattern (app, not landing)

1. **Tonight** — party block, deal chip, venue blocks, **one** Get in line
2. **Queue** — hero ordinal (“3rd”), quiet sidewalk line, invite code; Join crew is the empty-state CTA
3. **Door** — venue chips, labeled PIN, Unlock / Call next as the single primary

---

## Anti-Patterns (Do NOT Use)

- Mixing light Tonight with near-black Queue/Door (one token set, dark default on web)
- Placeholder-only Door PIN
- Emoji as icons
- Unlabeled `Pressable` (web snapshot generics)
- Touch targets under 44pt
- White type on `#F97316`
- SaaS dashboard density, Expo docs chrome in the tab bar
- Instant press (0ms) or ignoring reduced motion
- Multiple competing primary CTAs on one screen
