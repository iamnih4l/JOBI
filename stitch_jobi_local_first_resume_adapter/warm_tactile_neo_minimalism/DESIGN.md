---
name: Warm Tactile Neo-Minimalism
colors:
  surface: '#fff8f5'
  surface-dim: '#e0d8d5'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2ee'
  surface-container: '#f4ece8'
  surface-container-high: '#eee7e3'
  surface-container-highest: '#e9e1dd'
  on-surface: '#1e1b19'
  on-surface-variant: '#5b413a'
  inverse-surface: '#33302d'
  inverse-on-surface: '#f7efeb'
  outline: '#8f7069'
  outline-variant: '#e3beb6'
  surface-tint: '#b52701'
  primary: '#b52701'
  on-primary: '#ffffff'
  primary-container: '#ff5c35'
  on-primary-container: '#5a0e00'
  inverse-primary: '#ffb4a3'
  secondary: '#1840e6'
  on-secondary: '#ffffff'
  secondary-container: '#3d5dff'
  on-secondary-container: '#f4f3ff'
  tertiary: '#006c49'
  on-tertiary: '#ffffff'
  tertiary-container: '#00a874'
  on-tertiary-container: '#003421'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0700'
  on-primary-fixed-variant: '#8a1c00'
  secondary-fixed: '#dee0ff'
  secondary-fixed-dim: '#bac3ff'
  on-secondary-fixed: '#00105b'
  on-secondary-fixed-variant: '#002fc9'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fff8f5'
  on-background: '#1e1b19'
  surface-variant: '#e9e1dd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2.5rem
  margin-sm: 1rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style

This design system expresses a cheerful, modern neo-minimalist aesthetic tailored for an intelligent, local-first resume tailoring tool. The tone is encouraging, competent, and deeply human—stripping away corporate dread and replacing it with high-clarity confidence, optimism, and warmth.

The visual direction marries the clean compositional discipline of Japanese stationery with tactile, joyful software ergonomics. It relies on airy cream canvases, crisp deep-ink typography, and energetic high-chroma primary accents (poppy tangerine and bright cobalt) paired with crisp mint-lime indicators. UI surfaces feel approachable, soft, and physical without being heavy: pill-shaped badges, generous inner padding, crisp hairline borders, and subtle dimensional bounce on hover and press states.

## Colors

The palette is built around an organic, comforting warm paper backdrop that prevents digital fatigue during intense writing and editing sessions:

- **Primary Accent (`#FF5C35` - Electric Poppy Tangerine):** Used for primary calls-to-action, key conversion states, active step markers, and celebratory AI completion highlights.
- **Secondary Accent (`#3B5BFD` - Bright Cobalt Royal):** Employed for interactive links, diff highlights, target role tags, and secondary action highlights.
- **Tertiary Accent (`#10B981` - Mint Lime):** Reserved for local-first privacy status pills, ATS match scores, verified badges, and positive progression trackers.
- **Neutrals & Surfaces:**
  - **Canvas Background:** `#FBF9F5` (Soft Oat Milk) provides an editorial, book-like warmth.
  - **Elevated Surfaces & Cards:** Pure `#FFFFFF` floating over the oat milk backdrop, flanked by `#F4F0E8` for subtle inset wells and comparison panes.
  - **Text & Ink:** `#1C1917` (Deep Warm Ink) for primary headlines, `#57534E` (Stone Neutral) for body text and descriptive context, and `#A8A29E` for subtle metadata.
  - **Dividers & Strokes:** `#E7E2D9` (Crisp Warm Border) to maintain distinct visual compartmentalization without harsh dark dividers.

## Typography

Typography relies on `Plus Jakarta Sans` across all hierarchies. Its rounded terminals, open counters, and sturdy x-height blend clean legibility with a naturally cheerful rhythm.

- **Headlines:** Use heavy weights (700 and 800) with snug, negative tracking to create an immediate punchy, contemporary identity.
- **Body:** Kept balanced and airy with generous line height (1.5x to 1.6x) to facilitate scanning complex resume text and job requirement analyses.
- **Labels & Badges:** Use semi-bold to bold weights with slight positive tracking for scannable state indicators, ATS match indicators, and toolbar buttons.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid system paired with strict 8pt base increments for vertical rhythm:

