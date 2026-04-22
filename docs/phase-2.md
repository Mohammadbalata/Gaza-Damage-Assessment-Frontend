# Phase 2 — Security hardening in authSlice + storage abstraction (Execution Record)

Execution date: 2026-04-22
Branch: `claude/tender-nash-bf1f44`
Audit reference: `docs/refactor-audit.md` §5 and §6 (Phase 2)

---

## Goals (from audit)

1. **Remove sensitive and ephemeral fields from Redux** — no `password`, `national_id`, `email`, `phoneNumber`, `whatsappNumber`, or duplicated `citizenInfo` in the global store.
2. **Centralise `localStorage` access** behind a single storage util — no more scattered `localStorage.getItem("token")` / `JSON.parse(localStorage.getItem("citizenInfo") \|\| "{}")` calls across the codebase.

## Result

- **Build**: `npm run build` (tsc + vite) — clean, 9.78s.
- **Grep**: `rg "localStorage\."` outside `src/shared/utils/storage.ts` returns only three unrelated call-sites (`hasSeenHomeTour`, `activeTourStep`, `hasSeenDashboardTour` — driver.js tour flags, out of scope for this phase).
- **Redux `auth` slice** now contains only: `user`, `isAuthenticated`, `loading`, `error`, `messageSuccess`, `verificationQuestion`, `trackingNumber`. No credentials, no duplicated storage.

---

## Files changed

### 1. `src/shared/utils/storage.ts` — extended

Retains the existing `StorageManager` class (prefixed, JSON-serialised — used by admin code) and adds a companion set of **unprefixed citizen-scope helpers** that match the keys already written by the app in the wild (so no user data migration is needed):

- `safeParse<T>(raw, fallback)` — internal helper, never throws on bad JSON
- **auth token**: `getToken`, `setToken`, `clearToken` (+ `getAuthToken` / `clearAuthToken` aliases kept for the Phase-1 axios interceptor)
- **citizen info**: `getCitizenInfo<T>()`, `setCitizenInfo(info)`, `clearCitizenInfo()`
- **citizen name** (transient verification cache): `getCitizenName<T>()`, `setCitizenName(name)`, `clearCitizenName()`
- **admin user**: `getUser<T>()`, `setUser(user)`, `clearUser()`
- **legacy key**: `clearCitizenUser()` for `citizen_user`
- **language**: `getLanguage`, `setLanguage`
- **tracking number**: `getTrackingNumber`, `setTrackingNumber`
- **bulk**: `clearCitizenSession()` — single call for logout (token + citizenInfo + citizenName + citizen_user)

Path: [src/shared/utils/storage.ts](src/shared/utils/storage.ts)

### 2. `src/app/store/slices/authSlice.ts` — rewritten

**Removed from `initialState`:**
- `national_id` (credential)
- `password` (credential — was in Redux, visible to Redux DevTools)
- `email`, `phoneNumber`, `whatsappNumber`, `firstName`, `fatherName`, `grandfatherName`, `familyName` (ephemeral sign-up form fields; react-hook-form already manages these on the pages themselves)
- `citizenInfo` (was duplicated across Redux + localStorage; now lives only in localStorage, accessed via `getCitizenInfo()`)

**Removed reducers + exports:**
- `setNationalId`, `setFirstName`, `setFatherName`, `setGrandfatherName`, `setFamilyName`, `setEmail`, `setPhoneNumber`, `setCitizenInfo`

**Kept reducers:** `setError`, `logout`, `setTrackingNumber`.

**Thunks:**
- `signIn` — resolved payload now omits `national_id`, `password`, `citizenInfo`. Token and citizen info are written via `setToken()` and `setCitizenInfo()` helpers. Language lookup uses `getLanguage()`.
- `signUp` — unchanged in API shape (payload-driven), but writes citizen info via the storage util.

**`logout` reducer** now calls `clearCitizenSession()` instead of four explicit `localStorage.removeItem` calls.

Path: [src/app/store/slices/authSlice.ts](src/app/store/slices/authSlice.ts)

### 3. `src/shared/types/store/IAuthState.ts` — clarified

Split into two logical sections:
- **Redux-backed fields** (user/isAuthenticated/loading/error/messageSuccess/verificationQuestion/trackingNumber)
- **signUp thunk input payload** fields (national_id, password, firstName, …) — still accepted as arguments but explicitly not persisted in the slice.

Comment block documents the new boundary.

