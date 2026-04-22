# Frontend Refactor — Phase 0 Audit

Audit date: 2026-04-20
Scope: `src/` of the Gaza Damage Assessment Frontend
Target architecture: feature-based + layered (per `CLAUDE.md`)

---

## 1. Structural Analysis

### Current tree (3 levels, `src/`)

```
src/
├── app/                            ✅ correct
│   ├── providers/                  AdminAuthContext, LanguageContext, UserAuthContext (unused dup)
│   ├── router/                     Routes, admin.routes, ProtectedRoutes, PermissionGuard, AppRoutes
│   ├── store/slices/               auth, damage, documents, family, location, mixedUsage, personal
│   └── theme/muiTheme.ts
├── features/                       ⚠ feature folders exist, internals incomplete
│   ├── applications/   { components, pages, utils }           (no api/, no hooks/)
│   ├── auth/           { components, pages, utils }           (no api/, no hooks/)
│   ├── central-database/ { components/forms, pages }          (no api/, no hooks/)
│   ├── damage-assessment/ { components/building-forms, MixedUsageComponent, ImagesInput, pages, utils }
│   ├── location/       { components, pages, utils }           (no api/, no hooks/)
│   ├── profile/        { pages }                              (no components/api/hooks/)
│   ├── settings/       { pages }
│   └── system-pages/   { components/LandingPage, pages }
├── shared/
│   ├── admin/          AdminSearchFilters, DashboardCard, DebounceSearchField, PaginationTable
│   ├── api/            api.ts, baseUrl.ts, client.ts  ← 3 clients, only 2 have interceptors
│   ├── components/     dialogs/ + misc shared UI (ImageGallery is 365 lines)
│   ├── hooks/api/useApi.ts (underused), redux.ts, useNotifications.ts
│   ├── ui/             FormInput (260), LanguageToggle, PhoneNumberInput
│   ├── utils/, constants/, types/, assets/
└── main.tsx, App.tsx
```

### Top-level folder purposes
- `app/` — app shell, providers, router, Redux store, theme. Correct.
- `features/` — 8 feature folders, but each is missing `api/` and `hooks/` subdirectories.
- `shared/` — cross-feature UI, hooks, utils, API clients. Mostly correct, but `api/` has three competing clients.

### Deviations from target architecture
- Every feature lacks `api/` and `hooks/` subfolders → API calls and state logic live in page components.
- No feature `index.ts` barrel files → cross-feature imports reach into deep paths.
- Three axios clients (`api.ts`, `client.ts`, `baseUrl.ts`); `baseUrl.ts` (`axiosClient`) is the most-used and has **no auth interceptor**.
- `UserAuthContext` (49 lines) is defined but never consumed — dead provider.

---

## 2. Component Inventory

### Refactor targets (>200 lines, ordered by risk)

