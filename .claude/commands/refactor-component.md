Refactor the component at: $ARGUMENTS

Rules:
1. Enter Plan Mode first. Show me the plan before any edit.
2. Split into:
   - A dumb presentational component (UI only, props in, JSX out)
   - One or more custom hooks for logic/state/effects
   - An API service file if there are fetch calls
3. Move types to a colocated `types.ts` file
4. Extract any pure helpers to `utils/`
5. Preserve exact behavior. No feature changes.
6. Update all imports in consuming files.
7. Run the existing tests. Do not introduce new tests in this pass.

Output: diff summary + list of new/moved files.