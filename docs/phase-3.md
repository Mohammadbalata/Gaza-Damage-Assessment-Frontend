# Phase 3 — Shared hooks: adopt `useApi`, add `useDialogState`, `useFormSubmission` (Execution Record)

Execution date: 2026-04-23
Branch: `feature/refactor-phase-2`
Audit reference: `docs/refactor-audit.md` §3 (patterns 1, 4, 6) and §6 (Phase 3)

---

## Goals (from audit)

1. **Add a reusable dialog-state primitive** — replace the repeated
   `dialogOpen` + `selectedItem` + open/close handlers found at 10+ sites
   (audit §3, pattern 4).
2. **Add a reusable form-submission primitive** — wrap the existing
   `usePost` with `useNotification` so the
   `submit → loading → success/error toast` choreography duplicated across
   ~20 forms (audit §3, pattern 6) collapses to a single hook call.
3. **Document the existing `useApi`** — adoption is near zero (audit §4);
   the lightweight JSDoc that ships today doesn't communicate the contract
   well enough for consumers to reach for it. Expand it.

> **Out of scope (per audit):** No consumer migration. Phases 5–9 will
> migrate the call-sites once the primitives exist.

## Result

- **Build**: `npm run build` (tsc + vite) — clean, 18.60s.
- **New surface area**: 2 new hooks + expanded JSDoc on the existing
  `useApi` family. No consumer files touched.
- **Risk**: ~0. Pure additions under `src/shared/hooks/`; no merge surface
  with Dev A's Phase 2 work.

---

## Files changed

### 1. `src/shared/hooks/useDialogState.ts` — new

Generic dialog-state hook. Returns `{ isOpen, data, open, close }`:

- `open(item?)` — sets `isOpen` to `true`. If an `item` is supplied it is
  stored on `data` for the dialog body to read.
- `close()` — sets `isOpen` to `false` **and** clears `data` so the dialog
  doesn't flash stale content if it re-opens.
- Generic over the data type (`useDialogState<Application>()`).
- 35 lines, two `useState`s, no other dependencies.

Replaces the pair of `useState(false)` + `useState(null)` at the audit-listed
sites: `ApplicationCard`, `MyApplications`, `CommentsDialog`,
`OtpDialog`, `ComplaintDetailsPage`, etc.

### 2. `src/shared/hooks/useFormSubmission.ts` — new

Wraps `usePost` (from `useApi`) with `useNotification`:

```ts
const { submit, loading, error, reset } = useFormSubmission<TPayload, TResponse>(
  url,
  { successMessage, errorMessage, onSuccess, onError },
);
await submit(payload);
```

- `successMessage?` — toast fired via `showSuccess` on 2xx.
- `errorMessage?` — toast fired via `showError` on failure. If omitted,
  the error string returned by `ApiErrorHandler` (already exposed as
  `useApi.error`) is shown instead — so callers get a sensible default
  without wiring up two strings.
- `onSuccess` / `onError` — pass-through callbacks, fired **after** the
  toast.
- Internally builds `usePost`'s `onSuccess` / `onError` once, so the toast
  layer is invisible to the caller.
- `submit` is a stable `useCallback` returning `Promise<TResponse | undefined>`
  (matches the `useApi.execute` contract — `undefined` on failure).

Returns the `loading` / `error` / `reset` from the underlying `usePost` so
the form can disable buttons or show inline errors without subscribing
separately.

### 3. `src/shared/hooks/api/useApi.ts` — JSDoc expanded

No behavior change. Each export now has a docblock that:

- States the contract (what runs, what is returned, what errors look like).
- Includes a typed `@example` so a consumer can copy-paste.
- Points the reader at the verb-specific helpers (`useGet`, `usePost`, …)
  for the common case so they don't reach straight for the generic
  `useApi`.

Unchanged: function signatures, parameter names, runtime behavior.

---

## Verification

Automated:

1. `npm run build` — passes (tsc strict + vite production), 18.60s.
2. `rg "useDialogState\|useFormSubmission" src --files-with-matches` —
   only the two new files show up. Confirms no consumer migration leaked
   into this phase.
3. No files outside `src/shared/hooks/` were modified.

Manual smoke tests — **not applicable this phase**:

- No consumer migration → no runtime behavior changed → no existing
  flows can have regressed. The new hooks have no call-sites yet.
- Type-level verification is satisfied by `tsc` in step 1.

---

## API surface added

```ts
// src/shared/hooks/useDialogState.ts
export interface UseDialogStateReturn<T> {
  isOpen: boolean;
  data: T | null;
  open: (item?: T) => void;
  close: () => void;
}
export function useDialogState<T = unknown>(): UseDialogStateReturn<T>;

// src/shared/hooks/useFormSubmission.ts
export interface UseFormSubmissionOptions<TResponse> {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: string) => void;
}
export interface UseFormSubmissionReturn<TPayload, TResponse> {
  submit: (payload: TPayload) => Promise<TResponse | undefined>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}
export function useFormSubmission<TPayload = unknown, TResponse = unknown>(
  url: string,
  options?: UseFormSubmissionOptions<TResponse>,
): UseFormSubmissionReturn<TPayload, TResponse>;
```

---

## Out of scope (deferred)

- **Consumer migration.** Per audit §6 Phase 3, migration happens in the
  feature-decomposition phases:
  - Pattern 4 (`useDialogState`) consumers — Phases 7 (`MyApplications`,
    `ApplicationCard`), 9 (`CommentsDialog`, `OtpDialog`).
  - Pattern 6 (`useFormSubmission`) consumers — Phases 8 (auth pages), 5
    (location map pages), 9 (dialogs), 4 (general feature normalisation).
- **`useApi` adoption sweep.** Same — handled per-feature in Phases 5–9.
- **A `useDialogState`-with-multi-stage variant** (open/confirm/loading
  states for destructive dialogs). Not requested by the audit; will be
  added later only if a consumer needs it.

---

## Diff summary

| Area | Files |
|---|---:|
| New shared hooks | 2 |
| JSDoc expansion on existing hook | 1 |
| Consumer files touched | 0 |
| **Total** | **3** |