| Path | Lines | Responsibilities mixed | Coupling / duplication |
|---|---:|---|---|
| `src/features/location/pages/CurrentLocationMapPage.tsx` | 1126 | UI, 20+ useState, direct axios, form submit, location chain sync | Near-duplicate of PreviousLocationMapPage |
| `src/features/location/pages/PreviousLocationMapPage.tsx` | 1015 | Same as Current | Shares ~80% logic with Current |
| `src/features/applications/pages/MyApplications.tsx` | 874 | 11 useState, axios in useEffect, dialog orchestration, filtering | Reads `localStorage("token")` directly |
| `src/features/damage-assessment/components/building-forms/DamageAssessmentForm.tsx` | 779 | Wrapper + 6 sub-forms conditional render + submit + Redux dispatch + image upload | |
| `.../building-forms/Tower.tsx` | 767 | 30+ `watch()`, 6 useEffect, validation, images | Duplicates logic of 5 other building forms |
| `.../building-forms/ResidentialBuilding.tsx` | 744 | same pattern | same |
| `.../building-forms/IndependentBuilding.tsx` | 733 | same pattern | same |
| `src/features/auth/pages/PasswordDisplayPage.tsx` | 732 | Display + timer + direct axios + 15+ useState | |
| `src/features/applications/components/ApplicationCard.tsx` | 704 | Card UI + axios for governorate names + menu + dialogs + comments state | Receives 5 callbacks (prop-drill) |
| `.../building-forms/AdditionalBuildings.tsx` | 655 | same building-form pattern | same |
| `.../building-forms/ApartmentInsideBuilding.tsx` | 617 | same | same |
| `src/features/damage-assessment/utils/pdfGenerator.ts` | 591 | Pure util (acceptable) | |
| `src/features/profile/pages/CitizenDashboard.tsx` | 529 | Page + driver.js tour + dispatch + nav | |
| `src/features/system-pages/pages/TrackStatusPage.tsx` | 533 | fetch+loading+error + form + status display | Pattern 1 duplication |
| `src/features/profile/pages/EditProfilePage.tsx` | 506 | Form + axios + image + 8 useState | |
| `.../building-forms/CampHousing.tsx` | 498 | same building-form pattern | same |
| `src/features/system-pages/components/LandingPage/Header.tsx` | 427 | Nav + menu + notifications API | |
| `src/features/auth/pages/ResetPasswordForm.tsx` | 425 | Form + validation + axios | |
| `src/shared/components/dialogs/CommentsDialog.tsx` | 390 | Dialog + fetch + submit comments | |
| `src/shared/components/dialogs/OtpDialog.tsx` | 376 | OTP + timer + resend API | |
| `src/features/applications/pages/ComplaintDetailsPage.tsx` | 370 | Page + axios + prop drilling | |
| `src/shared/components/ImageGallery.tsx` | 365 | Carousel + display | |
| `src/features/auth/pages/ChangePasswordPage.tsx` | 360 | Form + axios | |
| `src/features/system-pages/components/LandingPage/HeroSlider.tsx` | 347 | Carousel + banners API | |

**Summary:** 13 files >500 lines; 3 files >1000 lines.

### Prop-drilling hotspots
- `ApplicationCard` receives 5 callbacks (`onAction`, `onDownloadPdf`, `onAddComplaint`, `onCloseComplaint`, `onFetchComments`).
- `MapContainer` / `ArcGISMapContainer` receive 10+ props from the two map pages.
- Building forms receive `register`, `errors`, `watch`, `setValue`, `getValues`, `control` — react-hook-form's `FormProvider` would eliminate this.

### Duplication candidates (≥60% similar)
- `CurrentLocationMapPage` ↔ `PreviousLocationMapPage` (two 1000-line pages, ~80% shared logic).
- 6 building forms (`IndependentBuilding`, `ResidentialBuilding`, `Tower`, `ApartmentInsideBuilding`, `CampHousing`, `AdditionalBuildings`) — all follow the same watch/useEffect/validate/images skeleton.
- `CitizenForgotPasswordPage` and `CitizenResetPasswordPage` (18 lines each, thin wrappers) — acceptable.

---

## 3. Logic Duplication Map

| # | Pattern | Files | Target abstraction |
|---|---|---|---|
| 1 | `useState(data/loading/error)` + `useEffect` + axios | 14 files: `TrackStatusPage`, `VerificationQuestionsPage`, `PasswordDisplayPage`, `ChangePasswordPage`, `CurrentLocationMapPage`, `PreviousLocationMapPage`, `MyApplications`, `MyComplaintsPage`, `EditProfilePage`, `DamageAssessmentForm`, `HeroSlider`, `ContactSection`, `CommentsDialog`, `OtpDialog` | Adopt existing `src/shared/hooks/api/useApi.ts` (`useGet`/`usePost`) |
| 2 | `watch()` + conditional show flags + `useEffect` setValue sync | 6 building forms — ~60 duplicated blocks | New `features/damage-assessment/hooks/useBuildingFormLogic.ts` |
| 3 | Governorate → Municipality → Neighborhood → Landmark chained fetch | `CurrentLocationMapPage` (L69-200), `PreviousLocationMapPage` (L36-144) | New `features/location/hooks/useLocationChainedSelection.ts` |
| 4 | `dialogOpen` + `selectedItem` + open/close handlers | `ApplicationCard`, `MyApplications`, comments/complaint/OTP dialogs (10+ sites) | New `shared/hooks/useDialogState.ts` |
| 5 | `localStorage.getItem("token")` read directly | `MyApplications`, `SignInPage`, `SignUpPage`, `CitizenDashboard`, `CurrentLocationMapPage`, others (~15 sites) | Centralize via api interceptor; keep reads only in `shared/utils/storage.ts` |
| 6 | Form submit → loading → success/error toast | ~20 forms | New `shared/hooks/useFormSubmission.ts` wrapping `usePost` + `useNotifications` |
| 7 | Arabic-numeral normalization + phone formatting | `FormInput.tsx` (L48-62), `formatPhoneNumber.ts` | Consolidate in `shared/utils/` |

