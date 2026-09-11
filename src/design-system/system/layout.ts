// ─── Page column ──────────────────────────────────────────────────────────────
// The one column the homepage is set in: the header, both Work sections, the
// Studio hand-off and the footer all sit in it, so their edges line up at every
// width. Gutters go on the outer element and the cap on an inner one: the cap
// (1400px) is then the content width, the same at every call site, and a
// full-bleed ground (the header scrim) can still run behind the gutters.
// Before this the four blocks each carried their own copy of these classes and
// had drifted: the footer sat 16px wider than the nav, and the nav and the
// Studio banner never took the cap the Work frames did.
export const PAGE_GUTTERS = "px-6 md:px-16 lg:px-24";
export const PAGE_COLUMN = "mx-auto max-w-page";
