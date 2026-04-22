I am finishing a refactor phase. Generate a handoff document.

Scan git diff since last commit tagged `phase-start`.

Produce `docs/handoffs/phase-<N>-handoff.md` containing:
- Summary of what changed (2–3 paragraphs)
- New files added (with purpose)
- Files moved or renamed (from → to)
- Breaking changes for other devs (import paths, prop signatures)
- Known issues / TODOs deferred to later phases
- Verification checklist (what to test manually)

Output only the markdown file. No code changes.