- **Desktop (1024px+):** Standard 12-column grid with 24px (`1.5rem`) gutters and a minimum outer canvas margin of 40px (`2.5rem`). Max-content bounds set to 1280px for standard workspace screens and 1440px for split-screen comparison mode (Job Description vs. Active Resume).
- **Tablet (768px - 1023px):** 8-column layout with 20px gutters and 24px margins. Side panels fold into slide-over drawers or stacked tab views.
- **Mobile (< 768px):** 4-column layout with 16px (`1rem`) gutters and 16px outer margin. Side-by-side comparison collapses into a segmented toggle control (`Original` vs `Tailored`).

## Elevation & Depth

Visual depth is achieved through clean white surfaces resting atop the warm paper backdrop, reinforced by ultra-subtle warm ambient drop shadows and hairline outlines:

- **Tier 0 (Canvas):** Flat `#FBF9F5` base background.
- **Tier 1 (Surface Cards & Panels):** Solid `#FFFFFF` fill with a 1px solid border in `#E7E2D9` and a soft ambient shadow: `0 4px 20px -2px rgba(28, 25, 23, 0.04)`.
- **Tier 2 (Floating Modals & Dropdowns):** Crisp white containers elevated with a warmer, slightly deeper spread: `0 12px 32px -4px rgba(28, 25, 23, 0.08), 0 2px 6px -1px rgba(28, 25, 23, 0.04)`.
- **Tactile Hover Dynamics:** Interactive cards and buttons use a slight physical translation (`translate-y-[-2px]`) accompanied by an amplified warm drop shadow on hover, giving components a springy, tactile physical bounce.

## Shapes

The design system embraces high roundedness (Pill & Super-Ellipse) to reinforce its friendly and approachable personality:

- **Pill Elements:** Badges, chips, filter tags, and primary action buttons utilize full pill radii (`rounded-full` / `9999px`).
- **Cards & Working Containers:** Defined with generous outer curvature (16px to 24px / `1rem` to `1.5rem`), softening large data-dense panels.
- **Form Controls:** Text areas and input fields use an inviting 12px to 16px radius, avoiding sharp rectangular corners entirely.

## Components

### Buttons
- **Primary:** Full pill shape (`rounded-full`), `#FF5C35` background with pure white text, bold weight (`label-lg`), and padding `12px 24px`. Subtle downward shadow `0 4px 14px rgba(255, 92, 53, 0.3)`. Translates down 1px with slight scale down (`scale-98`) on active click.
- **Secondary:** Soft porcelain fill `#F4F0E8` with `#1C1917` text and a delicate border `#E7E2D9`. Hover transitions to `#ECE7DC`.
- **Ghost / Tertiary:** No background, `#3B5BFD` label text, hover state fills with transparent tint `rgba(59, 91, 253, 0.08)`.

### Chips & Badges
- **Status Pills:** Pill radius, padding `4px 12px`, typography `label-sm`.
  - *Local AI Active:* Light mint tint background (`#ECFDF5`), deep emerald text (`#065F46`), accompanied by an animated pulsing mint dot.
  - *Match Score:* Soft cobalt tint (`#EFF6FF`), cobalt text (`#1D4ED8`), bold percentage value.
- **Skill Tags / Interactive Chips:** `#FFFFFF` background, 1px `#E7E2D9` border, `rounded-full`, with an interactive dismiss icon (`×`) that pops slightly on hover.

### Inputs & Text Areas
- Built with a `#FFFFFF` fill, 1.5px `#E7E2D9` border, and 14px radius.
- **Focus State:** Border shifts cleanly to `#3B5BFD` with a soft 3px translucent halo (`rgba(59, 91, 253, 0.15)`), eliminating harsh default browser outlines.

### Checkboxes & Radio Buttons
- Rounded squares (6px radius for checkboxes) and circular radios with a 2px border in `#D6D0C4`.
- Checked state fills with `#FF5C35` containing a crisp white icon. Bouncy micro-animation when checked.

### Content & Comparison Cards
- Clean `#FFFFFF` panels on the `#FBF9F5` canvas, bordered with `#E7E2D9`.
- Diff views highlight modifications with soft highlighter styling: deleted text in light terracotta tint with strikethrough, and added/tailored copy highlighted in soft mint green with bold green text.

### Privacy & Local Processing Widget
- A distinctive pinned status pill in the header or bottom corner featuring an emerald shield icon, displaying "100% Local Inference · No data leaves your machine" to build immediate user trust.