# Phase 1 — Consolidate API layer (Execution Record)

Execution date: 2026-04-22
Branch: `claude/tender-nash-bf1f44`
Plan: `.claude/plans/please-read-the-file-scalable-pumpkin.md`
Audit reference: `docs/refactor-audit.md` §4 and §6 (Phase 1)

---

## Goal

Collapse three competing axios clients into one, so every authenticated request carries `Authorization: Bearer …`, and introduce a working 401 handler that clears the token and redirects to sign-in.

## Result

- **Build**: `npm run build` (tsc + vite) — clean, 9.06s.
- **Grep**: `rg "shared/api/(baseUrl|client)"` under `src/` → 0 matches.
- **Single client**: `src/shared/api/api.ts` is now the sole axios instance.

---

## Files changed

### Rewritten

- **`src/shared/api/api.ts`**
  - Exports: `api` (named), `axiosClient` (alias), `default`, `extractData<T>()`.
  - Request interceptor reads token via `getAuthToken()` (indirection for Phase 2).
  - Base URL now respects `import.meta.env.VITE_API_URL`, falling back to prod.
  - Restored `extractData<T>()` from the old `client.ts` (handles nested / flat / raw envelopes).
  - **New 401 handler**: if a token existed (`getAuthToken() !== null`) and we're not already on `/sign-in`, clear the token and `window.location.assign("/sign-in")`. Loop-guard prevents re-entry; no-token-guard prevents spurious redirects on login-attempt 401s.
  - Retains 400-response debug logging (table + structured object).

### Added helpers

- **`src/shared/utils/storage.ts`** — appended:
  ```ts
  export const getAuthToken = (): string | null => localStorage.getItem("token");
  export const clearAuthToken = (): void => localStorage.removeItem("token");
  ```
  These reference the raw `"token"` key (no `admin_` prefix) to match the current citizen storage scheme. Phase 2 will consolidate all `localStorage` access and decide on prefixing.

### Deleted

- `src/shared/api/client.ts` (0 consumers; was a near-duplicate of `api.ts`).
- `src/shared/api/baseUrl.ts` (bare instance, no interceptors, no `Authorization` header — the root cause of silently-unauthenticated requests).

### Import sweep (path-only; identifier `axiosClient` unchanged)

16 imports rewritten from `shared/api/baseUrl` → `shared/api/api`:

| # | File |
|---|---|
| 1 | `src/app/store/slices/authSlice.ts` |
| 2 | `src/features/applications/components/ApplicationCard.tsx` |
| 3 | `src/features/applications/pages/ComplaintDetailsPage.tsx` |
| 4 | `src/features/applications/pages/MyApplications.tsx` |
| 5 | `src/features/applications/pages/MyComplaintsPage.tsx` |
| 6 | `src/features/auth/pages/PasswordDisplayPage.tsx` |
| 7 | `src/features/auth/pages/VerificationQuestionsPage.tsx` |
| 8 | `src/features/damage-assessment/components/building-forms/DamageAssessmentForm.tsx` |
| 9 | `src/features/location/pages/PreviousLocationMapPage.tsx` |
| 10 | `src/features/profile/pages/EditProfilePage.tsx` |
| 11 | `src/features/system-pages/components/LandingPage/ContactSection.tsx` |
| 12 | `src/features/system-pages/components/LandingPage/HeroSlider.tsx` |
| 13 | `src/features/system-pages/pages/TrackStatusPage.tsx` |
| 14 | `src/shared/components/dialogs/CommentsDialog.tsx` |
| 15 | `src/shared/components/dialogs/ComplaintDialog.tsx` |
| 16 | *(cleanup)* stale commented `baseUrl` import removed from `src/features/location/pages/CurrentLocationMapPage.tsx` |

Existing `api` consumers — unchanged (already imported from `shared/api/api`):
- `src/shared/hooks/api/useApi.ts`
- `src/app/providers/AdminAuthContext.tsx`
- `src/features/location/pages/CurrentLocationMapPage.tsx`
- `src/shared/admin/DebounceSearchField.tsx`

---

## Verification

Automated:
1. `npm run build` — passes (tsc strict + vite production build).
2. `rg "shared/api/(baseUrl|client)" src` — 0 matches.
3. `rg "api/baseUrl|api/client" src` — 0 matches.

Manual smoke tests (browser) — **pending operator verification**:
- Sign-in flow end-to-end (auth slice → new client).
- Network tab: every authenticated request on previously-`axiosClient` pages (`MyApplications`, `TrackStatusPage`, `PasswordDisplayPage`, `EditProfilePage`, map pages) carries `Authorization: Bearer …`. Previously these requests were going out **without** the token.
- 401 expiry: tamper with stored token in DevTools, trigger an authenticated request → app clears token and redirects to `/sign-in` without a redirect loop.
- Damage-assessment submit, comments dialog, complaint dialog still function.

---

## Notable behavioral changes

1. **Requests that previously went out unauthenticated now carry the bearer token.** If any backend endpoint was relying on the absence of `Authorization` (e.g. serving public data differently when authenticated), that will change. None observed in the audit, but worth watching during smoke tests.
2. **Expired sessions now force redirect to `/sign-in`** instead of silently leaving the app in a broken state. Users on a page with a just-expired token will be bounced out on their next authenticated call.
3. **`VITE_API_URL` env override** is now honored by the unified client (previously only `client.ts` respected it; `baseUrl.ts` hard-coded prod).

---

## Out of scope (deferred)

- Full `localStorage` consolidation + `admin_` prefix migration → **Phase 2**.
- Removing `password` / `national_id` / PII from `authSlice` → **Phase 2**.
- Moving inline axios calls from components into `features/<feature>/api/` services → **Phase 4**.
- Token refresh / silent re-auth → not planned.

---

## Follow-ups for Phase 2

- Audit the ~15 direct `localStorage.getItem("token")` call sites and route them through `getAuthToken()` (or the Phase-2 replacement).
- Decide whether citizen keys (`token`, `citizenInfo`, `user`, `citizen_user`) should migrate under `StorageManager`'s `admin_` prefix or whether the prefix should be dropped/renamed.
- Strip sensitive fields from the `auth` Redux slice and verify Redux DevTools no longer exposes `password` / `national_id`.
