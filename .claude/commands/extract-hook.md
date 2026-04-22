Extract a reusable custom hook from the logic described: $ARGUMENTS

Rules:
1. Hook must follow `use<Thing>` naming
2. Single responsibility — if logic has 2 concerns, create 2 hooks
3. Place in `src/features/<feature>/hooks/` if feature-specific, else `src/shared/hooks/`
4. Return a stable API: prefer `{ data, loading, error, refetch }` pattern for async
5. Add JSDoc with param and return descriptions
6. Replace all duplicated inline logic with calls to the new hook
7. Show me the diff before committing