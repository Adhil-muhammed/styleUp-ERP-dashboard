---
name: react-hook-form-zod
description: react-hook-form 7 + Zod 4 + zodResolver wiring and schema patterns for StyleUp ERP
---

# React Hook Form + Zod

> Verify against https://react-hook-form.com/ and https://zod.dev/ before relying on this for a new minor/major upgrade — last verified against **react-hook-form@7.80.0**, **zod@4.4.3**, **@hookform/resolvers@5.4.0** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `react-hook-form` | 7.80.0 |
| `zod` | 4.4.3 |
| `@hookform/resolvers` | 5.4.0 |

## Core wiring

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const BookingSchema = z.object({
  customerId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

type BookingFormValues = z.infer<typeof BookingSchema>;

export function BookingForm() {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(BookingSchema),
    defaultValues: { status: 'pending' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // mutation.mutate(values)
  });

  return (
    <form onSubmit={onSubmit}>
      {/* fields */}
      {form.formState.errors.customerId?.message && (
        <span>{form.formState.errors.customerId.message}</span>
      )}
    </form>
  );
}
```

## Schema colocation

Place in `src/features/<name>/types/`:

```
features/booking-management/types/booking.schema.ts
```

Export both schema and inferred type:

```ts
export const CreateBookingSchema = z.object({ /* ... */ });
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
```

**Never** hand-write a separate interface duplicating the schema shape.

## Zod 4 specifics (4.4.3)

- **Unified `error` param** for custom validation messages (replaces fragmented Zod 3 error APIs).
- **`z.infer<typeof Schema>`** — unchanged; primary type derivation method.
- **Deprecated:** `z.nativeEnum()` (prefer `z.enum()`), `z.promise()` (await before parse).
- **4.4.x `.catch()` vs `.default()`:** `.catch()` handles invalid values for **present** keys; `.default()` handles **absent** keys. Using `.catch([])` on optional/missing keys may not work as expected — use `.default([])` instead.
- **Refinements** live inside schemas (no separate `ZodEffects` wrapper).

Env validation example already in project: [`src/shared/config/env.ts`](../../src/shared/config/env.ts).

## Field errors

```tsx
// Direct access
form.formState.errors.fieldName?.message

// With shadcn Form (when added via CLI)
<FormField
  control={form.control}
  name="customerId"
  render={({ field }) => (
    <FormItem>
      <FormControl><Input {...field} /></FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Surface errors via inline field messages or toast — not `console.log`.

## Reset after success

```ts
onSuccess: () => {
  form.reset(defaultValues);
  queryClient.invalidateQueries({ queryKey: ['booking-management', 'list'] });
},
```

## Common mistakes

- Manual validation (`if (!email.includes('@'))`) alongside Zod schema
- Duplicate TS types separate from schema
- Using `.catch()` when `.default()` is needed (Zod 4.4+ missing-key behavior)
- Uncontrolled inputs without `register` or `Controller`/`FormField`
- Not resetting form after successful create/edit

## Breaking changes (Zod 3 → 4)

- Error customization API unified under `error`
- `.refine()` no longer narrows types via type predicates
- `superRefine` loses `ctx.path` (performance tradeoff)
- Stricter pipe/preprocess + catch interaction in 4.4.x

## Official docs

- https://react-hook-form.com/docs/useform
- https://github.com/react-hook-form/resolvers#zod
- https://zod.dev/
- https://zod.dev/v4/changelog
