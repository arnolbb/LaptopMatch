# LaptopMatch Design System

## Visual Theme
Hardware spec sheet meets tech editorial. Monochrome charcoal foundation with a single cold-teal accent — clinical precision, no decoration.

## Color Palette (OKLCH)

### Dark (default)
- bg:       oklch(0.11 0.004 240)
- surface:  oklch(0.155 0.006 240)
- surface2: oklch(0.195 0.008 240)
- ink:      oklch(0.94 0.004 240)
- ink2:     oklch(0.72 0.010 240)
- primary:  oklch(0.68 0.18 195)   — teal
- accent:   oklch(0.72 0.18 195)   — teal (brighter)
- muted:    oklch(0.52 0.012 240)
- border:   oklch(0.22 0.008 240)
- success:  oklch(0.68 0.16 155)
- danger:   oklch(0.68 0.17 25)

### Light
- bg:       oklch(0.98 0.002 240)
- surface:  oklch(0.94 0.004 240)
- surface2: oklch(0.90 0.006 240)
- ink:      oklch(0.12 0.012 240)
- ink2:     oklch(0.35 0.010 240)
- primary:  oklch(0.45 0.17 195)
- accent:   oklch(0.60 0.18 195)
- muted:    oklch(0.50 0.010 240)
- border:   oklch(0.84 0.006 240)
- success:  oklch(0.52 0.16 155)
- danger:   oklch(0.52 0.19 25)

## Typography
- UI / headings: Space Grotesk (geometric sans, 300–700 weight)
- Spec values, prices, labels, codes: JetBrains Mono (400, 500)
- No display serif — this is product UI, one family + mono pairing is correct
- Headings: font-weight 600, letter-spacing -0.025em
- Mono labels: font-size 0.625rem, tracking-[0.1em], uppercase

## Components
- Borders: 1px solid var(--border), no shadows
- Corners: rounded-sm (border-radius: 2px) — sharp tech aesthetic
- Buttons: rectangular, bg-accent text-bg, no rounded-full
- Chips: thin border, teal fill when active, dot indicator
- Cards: border-only, top accent gradient line on #1 result
- Spec badges: surface bg, mono value, category label above

## Motion
- 150–350ms, easeOut only
- opacity + translateY reveals (10–14px max)
- Staggered card entrance: 0.1s delay per card
- No decorative animations, no orchestrated page load sequences

## Icons
- Lucide React, w-3 h-3 in spec badges
- Correct semantic icons: Cpu (processor), MemoryStick (RAM), HardDrive (storage), Tv2 (GPU), Battery, Weight
