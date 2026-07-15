# Portfolio Design System — Decisions

- Use DTCG JSON as the canonical source and generate platform outputs, because the system must remain portable and standards-aligned.
- Organize tokens as primitive, semantic, and narrowly scoped component layers, because raw values, intent, and exceptional ownership solve different problems.
- Reference VMedium's focused rail and specimen structure without copying its visual styling, because its information architecture is strong while Malik's identity should remain distinct.
- Make the live token workbench public and browser-local, because experimentation is harmless and is the feature that makes the reference memorable.
- Keep production values visibly separate from local draft values, because visitors must always understand which state is authoritative.
- Apply full-site previews only in explicit preview mode, because a stored draft should never unexpectedly alter an ordinary portfolio visit.
- Treat DotGrid and the About experience as expressive patterns, because forcing them into generic primitives would erase their intended character.
- Authenticate only the publish operation, because editing CSS variables locally is not a privileged action.
- Publish by opening a GitHub pull request from a new branch, because Vercel previews and Git history already provide review, versioning, and rollback.
- Use a single publish-time password flow in v1, because it keeps the server surface narrow; persistent sessions and OAuth are deferred until their convenience justifies additional infrastructure.
- Defer server-side drafts, custom version history, rollback UI, and changelog, because Git and localStorage already cover the v1 needs.
- Reject the static-documentation-only direction, because it removes the system's most distinctive portfolio behavior.
- Reject database-backed instant production tokens, because they add runtime dependency, caching, failure, and operational complexity without improving the review workflow.
- Reject an exhaustive generic control catalog, because documentation should reflect the portfolio that actually exists.