Path: [src/shared/types/store/IAuthState.ts](src/shared/types/store/IAuthState.ts)

### 4. Consumer migrations — `state.auth.citizenInfo` → `getCitizenInfo()`

Three files previously read `citizenInfo` from Redux; they now read it directly from storage:

| File | Change |
|---|---|
| [src/features/location/pages/CurrentLocationMapPage.tsx](src/features/location/pages/CurrentLocationMapPage.tsx) | Replace `useAppSelector((s) => s.auth.citizenInfo)` with `getCitizenInfo()`. Replace `dispatch(setCitizenInfo(x))` with `setCitizenInfo(x)` from storage util. Collapsed duplicated Redux+localStorage read path. |
| [src/features/profile/pages/EditProfilePage.tsx](src/features/profile/pages/EditProfilePage.tsx) | Same pattern. Also switched `localStorage.getItem("token")` to `getToken()`. |
| [src/features/damage-assessment/components/building-forms/DamageAssessmentForm.tsx](src/features/damage-assessment/components/building-forms/DamageAssessmentForm.tsx) | `state.auth.citizenInfo` → `getCitizenInfo()`. `localStorage.getItem("token")` → `getToken()`. |

### 5. Auth-page token reads

| File | Change |
|---|---|
| [src/app/router/ProtectedRoutes.tsx](src/app/router/ProtectedRoutes.tsx) | `getToken()` |
| [src/features/auth/pages/SignUpPage.tsx](src/features/auth/pages/SignUpPage.tsx) | `getToken()` |
| [src/features/auth/pages/SignInPage.tsx](src/features/auth/pages/SignInPage.tsx) | `getToken()` |
| [src/features/auth/pages/SignInPasswordPage.tsx](src/features/auth/pages/SignInPasswordPage.tsx) | Removed redundant `localStorage.setItem("citizenInfo", …)` — the `signIn` thunk already persists it. |
| [src/features/auth/pages/PasswordDisplayPage.tsx](src/features/auth/pages/PasswordDisplayPage.tsx) | `citizenName` read → `getCitizenName()`. `localStorage.setItem("token", …)` → `setToken()`. |
| [src/features/auth/pages/VerificationQuestionsPage.tsx](src/features/auth/pages/VerificationQuestionsPage.tsx) | `localStorage.setItem("citizenName", …)` → `setCitizenName()`. |

### 6. Applications / dialogs / landing pages

Swapped `${localStorage.getItem("token")}` usage to `${getToken()}` and added the relevant import — one-line change per file. Same for the occasional `citizenInfo` read.

- [src/features/applications/pages/MyApplications.tsx](src/features/applications/pages/MyApplications.tsx) — 5× token + 1× citizenInfo
- [src/features/applications/pages/MyComplaintsPage.tsx](src/features/applications/pages/MyComplaintsPage.tsx) — 1× token
- [src/features/applications/pages/ComplaintDetailsPage.tsx](src/features/applications/pages/ComplaintDetailsPage.tsx) — 3× token
- [src/shared/components/dialogs/CommentsDialog.tsx](src/shared/components/dialogs/CommentsDialog.tsx) — 1× token
- [src/shared/components/dialogs/ComplaintDialog.tsx](src/shared/components/dialogs/ComplaintDialog.tsx) — 1× token
- [src/shared/components/Header.tsx](src/shared/components/Header.tsx) — 1× token
- [src/shared/components/DamageAssessmentStepper.tsx](src/shared/components/DamageAssessmentStepper.tsx) — 1× citizenInfo
- [src/features/system-pages/components/LandingPage/HeroSlider.tsx](src/features/system-pages/components/LandingPage/HeroSlider.tsx) — token + trackingNumber write
- [src/features/system-pages/components/LandingPage/DepartmentsSection.tsx](src/features/system-pages/components/LandingPage/DepartmentsSection.tsx) — 1× token
- [src/features/system-pages/components/LandingPage/DamageAssessmentCard.tsx](src/features/system-pages/components/LandingPage/DamageAssessmentCard.tsx) — 1× token
- [src/features/system-pages/pages/HomePage.tsx](src/features/system-pages/pages/HomePage.tsx) — 1× token
- [src/features/system-pages/components/LandingPage/Header.tsx](src/features/system-pages/components/LandingPage/Header.tsx) — token read, logout cluster collapsed into `clearCitizenSession() + clearUser()`, `state.auth.citizenInfo` read replaced with `getCitizenInfo()` (and `useAppSelector` import dropped as no longer needed)
- [src/features/damage-assessment/utils/pdfGenerator.ts](src/features/damage-assessment/utils/pdfGenerator.ts) — 2× citizenInfo reads

