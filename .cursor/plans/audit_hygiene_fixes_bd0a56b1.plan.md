---
name: Audit Hygiene Fixes
overview: "Apply four targeted fixes from the react-effect-hygiene audit: narrow RescheduleDialog reset deps, add focus guard to BookingNotesSection, verify RecurringPatternEditor schedule stability (likely skip), and add safety comments on inline CalendarView callbacks."
todos:
  - id: fix-reschedule-dialog
    content: "Fix 1: RescheduleDialog — remove form from deps, add booking.id, early return guard"
    status: completed
  - id: verify-recurring-pattern
    content: "Fix 3: Confirm RecurringPatternEditor skip (pattern.schedule from useState snapshot) — no code change"
    status: completed
  - id: fix-booking-notes
    content: "Fix 2: BookingNotesSection — isFocusedRef guard + onFocus/onBlur sync"
    status: completed
  - id: fix-inline-comments
    content: "Fix 4: Add safety comments on 3 inline CalendarView callbacks"
    status: completed
  - id: verify-build
    content: Run pnpm exec tsc --noEmit and pnpm build
    status: completed
isProject: false
---

# Audit Hygiene Fixes

Targeted changes only — no sweep, no edits to baseline-fixed files per [095-react-effect-hygiene.mdc](.cursor/rules/095-react-effect-hygiene.mdc).

## Fix 1 — RescheduleDialog (apply)

**File:** `[src/features/booking-management/components/RescheduleDialog.tsx](src/features/booking-management/components/RescheduleDialog.tsx)`

**Current (lines 50–54):**

```tsx
useEffect(() => {
  if (open) {
    form.reset({ scheduledAt: toDatetimeLocalValue(booking.scheduledAt) });
  }
}, [open, booking.scheduledAt, form]);
```

**Change:**

```tsx
useEffect(() => {
  if (!open) return;
  form.reset({ scheduledAt: toDatetimeLocalValue(booking.scheduledAt) });
}, [open, booking.id, booking.scheduledAt]);
```

- Remove `form` from deps (`form.reset` is stable; whole form object is unnecessary)
- Add `booking.id` so switching bookings while dialog is open still resets correctly
- Early `if (!open) return` guard (already partially present via `if (open)` — flip to match rule pattern)

No other changes in this file.

---

## Fix 3 — RecurringPatternEditor (skip — trace result)

**Trace:**

```mermaid
flowchart LR
  query[useRecurringPatternsQuery] --> list[data array from TanStack Query]
  list --> click["setEditPattern(pattern) on Edit click"]
  click --> state[editPattern in useState]
  state --> editor["RecurringPatternEditor pattern prop"]
  editor --> memo["editValues useMemo deps pattern?.schedule"]
```

- `[RecurringAvailabilityTab.tsx:73](src/features/calendar-scheduling/components/recurring/RecurringAvailabilityTab.tsx)` stores `pattern` in `useState` at edit-click time — a **snapshot**, not re-derived from query on every parent render
- `[useRecurringPatternsQuery](src/features/calendar-scheduling/hooks/use-calendar-scheduling-queries.ts)` returns TanStack Query data; background refetches do **not** update `editPattern` while the sheet is open
- `pattern.schedule` reference is therefore stable for the duration of an edit session

**Action:** No code change. Document skip reason in implementation report.

---

## Fix 2 — BookingNotesSection (apply)

**File:** `[src/features/booking-management/components/BookingNotesSection.tsx](src/features/booking-management/components/BookingNotesSection.tsx)`

**Problem:** Sync effect overwrites in-progress typing when `data.internalNotes` changes from a background refetch — UX bug, not a dep-array bug. No memoization.

**UX decision (per user default):** Don't overwrite while focused; sync from prop on blur.

**Change:**

1. Add `useRef` import and `const isFocusedRef = useRef(false)`
2. Guard sync effect:

```tsx
useEffect(() => {
  if (isFocusedRef.current) return;
  setInternalNotes(data.internalNotes);
}, [data.internalNotes, data.id]);
```

1. Wire Textarea focus/blur:

```tsx
<Textarea
  value={internalNotes}
  onChange={(event) => setInternalNotes(event.target.value)}
  onFocus={() => {
    isFocusedRef.current = true;
  }}
  onBlur={() => {
    isFocusedRef.current = false;
    setInternalNotes(data.internalNotes);
  }}
  /* ...existing props */
/>
```

On blur, pull latest server value so refetch updates apply after the user finishes editing. No `useMemo`/`useCallback`.

---

## Fix 4 — Inline callback comments (apply, comments only)

Add above each inline callback prop (exact text from user spec):

```
// Inline callback is safe: consumer does not use this in a useEffect dep array.
// If that changes, stabilize with useCallback — see .cursor/rules/095-react-effect-hygiene.mdc
```

**Verdict**

**The two known bugs were symptomatic but not widespread — calendar-scheduling is largely clean after fixes. One booking-management file (RescheduleDialog) still matches the pre-fix reset-effect smell; remaining items are preventive or low severity.Locations:**

| File                                                                                                       | Line            | Prop |
| ---------------------------------------------------------------------------------------------------------- | --------------- | ---- |
| `[BlockedSlotsTab.tsx:104](src/features/calendar-scheduling/components/blocked-slots/BlockedSlotsTab.tsx)` | `onEventCreate` |      |
| `[BlockedSlotsTab.tsx:109](src/features/calendar-scheduling/components/blocked-slots/BlockedSlotsTab.tsx)` | `onEmptyAction` |      |
| `[ShopCalendarTab.tsx:96](src/features/calendar-scheduling/components/shop/ShopCalendarTab.tsx)`           | `onEmptyAction` |      |

No logic changes. Skip WorkingHoursTab and BlockedSlotsTab query arg per user instructions.

---

## Verification

```bash
pnpm exec tsc --noEmit
pnpm build
```

Manual smoke (post-implementation):

- RescheduleDialog: edit datetime, confirm no reset while typing
- BookingNotesSection: type notes, confirm refetch doesn't overwrite while focused; blur applies server value
- RecurringPatternEditor: no change expected
- No "Maximum update depth exceeded" in console

## Files touched (4)

1. `RescheduleDialog.tsx` — logic fix
2. `BookingNotesSection.tsx` — focus guard
3. `BlockedSlotsTab.tsx` — 2 comments
4. `ShopCalendarTab.tsx` — 1 comment

**Not touched:** `RecurringPatternEditor.tsx`, baseline-fixed files, WorkingHoursTab, BlockedSlotsTab query params
