# Hearthstead v0.1 — Architecture notes

## Design objectives

- Run as a tiny static site now, without requiring a framework or paid hosting.
- Communicate a **work-in-progress** community vision without inventing members, success metrics, clients, or nonprofit status.
- Make member and project profiles **data-driven** so individual content doesn't require new handwritten card layouts.
- Provide accessible navigation, system color scheme support, and mobile usability.
- Make future extraction into a shared-template / static-site-generator straightforward.

## Boundaries

**Implemented now:** Responsive pages; reusable profile and project routes; JSON-backed filtering; manual and automatic theme preferences; local-only inquiry draft.

**Not implemented:** Accounts, authentication, member submissions, moderating workflow, email delivery, payments, nonprofit incorporation, fundraising, analytics, live support, or a search backend.

### Why seven HTML files?

Five destination pages form the public site; two additional detail templates (`workshop.html` and `project.html`) handle every individual workshop and project. This avoids one HTML file per professional and still allows meaningful deep links with `?slug=`.

### Data and trust model

- The JSON files are **curated content controlled by the site maintainer**, not open user submissions.
- JavaScript turns JSON strings into DOM nodes using `textContent`. User-controlled strings should never be fed directly into `innerHTML`.
- Link URLs in the demo are generated from URL-encoded slugs and known same-origin file paths.
- If public profiles are added, the input data needs schema validation, consent, an approval workflow, and safe handling of external URLs.

### CSS theme resolution

1. Browser honors the operating system light/dark preference when no override is set.
2. A manual click adds `data-theme='light'` or `data-theme='dark'` to `<html>` and stores the preference in `localStorage`.
3. An early inline script restores preference before the first paint.
4. CSS tokens style components consistently in either theme.

Tokens are currently duplicated between the `prefers-color-scheme` media query and the explicit dark selector for broad browser compatibility. Change values in **both** places when updating dark mode.

### Navigation and accessibility

- Keyboard skip-to-content link; visible focus rings.
- `<nav>` landmark with `aria-current` for the active page.
- Mobile menu updates `aria-expanded` and Escape closes the menu.
- Filter buttons update `aria-pressed`, result counts use `aria-live`, and empty results show an explanatory state.
- `prefers-reduced-motion` suppresses smooth scrolling and nonessential transitions.
- Decorative illustration uses accessible labels / empty alternative text as appropriate.
- Run automated and manual accessibility audits before a public launch, including contrast checks on both themes.

## Planned migrations (not part of v0.1)

| Growth need | Recommended evolution |
| --- | --- |
| More pages / shared navigation edits | Static-site generator with partial templates, e.g. Eleventy or Astro |
| More members | JSON or Markdown collection with schema checks and automated builds |
| Better discovery | Client-side index first; server search only when justified by scale |
| Accept member-submitted profiles | Authentication, moderation queue, consent records, removal flow |
| Private information | Security review, data minimization, role-based access, privacy policy |
| Member commerce | Independent merchant links first; legal review before a central marketplace |
| Donation support | Legal status, processor selection, accounting, and donor transparency |

## Name changes

Hearthstead is deliberately provisional. In v0.1, shared header/footer HTML is repeated across pages to keep the site simple and framework-free. Use a global search-and-replace when selecting the final name, carefully review any affected asset names, and retest. Moving to a static generator will centralize the name, header, and footer before content grows.

## Nonprofit considerations

Nonprofit status is an aspiration, not a claim. The public mission and actual activities would need review with qualified advisors to determine whether an appropriate charitable, educational, or other nonprofit form is available. Do not accept tax-deductible donations or represent the organization as tax-exempt based on this prototype.