### 7. Providers

- [src/app/providers/LanguageContext.tsx](src/app/providers/LanguageContext.tsx) — `getLanguage()` / `setLanguageStorage()` used for read and write.
- [src/app/providers/AdminAuthContext.tsx](src/app/providers/AdminAuthContext.tsx) — user/token state initialisers, `persistAuth`, `refreshProfile`, `logout` all route through storage util. Imports aliased to `…Storage` to avoid collision with local `useState` setters.
- [src/app/App.tsx](src/app/App.tsx) — `getUser()` instead of `localStorage.getItem("user") + JSON.parse`.

---

## Verification

Automated:
1. `npm run build` (tsc strict + vite production) — passes in 9.78s.
2. `rg "localStorage\." src` outside `storage.ts` — only 3 driver.js tour flags remain (`hasSeenHomeTour`, `activeTourStep`, `hasSeenDashboardTour`) — out of scope.
3. `rg "state\.auth\.(password|national_id|email|phoneNumber|whatsappNumber|citizenInfo)" src` — 0 matches.
4. `rg "setEmail|setPhoneNumber|setFirstName|setFatherName|setGrandfatherName|setFamilyName|setNationalId" src --glob '!translations.ts'` — only local React hooks (`setEmailSent`) remain; all removed Redux actions are gone.

Manual smoke tests (browser) — **pending operator verification**:
- **Redux DevTools on sign-in**: inspect `auth` slice. Confirm no `password`, `national_id`, `email`, `phoneNumber`, `whatsappNumber`, `citizenInfo` fields appear on the state object — just `{ user, isAuthenticated, loading, error, messageSuccess, verificationQuestion, trackingNumber }`.
- Sign-in → dashboard flow end-to-end; citizen info still renders on dashboard, edit-profile, map pages, and PDF receipt.
- Sign-up (new account) flow — verification questions → password display → OTP → completeSignup. Confirm citizen info persisted afterward.
- Logout (both the citizen landing-page header and admin AdminAuthContext) — storage is cleared and user redirected appropriately.
- Edit profile save — updated profile reflected on next page load (persistence via `setCitizenInfo`).
- Language toggle persists across reloads.
- Current-location map save writes new `current_location` into `citizenInfo` storage.

---

## Notable behavioral changes

1. **Sign-in flow no longer writes credentials to Redux.** `data.password` in the resolved `signIn` payload is gone; pages that used `state.auth.password` (none found) would break. Confirmed clean.
2. **`citizenInfo` is now single-sourced in localStorage.** Components read it synchronously on each render via `getCitizenInfo()`. If a future flow needs reactive updates to citizenInfo across multiple components, introduce a context/store later — for now the read is cheap (localStorage + JSON.parse) and matches the existing behavior on reload.
3. **`SignInPasswordPage` no longer re-writes `citizenInfo` post-sign-in** — the thunk already wrote it. Dead code removed.
4. **`LandingPage/Header` logout** now clears `token + citizenInfo + citizenName + citizen_user + user` via `clearCitizenSession() + clearUser()` rather than four independent `removeItem` calls. Same keys, same result.

---

## Out of scope (still deferred)

- Migration to `StorageManager`'s `admin_` prefix for citizen keys — would require a migration shim to avoid logging users out. Future phase.
- Moving inline axios calls from components into `features/<feature>/api/` service modules → **Phase 4**.
- Decomposing the driver.js tour flags (`hasSeenHomeTour`, etc.) into the storage util — low value, their raw usage is locally confined.
- Replacing `useAppSelector((s) => s.auth.user)` with a typed `useAuth()` selector hook → **Phase 10**.

---

## Diff summary

| Area | Files changed |
|---|---:|
| Storage util extension | 1 |
| authSlice + IAuthState | 2 |
| Redux citizenInfo consumers | 3 |
| Auth pages (token / citizen name) | 6 |
| Applications + dialogs | 5 |
| Landing page + shared header | 5 |
| Providers + App shell | 3 |
| PDF util | 1 |
| **Total** | **26** |

---

# Addendum — `useCitizenInfo()` hook (Phase-2 follow-up)

Execution date: 2026-04-22 (same day, later)

