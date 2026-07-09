---
name: react-render-loop-debugging
description: Diagnose Maximum update depth and form field reset bugs from unstable effect dependencies
---

# React Render Loop Debugging

Use this skill when investigating **"Maximum update depth exceeded"**, **runaway re-renders**, or **form fields resetting while typing**.

Fix patterns live in [`.cursor/rules/095-react-effect-hygiene.mdc`](../rules/095-react-effect-hygiene.mdc) — apply those once root cause is confirmed.

## Symptom: "Maximum update depth exceeded"

**Suspect first:** an effect that both **reads** a prop/state and **calls a setter or callback** that changes that same prop/state upstream.

Typical chain:

1. Child `useEffect` lists a callback prop in its dependency array
2. Parent passes an inline arrow function (new identity every render)
3. Effect runs → calls callback → parent `setState` → re-render → new callback → effect runs again → loop

**Where to look:** components with `useEffect` that notify parents (`onRangeChange`, `onScroll`, `onDirtyChange`, etc.). See rule §2 and §5.

**Canonical example:** [`CalendarView.tsx`](../../src/features/calendar-scheduling/components/calendar/CalendarView.tsx) — fixed by storing `onRangeChange` in a ref and deduplicating range values before calling upstream.

## Symptom: "Input resets while typing"

**Suspect first:** a `useEffect` that calls `form.reset(...)` or `setState(...)` with an unstable object, array, or function in its dependency array.

Also search for inline `values:` in `useForm`:

```tsx
values: entity ? { name: entity.name, /* ... */ } : undefined, // BAD — new object every render
```

RHF re-syncs whenever `values` reference changes, clearing in-progress edits.

**Where to look:** form sheets, dialogs, and edit panels. See rule §3 and §4.

**Canonical example:** [`ManualBookingSheet.tsx`](../../src/features/calendar-scheduling/components/ManualBookingSheet.tsx) — fixed by memoizing `staffOptions`, narrowing reset deps to primitives, and memoizing `editValues` for `values:`.

## Debugging checklist

For a given "component keeps re-rendering" or "field keeps resetting" report:

1. **Reproduce** — note which interaction triggers it (mount, keystroke, calendar navigation, dialog open)
2. **Find the effect** — grep the suspect component and its parents for `useEffect`
3. **List deps** — for each dep, ask: "is this recreated every render?"
4. **Trace the write path** — does the effect call `setState`, `form.reset`, `mutate`, or a callback that does those upstream?
5. **Check for feedback loop** — effect output → parent re-render → unstable dep → effect again

### Grep patterns

Run in the affected feature folder:

```bash
# Effects with suspicious deps (form, Options, inline objects/functions)
rg 'useEffect\(' -A5 src/features/<feature>/

# Inline RHF values objects
rg 'values:\s*\w+\s*\?\s*\{' src/features/<feature>/

# form.reset inside effects
rg 'form\.reset\(' -B3 -A3 src/features/<feature>/

# Inline arrow props (check if recipient has useEffect on that prop)
rg 'on\w+=\{\([^)]*\)\s*=>' src/features/<feature>/
```

For each hit, answer:

- Is this dependency recreated every render?
- Does the effect write back upstream (directly or via callback)?

## Resolution workflow

1. Reproduce the bug and capture the React error stack (if any)
2. Identify the effect (or RHF `values:` sync) that fires on every render
3. Classify each dependency: **primitive** (safe) vs **unstable reference** (object / array / inline function)
4. Apply the smallest fix per [rule 095](../rules/095-react-effect-hygiene.mdc):
   - **Callback in child effect** → ref in child (preferred) or `useCallback` in parent
   - **Reset effect with object deps** → narrow to primitive fields
   - **Inline `values:`** → memoize keyed on entity primitives, or `defaultValues` + guarded `reset()` on open
   - **Feedback loop** → break the cycle (ref, dedup guard, functional setState)
5. Verify: no "Maximum update depth" error; inputs hold value while typing; effect does not fire on unrelated renders

## When it's NOT a loop bug

- Inline `onClick` handlers not used as effect deps — safe
- `.filter()` / `.map()` results used only in JSX — safe
- Primitives in dependency arrays — safe
- TanStack Query refetches updating displayed data (different from form reset mid-edit)

## Related docs

- [095-react-effect-hygiene.mdc](../rules/095-react-effect-hygiene.mdc) — when to stabilize deps (authoritative fix reference)
- [react/SKILL.md](../react/SKILL.md) — React 19 component patterns
- [react-hook-form-zod/SKILL.md](../react-hook-form-zod/SKILL.md) — RHF + Zod wiring
