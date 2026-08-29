# NOTES.md — Accessibility Component Comparison

## What I Built
Three accessible components from scratch in React + TypeScript:
- Modal dialog with focus trap
- Tabs with keyboard navigation
- Disclosure with aria-expanded

## What Shadcn Handled That I Missed

### Gap 1 — Focus Trap Implementation
My modal focus trap was basic — I manually queried 
focusable elements but missed edge cases like disabled 
buttons and hidden inputs. Shadcn uses Radix UI's 
FocusTrap which handles all focusable element types 
including custom components.

### Gap 2 — Portal Rendering
My modal rendered inside the component tree which caused 
z-index and overflow issues. Shadcn's dialog uses 
React Portal to render at document body level, 
avoiding CSS stacking context problems entirely.

### Gap 3 — Animation and Reduced Motion
My components had no animation consideration. Shadcn 
respects prefers-reduced-motion media query automatically, 
disabling animations for users who need it. This is 
a real accessibility requirement I completely missed.

### Gap 4 — Screen Reader Announcements
Shadcn adds aria-live regions for dynamic content 
changes. My tabs had no announcement when panel 
content changed — a screen reader user would not 
know the content updated.

## Keyboard Test Results

### Modal
- Tab cycles within modal: ✅
- Escape closes and returns focus: ✅
- Overlay click closes: ✅
- First element focused on open: ✅

### Tabs
- Arrow keys navigate: ✅
- Home/End keys work: ✅
- Enter/Space selects: ✅
- aria-selected updates: ✅

### Disclosure
- Enter/Space toggles: ✅
- aria-expanded updates: ✅
- Panel id matches aria-controls: ✅

## TypeScript
- No "any" types used in any component: ✅
- All props properly typed with interfaces: ✅