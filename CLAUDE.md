# Project Context

## Stack
- React 18 + Vite + **TypeScript**
- [Redux/Context]
- [React Router v6]
- [Tailwind/CSS Modules]
- [Axios]

## Current State
Legacy frontend being refactored from scratch. Known issues:
- Duplicated code across components
- God components (500+ lines)
- Mixed concerns (UI + business logic + API calls in same file)
- No feature-based structure
- Inconsistent naming and patterns
- No reusable hooks

## Target Architecture
Feature-based + layered architecture:

```
src/
├── app/              # App shell, providers, router
├── features/         # Business features (auth, dashboard, etc.)
│   └── <feature>/
│       ├── api/          # API calls (services)
│       ├── components/   # Feature-specific components
│       ├── hooks/        # Feature-specific hooks
│       ├── types/        # TS types or JSDoc typedefs
│       ├── utils/        # Pure helpers
│       └── index.ts      # Public API (barrel export)
├── shared/           # Cross-feature reusable code
│   ├── ui/               # Dumb presentational components
│   ├── hooks/            # Generic hooks
│   ├── lib/              # Third-party wrappers
│   ├── utils/            # Pure helpers
│   └── api/              # Base API client, interceptors
└── assets/
```

## Enforced Principles
- **SOLID**: SRP above all. One component = one responsibility.
- **DRY**: Extract repeated logic into hooks or utils. No copy-paste.
- **Separation of Concerns**: UI components never call APIs directly. Use hooks.
- **Composition over inheritance**: Small components composed together.
- **No prop drilling beyond 2 levels**: Use context or state library.

## Naming Conventions
- Components: PascalCase (`UserCard.tsx`)
- Hooks: camelCase starting with `use` (`useAuth.tsx`)
- Utils: camelCase (`formatDate.tsx`)
- Constants: UPPER_SNAKE_CASE
- Folders: kebab-case for features (`user-profile/`)

## Commit Style
Conventional commits: `refactor(auth): extract login logic into useLogin hook`

## Team
Two developers working in parallel. Each phase has split tasks.
Never touch files outside your assigned scope in a given phase.