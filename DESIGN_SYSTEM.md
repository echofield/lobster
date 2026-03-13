# Lobster Design System

A minimal, premium UI language for sound/creative applications. Copy this into any frontend project conversation.

---

## Core Philosophy

**Less is presence.** Every element earns its place through restraint. The interface should feel like a physical artifact - a premium object you hold, not a screen you tap.

**Single color dominance.** One accent color (violet by default) at varying opacities creates depth without chaos.

**Breathing, not static.** Subtle animations suggest life. Elements pulse, fade, drift - never jump or flash.

**Ghost layers.** Background elements exist at near-invisible opacities (0.02-0.05), creating depth without distraction.

---

## Color System

```
Background:     #FAF8F2  (warm paper)
Background Alt: #F5F3ED  (paper shadow)
Text:           #1A1A1A  (soft black)
Accent:         #8B5CF6  (violet)
Accent Light:   #C4B5FD  (lavender)
Accent Glow:    rgba(139, 92, 246, 0.4)
Grey Light:     #E8E5DE
Grey Medium:    #C8C4BA
```

### Alternate Palettes

```
Amber:   #F59E0B / #FCD34D / rgba(245, 158, 11, 0.4)
Emerald: #10B981 / #6EE7B7 / rgba(16, 185, 129, 0.4)
Rose:    #F43F5E / #FDA4AF / rgba(244, 63, 94, 0.4)
Slate:   #64748B / #CBD5E1 / rgba(100, 116, 139, 0.4)
```

---

## Opacity Scale

Use opacity to create hierarchy without adding colors:

```
0.02 - 0.05  Ghost (background patterns, grids, textures)
0.08 - 0.15  Whisper (inactive borders, subtle dividers)
0.20 - 0.30  Muted (secondary text, disabled states)
0.40 - 0.50  Present (labels, icons, secondary actions)
0.60 - 0.80  Active (body text, interactive elements)
1.00         Primary (headings, primary actions, focus states)
```

---

## Typography

```
Headings:     font-weight: 500-600, letter-spacing: 0.02em
Labels:       text-transform: uppercase, letter-spacing: 0.15-0.2em, font-size: 8-10px
Body:         font-weight: 400, letter-spacing: 0.01em
Micro:        font-size: 7-8px, uppercase, opacity: 0.3-0.4
```

### Size Scale

```
Micro:    7-8px   (hints, metadata)
Small:    9-10px  (labels, captions)
Body:     12-14px (content)
Large:    16-20px (section titles)
Display:  24-48px (hero elements)
```

---

## Spacing

```
Tight:    4-8px   (within components)
Normal:   12-16px (between related elements)
Relaxed:  24-32px (between sections)
Generous: 48-64px (major divisions)
```

---

## Animation Principles

### Timing

```
Instant:  100-150ms  (hover, active states)
Quick:    200-300ms  (micro-interactions)
Smooth:   500-800ms  (transitions, reveals)
Slow:     1000-2000ms (ambient animations)
```

### Easing

```
Enter:    [0.16, 1, 0.3, 1]     (ease-out-expo)
Exit:     [0.4, 0, 0.2, 1]      (ease-in-out)
Bounce:   [0.34, 1.56, 0.64, 1] (overshoot)
Spring:   stiffness: 300, damping: 25
```

### Patterns

**Fade Up:** Elements enter with opacity 0 → 1 and y: 20px → 0
```
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
```

**Scale Pulse:** Active elements breathe
```
animate: { scale: [1, 1.02, 1] }
transition: { duration: 2, repeat: Infinity }
```

**Stagger Children:** Lists reveal sequentially
```
delay: index * 0.1
```

**Glow Pulse:** Accent elements pulse their shadow
```
animate: {
  boxShadow: [
    '0 0 20px rgba(139, 92, 246, 0.2)',
    '0 0 40px rgba(139, 92, 246, 0.4)',
    '0 0 20px rgba(139, 92, 246, 0.2)'
  ]
}
transition: { duration: 2, repeat: Infinity }
```

---

## Component Patterns

### Cards/Containers

```
background: rgba(26, 26, 26, 0.02)
border: 1px solid rgba(26, 26, 26, 0.05)
border-radius: 12-16px
padding: 16-24px
```

### Buttons

**Primary:**
```
background: #8B5CF6
color: #FAF8F2
padding: 8px 16px
border-radius: 8px
font-size: 10px
letter-spacing: 0.15em
text-transform: uppercase
```

**Ghost:**
```
background: transparent
color: #1A1A1A
opacity: 0.4
hover:opacity: 1
```

### Inputs

```
background: rgba(26, 26, 26, 0.05)
border: 1px solid rgba(26, 26, 26, 0.1)
border-radius: 8px
padding: 8px 12px
font-size: 12px
outline: none
focus:border-color: #8B5CF6
```

### Sliders

```
height: 4px
background: #E8E5DE
border-radius: 2px
thumb: 12px circle, #8B5CF6
track-fill: #8B5CF6
```

---

## Layout Patterns

### Navigation