The Phase 2 plan above left `citizenInfo` living in localStorage with components calling `getCitizenInfo()` directly on every render. That was a deliberate tradeoff at the time ("introduce a context/store later if cross-component reactivity becomes needed"). Two issues surfaced immediately and the decision was revisited:

1. Stale data — localStorage is only ever updated on sign-in/sign-up/edit-profile; users never saw server-side profile updates without signing out.
2. [CitizenDashboard.tsx](src/features/profile/pages/CitizenDashboard.tsx) and [EditProfilePage.tsx](src/features/profile/pages/EditProfilePage.tsx) both ad-hoc-fetched `/me` with their own `useEffect` + `useState` pair — duplicated request, uncoordinated cache.

The follow-up introduces a single shared hook that fetches `/me` once per session, caches via Redux, and write-through-syncs to localStorage so initial paint after reload is still instant.

## New files

### `src/app/store/slices/citizenSlice.ts`

Redux slice with two thunks and two sync reducers.

- `fetchCitizenInfo` — `GET /me`, returns `res.data.citizen`.
- `saveCitizenInfo(formData)` — `POST /me` with `Content-Type: multipart/form-data` (required because the shared axios client defaults to `application/json` — see **Avatar upload fix** below).
- `setCitizenInfo(info)` — sync reducer; used by `authSlice.signIn/signUp` to seed on login.
- `clearCitizenInfo()` — sync reducer; wipes Redux + localStorage.
- `addMatcher` on action type `"auth/logout"` — wipes citizen state when the existing `authSlice.logout` action fires. No circular import (matches by string).

Initial state hydrates from `getCitizenInfo()` so a hard reload paints immediately from the localStorage cache; the hook then kicks off a background refresh.

### `src/features/profile/hooks/useCitizenInfo.ts`

The single public surface consumers use:

```ts
const { citizenInfo, loading, error, loaded, refetch, save, setCitizenInfo } = useCitizenInfo();
```

- Auto-fires `fetchCitizenInfo` on first mount when `!loaded && !loading && getToken()` — guard prevents duplicate inflight requests across concurrent mounts.
- `save(formData)` wraps the `saveCitizenInfo` thunk with `.unwrap()` so callers get a thrown error for try/catch.
- `setCitizenInfo(info)` is a thin wrapper over the sync reducer — used by consumers that mutate citizen data locally (e.g. CurrentLocationMapPage after a successful location PUT).

## Modified files

- [src/shared/constants/ApiRoutes.ts](src/shared/constants/ApiRoutes.ts) — added `API.citizen.profile = "/me"`. Removed the two previously hardcoded `"/me"` strings.
- [src/app/store/store.ts](src/app/store/store.ts) — registered `citizen: citizenReducer`.
- [src/app/store/slices/authSlice.ts](src/app/store/slices/authSlice.ts) — `signIn` and `signUp` thunks now `dispatch(setCitizenInfoAction(...))` alongside the storage-util write, so the slice is hot right after login (no extra `/me` roundtrip needed on dashboard entry).

## Consumer migrations (9 files)

All of these dropped their direct `getCitizenInfo()` (and any ad-hoc `/me` fetch) in favour of `const { citizenInfo } = useCitizenInfo();`:

| File | What changed |
|---|---|
| [src/features/profile/pages/CitizenDashboard.tsx](src/features/profile/pages/CitizenDashboard.tsx) | Dropped local `useState` for citizenInfo + loading, dropped the inline `axiosClient.get("/me")` useEffect, dropped `axiosClient` import. |
| [src/features/profile/pages/EditProfilePage.tsx](src/features/profile/pages/EditProfilePage.tsx) | Submit handler now calls `await save(formData)`; the slice updates the cache — no more manual header/token/post/setCitizenInfo plumbing. Dropped `axiosClient`, `getToken`, `setCitizenInfo` imports. |
| [src/features/profile/pages/ServiceCenterPage.tsx](src/features/profile/pages/ServiceCenterPage.tsx) | Replaced `useAppSelector((s) => s.auth.citizenInfo)` with the hook. |
| [src/features/system-pages/components/LandingPage/Header.tsx](src/features/system-pages/components/LandingPage/Header.tsx) | Hook for read; also defensive-chained `citizenName`. |
| [src/features/damage-assessment/components/building-forms/DamageAssessmentForm.tsx](src/features/damage-assessment/components/building-forms/DamageAssessmentForm.tsx) | Hook for read; `isCurrentLocation` init guarded with `!!citizenInfo?.current_location`. |
| [src/features/location/pages/CurrentLocationMapPage.tsx](src/features/location/pages/CurrentLocationMapPage.tsx) | Hook for read *and* for the write-back after a successful location PUT — `setCitizenInfo(updated)` now updates the slice so every other consumer re-renders. |
| [src/features/applications/pages/MyApplications.tsx](src/features/applications/pages/MyApplications.tsx) | Hook for read. Also passes `citizenInfo` into the two PDF generator functions. |
| [src/shared/components/DamageAssessmentStepper.tsx](src/shared/components/DamageAssessmentStepper.tsx) | Hook read; dependency in `useMemo` now reactive to citizenInfo changes. |
| [src/features/damage-assessment/utils/pdfGenerator.ts](src/features/damage-assessment/utils/pdfGenerator.ts) | Pure util; now accepts `citizenInfo` as an optional argument (default `null`). Callers in MyApplications pass it down from the hook. |

