# Portfolio Design System — Decisions

- Use DTCG JSON as the canonical source and generate platform outputs, because the system must remain portable and standards-aligned.
- Organize tokens as primitive, semantic, and narrowly scoped component layers, because raw values, intent, and exceptional ownership solve different problems.
- Reference VMedium's focused rail and specimen structure without copying its visual styling, because its information architecture is strong while Malik's identity should remain distinct.
- Remove the live token workbench from the public reference, because its technical density distracts from the portfolio system rather than clarifying it.
- Preserve token authoring as an unlisted Admin workflow, because Malik still needs the Git-backed publishing path while visitors do not need its controls.
- Present color as semantic role groups and typography as a ruled live specimen scale, because foundations should communicate hierarchy before implementation detail.
- Add a component lineup inside the Components group and keep interaction contextual to each component, because VMedium's page-level demonstrations are clearer than one universal playground.
- Keep production values visibly separate from local draft values, because visitors must always understand which state is authoritative.
- Apply full-site previews only in explicit preview mode, because a stored draft should never unexpectedly alter an ordinary portfolio visit.
- Treat DotGrid and the About experience as expressive patterns, because forcing them into generic primitives would erase their intended character.
- Authenticate only the publish operation, because editing CSS variables locally is not a privileged action.
- Publish by opening a GitHub pull request from a new branch, because Vercel previews and Git history already provide review, versioning, and rollback.
- Use a single publish-time password flow in v1, because it keeps the server surface narrow; persistent sessions and OAuth are deferred until their convenience justifies additional infrastructure.
- Defer server-side drafts, custom version history, rollback UI, and changelog, because Git and localStorage already cover the v1 needs.
- Reject renaming the existing Playground without changing its contents, because the problem is its interaction model and density rather than its label.
- Reject a broad standalone Component Playground, because it would recreate the same undifferentiated catalog under a more professional name.
- Reject database-backed instant production tokens, because they add runtime dependency, caching, failure, and operational complexity without improving the review workflow.
- Reject an exhaustive generic control catalog, because documentation should reflect the portfolio that actually exists.