```
position: fixed
top: 0
padding: 16-24px horizontal
display: flex
justify-content: space-between
align-items: center
background: gradient to transparent
z-index: 50
```

### Content Centering

```
min-height: 100vh
display: flex
align-items: center
justify-content: center
padding: 64px 16px
```

### Split View

```
display: flex
gap: 40px
left-panel: 320px fixed
right-panel: flex-1
```

---

## Decorative Elements

### Corner Marks

Small L-shaped marks at corners suggesting registration/print marks:
```
position: fixed
width: 32px
height: 32px
opacity: 0.08
```

### Dot Grids

Subtle background pattern:
```
pattern: circles, 0.5px radius
spacing: 40px
opacity: 0.03
```

### Orbit Circles

Concentric dashed circles:
```
stroke-dasharray: 4 4
stroke-opacity: 0.1
stroke-width: 0.5px
```

### Diamond Markers

Small rotated squares as section markers:
```
width: 8-12px
height: 8-12px
border: 1px solid rgba(26, 26, 26, 0.2)
transform: rotate(45deg)
```

---

## Interactive States

### Hover

```
scale: 1.02
opacity: +0.2 (if muted)
transition: 150ms
```

### Active/Pressed

```
scale: 0.98
transition: 100ms
```

### Focus

```
outline: none
box-shadow: 0 0 0 2px #8B5CF6
```

### Selected

```
background: rgba(139, 92, 246, 0.1)
border-color: #8B5CF6
```

### Loading

```
opacity: 0.5
pointer-events: none
pulse animation on indicator
```

---

## Responsive Breakpoints

```
Mobile:  < 640px   (scale: 0.55-0.6, hide decoratives)
Tablet:  640-1024px (scale: 0.75-0.85)
Desktop: > 1024px  (full experience)
```

### Mobile Adaptations

- Hide decorative elements (corner marks, grids)
- Stack layouts vertically
- Increase touch targets to 44px minimum
- Scale complex components via CSS transform
- Use negative margins to compensate for scaling

---

## Dark Mode Variant

```
Background:     #0A0A0B
Background Alt: #121214
Text:           #FAFAFA
Accent:         #A78BFA (lighter violet)
Grey:           #27272A
```

---

## Sound/Audio Specific

### Waveforms

```
height: 32-48px
bar-width: 2-3px
bar-gap: 1px
bar-radius: 1px
inactive: opacity 0.2
active: full opacity with glow
```

### Meters/Levels

```
vertical bars or circular arcs
gradient: accent-light to accent
smooth transitions (100ms)
```

### Sequencer Grids

```
dot-size: 8px
active: filled with accent
inactive: border only, opacity 0.2
current-step: scale 1.2 + glow
```

---

## Implementation Notes

1. **Always use opacity before adding colors** - try to solve hierarchy with transparency first

2. **Animations are optional enhancements** - UI must work without them

3. **Touch targets ≥ 44px** on mobile, visual size can be smaller

4. **Gradients are subtle** - max 10-20% opacity difference between stops

5. **Shadows are colored** - use accent color in shadows, not black

6. **Borders are nearly invisible** - 0.5-1px, opacity 0.05-0.15

7. **Text never pure black** - use #1A1A1A or dark with 0.8-0.9 opacity

8. **Background never pure white** - use warm off-whites (#FAF8F2)

---

## Example: Card Component

```
Container:
  background: rgba(26, 26, 26, 0.02)
  border: 1px solid rgba(26, 26, 26, 0.05)
  border-radius: 16px
  padding: 24px

  hover:
    background: rgba(139, 92, 246, 0.03)
    border-color: rgba(139, 92, 246, 0.1)
    transform: scale(1.01)
    transition: 200ms ease-out

Title:
  font-size: 14px
  font-weight: 500
  color: #1A1A1A
  letter-spacing: 0.02em

Subtitle:
  font-size: 10px
  text-transform: uppercase
  letter-spacing: 0.15em
  color: #1A1A1A
  opacity: 0.4
  margin-top: 4px

Accent Element:
  width: 8px
  height: 8px
  background: #8B5CF6
  border-radius: 50%
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.4)
```

---

## Prompt Template for New Projects

Copy this to start a new project with this design language:

```
I want to build [PROJECT TYPE] with a minimal, premium aesthetic.

Design language:
- Warm paper background (#FAF8F2), soft black text (#1A1A1A)
- Single accent color: [violet #8B5CF6 / or choose another]
- Opacity-based hierarchy (ghosts at 0.02-0.05, whispers at 0.1-0.2, present at 0.4-0.6)
- Uppercase micro-labels with wide letter-spacing
- Subtle animations: fade-up entrances, breathing pulses, spring physics
- Decorative marks: corner registrations, dot grids, dashed orbit circles
- Nearly invisible borders (0.5-1px, 5-10% opacity)
- Colored shadows using accent color, not black

The UI should feel like a physical artifact - restrained, intentional, premium.
Hide decorative elements on mobile. Scale complex components via CSS transform.

[DESCRIBE YOUR SPECIFIC FEATURES]
```

---

This system creates interfaces that feel quiet but alive - premium without being cold, minimal without being empty.