---

## 4. API Layer Assessment

**Three clients, inconsistent interceptors:**

| Client | File | Interceptor? | Used by |
|---|---|---|---|
| `api` | `src/shared/api/api.ts` (95 L) | ✅ request+response | a few files |
| `api` (default) + `extractData` | `src/shared/api/client.ts` (96 L) | ✅ duplicate of api.ts | `AdminAuthContext` only |
| **`axiosClient`** | `src/shared/api/baseUrl.ts` (5 L) | ❌ **NONE** | 14+ feature files + all Redux thunks |

**Critical finding:** `axiosClient` — the most widely used client — has no `Authorization` header attached. Endpoints relying on bearer auth will silently fail from this client unless the token is manually passed per call.

**Inline API calls in components** (14 sites — all should move to `features/<feature>/api/`):
- `applications/ApplicationCard.tsx` L49, L100-130 (governorate/municipality fetch from a card)
- `applications/MyApplications.tsx` L96-150
- `applications/ComplaintDetailsPage.tsx`
- `auth/pages/VerificationQuestionsPage.tsx`
- `auth/pages/PasswordDisplayPage.tsx`
- `auth/pages/ChangePasswordPage.tsx`
- `location/pages/CurrentLocationMapPage.tsx` L69-200
- `location/pages/PreviousLocationMapPage.tsx` L36-144
- `profile/pages/EditProfilePage.tsx`
- `damage-assessment/.../DamageAssessmentForm.tsx`
- `system-pages/pages/TrackStatusPage.tsx`
- `system-pages/components/LandingPage/HeroSlider.tsx`
- `system-pages/components/LandingPage/ContactSection.tsx`
- `shared/components/dialogs/CommentsDialog.tsx`, `OtpDialog.tsx`

**Central API client:** Exists (`api.ts`), but adoption is partial. `client.ts` is a near-duplicate. `baseUrl.ts` is a bare `axios.create` with no interceptors.

**Auth token handling:** Read via `localStorage.getItem("token")` in ~15 sites. Interceptors in `api.ts` / `client.ts` do the same. `shared/utils/storage.ts` exists but is underused.

**Good existing asset:** `src/shared/hooks/api/useApi.ts` provides a clean generic (`useGet`/`usePost`/`usePut`/`usePatch`/`useDelete`). Adoption is near zero — reuse this rather than writing a new one.

---

## 5. State Management Assessment

### Stores in use
- **Redux Toolkit** — 7 slices in `src/app/store/slices/`
- **Context** — `LanguageContext` (global ✅), `AdminAuthContext` (admin-scoped ✅), `UserAuthContext` (dead code)
- **localStorage** — `token`, `citizenInfo`, `user`, `citizen_user` (inconsistent keys)

### Misplaced state
- `authSlice.ts` L18-19: **`national_id` and `password` in Redux** — security issue (Redux DevTools / serialization). Must move out.
- `authSlice.ts` L30-33: `email`, `phoneNumber`, `whatsappNumber`, `citizenInfo` — ephemeral sign-up form fields polluting global store. Should be local form state.
- `citizenInfo` is duplicated in Redux and localStorage (initialState reads from localStorage).
- `damageSlice.ts` (368 L) — correct place (multi-step form state), but flat structure; could split per building type.
- `UserAuthContext` — 49 L, 0 consumers. Delete.

### Context scope assessment
- `LanguageContext` — appropriate (global).
- `AdminAuthContext` — appropriate (admin routes). Contains login logic + API call; should extract to service/thunk.
- No context needed for citizen auth; Redux + localStorage + a `useAuth()` selector hook is sufficient.

---

## 6. Phased Plan (10 phases)