## Defensive fixes landed alongside

- [CitizenDashboard.tsx:264](src/features/profile/pages/CitizenDashboard.tsx) and [ServiceCenterPage.tsx](src/features/profile/pages/ServiceCenterPage.tsx) — bare `{citizenInfo.national_id}` in JSX replaced with `{citizenInfo?.national_id}` so the page doesn't crash if the cache is temporarily empty.
- [CitizenDashboard.tsx line 103](src/features/profile/pages/CitizenDashboard.tsx) — `citizenName` ternary now guards on `citizenInfo?.full_name` instead of truthiness of the whole object.

## Avatar upload fix

Symptom: after the migration, avatar upload on edit-profile returned a 422 with `"The avatar field must be an image."`.

Root cause: the shared axios client ([src/shared/api/api.ts](src/shared/api/api.ts)) defaults to `Content-Type: application/json`. When `axiosClient.post(url, formData)` runs without a per-request header override, axios keeps the default — so the multipart body goes out *without* a boundary and Laravel can't parse the file.

Fix: [src/app/store/slices/citizenSlice.ts](src/app/store/slices/citizenSlice.ts) — `saveCitizenInfo` passes `{ headers: { "Content-Type": "multipart/form-data" } }` explicitly. Axios 1.x auto-appends the generated boundary at send time when it sees this header + a FormData payload. Rejection payload also widened to include `err.response.data.errors` so future 422 field errors surface instead of collapsing to a generic message.

## Verification

1. `npm run build` — clean, 8.28s (last run).
2. Grep: `rg "getCitizenInfo\\(" src` → 0 matches in components/pages (only `storage.ts` and `citizenSlice.ts` remain, which is correct — they're the plumbing).
3. Grep: `rg '"/me"|\\'/me\\'' src` → 0 matches. Endpoint lives only in `ApiRoutes.ts`.
4. Manual smoke tests — **pending operator verification**:
   - Sign in → dashboard: one `GET /me` in the Network tab, reused by every component that mounts.
   - Edit profile → save (with and without an avatar change): success snackbar; dashboard/header reflect updates immediately.
   - Avatar upload specifically: image renders in the new avatar preview; backend persists the file (re-login shows it from `/me`).
   - Hard reload while logged in: page paints from cache, then a single `GET /me` refreshes the slice.
   - Logout → re-login: fresh fetch; no stale cache bleed-through.
   - Redux DevTools: `citizen` slice transitions `pending → fulfilled` on first hook mount; the `auth/logout` action also wipes `citizen` state via the matcher.

## Behavioral changes relative to the main Phase 2 section above

- Section 4 of the main document ("Consumer migrations — `state.auth.citizenInfo` → `getCitizenInfo()`") is superseded: those same consumers now use `useCitizenInfo()`, not `getCitizenInfo()`.
- Section 4 of "Notable behavioral changes" (`citizenInfo` single-sourced in localStorage) is superseded: it's now single-sourced in the `citizen` Redux slice, with localStorage acting as a write-through cache for initial hydration only.
- The storage util's `getCitizenInfo` / `setCitizenInfo` / `clearCitizenInfo` helpers stay — they're now internal plumbing used only by the slice.

## Diff summary (addendum)

| Area | Files |
|---|---:|
| New slice | 1 |
| New hook | 1 |
| store.ts + ApiRoutes.ts + authSlice.ts | 3 |
| Consumers migrated | 9 |
| Defensive `?.` fixes | 2 (subset of the 9) |
| Avatar upload fix (in citizenSlice) | — |
| **New + modified total** | **14** |
