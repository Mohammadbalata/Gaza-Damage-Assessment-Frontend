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