Phases are ordered so earlier ones unblock later ones. Each phase's **Split** section describes how Dev A and Dev B work in parallel without merge conflicts. Effort: S ≈ ≤1 day, M ≈ 2–4 days, L ≈ 1 week.

### Phase 1 — Consolidate API layer
- **Goal:** One axios client, one interceptor, `Authorization` attached everywhere.
- **Scope:** Delete `src/shared/api/baseUrl.ts` and `src/shared/api/client.ts`; keep `src/shared/api/api.ts` as the single source. Rename its export to `axiosClient` for drop-in compatibility, or add a re-export shim. Update all 14 feature files + Redux thunks (`authSlice.ts`, etc.) to import from the single client. Add response-side 401 handler that clears token + redirects.
- **Dependencies:** None — must land first.
- **Effort:** M
- **Split:**
  - **Dev A** — rewrite `shared/api/api.ts` (consolidated interceptors, error handler, `extractData` helper); delete `client.ts`/`baseUrl.ts`; ship a compatibility re-export.
  - **Dev B** — after Dev A merges, sweep imports across the 14 feature files + slices. Mechanical change, single PR.

### Phase 2 — Security hardening in authSlice + storage abstraction
- **Goal:** Remove sensitive fields from Redux; centralize localStorage access.
- **Scope:** `src/app/store/slices/authSlice.ts` — remove `password`, `national_id`, `email`, `phoneNumber`, `whatsappNumber`, duplicated `citizenInfo`. Flesh out `src/shared/utils/storage.ts` with `getToken/setToken/clearToken/getCitizenInfo`. Convert auth-page form fields to local `useState` / react-hook-form. Update all `localStorage.getItem` reads (~15 sites) to use the storage util.
- **Dependencies:** Phase 1.
- **Effort:** M
- **Split:** Single dev (tight coupling between slice shape and consumers). Assign to **Dev A**. Dev B runs Phase 3 in parallel.

### Phase 3 — Shared hooks: adopt `useApi`, add `useDialogState`, `useFormSubmission`
- **Goal:** Reusable primitives for the three most-duplicated patterns.
- **Scope:** New `src/shared/hooks/useDialogState.ts`, `src/shared/hooks/useFormSubmission.ts` (wraps `usePost` + `useNotifications`). Documentation comments on `useApi.ts`. No consumer migration yet — that happens in Phases 5–9.
- **Dependencies:** Phase 1.
- **Effort:** S
- **Split:** **Dev B** owns this phase while Dev A is on Phase 2. Pure additions under `shared/hooks/`, no merge risk.

### Phase 4 — Normalize feature folder structure
- **Goal:** Every feature has `api/`, `hooks/`, `types/`, `index.ts`. Move inline API calls into feature `api/` services. No behavior changes.
- **Scope:** Add subfolders + barrels in all 8 features. Extract axios calls from components into `features/<feature>/api/*.ts` services that consume the shared client. Move types/interfaces scattered in pages into `features/<feature>/types/`.
- **Dependencies:** Phase 1 (single client), Phase 3 (hooks available).
- **Effort:** L
- **Split (no overlap):**
  - **Dev A** — `auth`, `profile`, `settings`, `system-pages`.
  - **Dev B** — `applications`, `central-database`, `damage-assessment`, `location`.

### Phase 5 — Decompose location map pages
- **Goal:** Break 1126-line and 1015-line map pages into presentational + hooks.
- **Scope:** Extract `features/location/hooks/useLocationChainedSelection.ts` (pattern 3). Extract `useMapState`, `useLocationFormSubmit`. Slim both map pages to <200 lines each by pushing logic into hooks and splitting JSX into sub-components (e.g. `LocationChainSelector`, `MapCard`, `AddressSummary`).
- **Dependencies:** Phases 1, 3, 4.
- **Effort:** L
- **Split:**
  - **Dev A** lands the shared hooks + decomposes `CurrentLocationMapPage`.
  - **Dev B** picks up after Dev A's hook PR merges; decomposes `PreviousLocationMapPage` reusing the hooks.

### Phase 6 — Decompose building forms
- **Goal:** Eliminate ~60 duplicated watch/useEffect blocks across 6 building forms.
- **Scope:** New `features/damage-assessment/hooks/useBuildingFormLogic.ts` taking a `buildingType` key and returning `{ showOwnerName, showDamageValue, … }` plus side-effect registrations. Convert each form to use `FormProvider` to drop the 6-prop drill. Target: each building form <250 lines.
- **Dependencies:** Phases 1, 3, 4.
- **Effort:** L
- **Split:**
  - **Dev A** writes `useBuildingFormLogic` and migrates `IndependentBuilding`, `ResidentialBuilding`, `Tower`.
  - **Dev B** (after hook PR merges) migrates `ApartmentInsideBuilding`, `CampHousing`, `AdditionalBuildings`.

### Phase 7 — Decompose applications feature
- **Goal:** Slim `MyApplications` (874) and `ApplicationCard` (704).
- **Scope:** New `features/applications/hooks/useApplications.ts`, `useComplaints.ts`. Move governorate-name lookup out of `ApplicationCard` into a preloaded map at page level. Split `MyApplications` into `<ApplicationList>` + `<ApplicationFilters>` + `<ApplicationBulkDialog>`.
- **Dependencies:** Phases 1, 3, 4.
- **Effort:** M
- **Split:**
  - **Dev A** — `MyApplications` + hooks.
  - **Dev B** — `ApplicationCard` + `ComplaintDetailsPage` + `MyComplaintsPage`.

### Phase 8 — Decompose auth pages
- **Goal:** Slim `PasswordDisplayPage` (732), `ChangePasswordPage` (360), `VerificationQuestionsPage` (278), `ResetPasswordForm` (425).
- **Scope:** Extract `features/auth/hooks/usePasswordTimer.ts`, `useVerificationQuestions.ts`, `useChangePassword.ts`. Replace inline axios with `features/auth/api/authApi.ts` services (created in Phase 4) + `useFormSubmission`.
- **Dependencies:** Phases 1, 2, 3, 4.
- **Effort:** M
- **Split:**
  - **Dev A** — `PasswordDisplayPage` + `usePasswordTimer`.
  - **Dev B** — `ChangePasswordPage`, `VerificationQuestionsPage`, `ResetPasswordForm`.

### Phase 9 — Decompose dialogs + landing Header
- **Goal:** Slim `CommentsDialog` (390), `OtpDialog` (376), `Header` (427), `HeroSlider` (347).
- **Scope:** Push comment/OTP API calls into feature `api/` modules; hooks `useComments`, `useOtp`. Split Header into `<TopBar>` + `<MainNav>` + `<NotificationsMenu>` + `<UserMenu>`.
- **Dependencies:** Phases 1, 3, 4.
- **Effort:** M
- **Split:**
  - **Dev A** — `CommentsDialog`, `OtpDialog`.
  - **Dev B** — `Header`, `HeroSlider`.

### Phase 10 — Redux cleanup + dead code removal
- **Goal:** Finish state-management consolidation.
- **Scope:** Split `damageSlice.ts` (368 L) into per-building-type slices if it clarifies selectors. Delete `src/app/providers/UserAuthContext.tsx`. Add `useAuth()` selector hook in `features/auth/hooks/`. Verify all localStorage access routes through `shared/utils/storage.ts`. Remove any remaining api shim.
- **Dependencies:** Phases 2, 4, 8.
- **Effort:** M
- **Split:**
  - **Dev A** — slice split + `useAuth` hook.
  - **Dev B** — delete `UserAuthContext`, storage util audit, cleanup pass.

---

## Verification checklist (per-phase)

1. `npm run build` passes (TypeScript + Vite).
2. `npm run lint` (if present) produces no new warnings.
3. Browser smoke tests:
   - Sign-in → dashboard (Phases 1, 2, 8).
   - Damage-assessment flow, all 6 building types (Phases 1, 6).
   - Location selection on map (Phase 5).
   - My Applications → details → add complaint (Phase 7).
   - OTP and comments dialogs (Phase 9).
4. Network tab: every request carries `Authorization: Bearer …` (Phase 1 regression).
5. Redux DevTools: `auth` slice contains no `password` or `national_id` (Phase 2).
6. Arabic + English runs to catch i18n regressions.

No automated tests exist today; adding a `__tests__/` folder per feature after Phase 4 is a natural follow-up but out of scope for this plan.
