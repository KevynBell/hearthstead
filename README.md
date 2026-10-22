# Hearthstead — v0.1 · The Village Foundation

> **Talent is everywhere. Opportunity should be too.**
>
> *It takes a village.*

A responsive, accessible-first **static website prototype** for a future community of independent professionals. **Hearthstead is a working project name**, not an announced company or established nonprofit. This is a real, editable website rather than a design-only mockup.

## Quick start (VS Code / Capybara)

1. Unzip the project and open **the `hearthstead-v0.1` folder** in VS Code.
2. Open the integrated terminal (`` Ctrl+` ``).
3. Start a local server from the **project root**:

   ```bash
   python -m http.server 8000
   ```

   On Windows, you can also **double-click `START-LOCAL-SERVER.bat`**, or run `py -m http.server 8000`. If you prefer VS Code's **Live Server** extension, that works too.

4. Visit **http://localhost:8000/** in your browser.
5. When done, press `Ctrl+C` in the terminal.

**Why a server?** The `data/*.json` files are loaded with browser `fetch()`. Opening HTML as `file://` blocks those requests in most browsers. All assets are local and no internet connection is necessary for the site to work.

## What's included

| Route | Function |
| --- | --- |
| `index.html` | Village homepage, mission, featured workshop, project preview |
| `about.html` | Origin, guiding principles, honest project status |
| `workshops.html` | Searchable and filterable professional directory |
| `workshop.html?slug=kevyn-bell` | Reusable individual workshop profile |
| `projects.html` | Searchable and filterable project directory |
| `project.html?slug=marpa` | Reusable individual project story |
| `contact.html` | Client-side inquiry draft builder (**copies only; does not send**) |

The project includes two complete responsive visual themes, a manual theme toggle (with remembered preference), automatically-followed browser system theme when no manual choice exists, accessible mobile navigation, custom hand-authored SVG graphics, and basic automated smoke checks.

## File map

```text
hearthstead-v0.1/
├── index.html                       # Homepage
├── about.html                       # Mission and founding principles
├── workshops.html                   # Directory page
├── workshop.html                    # Single workshop template
├── projects.html                    # Project shelf
├── project.html                     # Single project template
├── contact.html                     # Local inquiry draft builder
├── assets/
│   ├── css/styles.css               # Tokens, components, breakpoints, dark mode
│   ├── js/main.js                   # Theme, navigation, footer
│   ├── js/data.js                   # Safe JSON / DOM utilities
│   ├── js/workshops.js              # Directory search + member details
│   ├── js/projects.js               # Project search, preview + details
│   ├── js/contact.js                # Local-only copy tool
│   └── images/                      # Original SVG illustrations and favicon
├── START-LOCAL-SERVER.bat           # Windows one-click local server
├── data/
│   ├── members.json                 # Workshop data
│   └── projects.json                # Project data
├── docs/
│   ├── ARCHITECTURE.md              # How pieces work, future architecture
│   └── CONTENT-CHECKLIST.md         # Steps before a public launch
└── tests/test_smoke.py              # Standard-library sanity checks
```

## Common edits

- **Try a new palette:** Edit light and dark color tokens at the top of `assets/css/styles.css`. The `prefers-color-scheme` section and `[data-theme='dark']` overrides should both stay in sync.
- **Change the working name:** Search for `Hearthstead` / `hearthstead` in HTML, JS, filenames, and markdown. See `docs/ARCHITECTURE.md` for a future static-site generator approach to shared markup.
- **Add a workshop:** Add an object to `data/members.json` with a unique `slug`, name, categories, relevant skills, and a `projectSlugs` list. The directory and profile page will both use the data automatically. Avoid adding private contact info without consent.
- **Add a project:** Add one object to `data/projects.json` with a unique `slug`. Use only approved artwork values: `marpa`, `automation`, `website`, or `village`. For a new artwork treatment, add a CSS class and update the allowlist in `assets/js/projects.js`.
- **Add real links:** After agreeing on public profile URLs, add a dedicated social link component. No links or addresses have been invented in this prototype.
- **Reorder homepage projects:** Change `projects.slice(0, 2)` in `assets/js/projects.js`, or eventually add a `featured` field.

## Run tests

From the project root:

```bash
python -m unittest discover -s tests -v
```

The checks verify JSON structure and links, the existence of referenced assets, and expected frontend behavior wiring. For full browser QA, also inspect light and dark modes, menu interactions, search filters, details, and clipboard behavior manually.

## Editorial and safety boundaries

- The one workshop represents the **founder**; others have not been fabricated.
- The project gallery contains **personal explorations or fictional demonstrations**, clearly labeled; it does **not** claim client results.
- Hearthstead is a **prototype**; no organization, charity status, marketplace, public membership, moderation service, or formal financial model is being represented as operational.
- The contact form **does not send data anywhere**. It creates a local clipboard draft only; publication needs a real contact channel and a proper privacy notice.
- There are **no third-party fonts, external scripts, analytics, cookies, service workers, or API keys**.
- Browser `localStorage` is used **only** for the user's theme preference.
- JSON-rendered content uses `textContent` and DOM construction rather than HTML injection.
- Obtain consent before publishing another person's name, biography, links, project details, or contact information.
- Do not publish from an employer's device or Git repository without authorization; keep credentials, personal data, and future donation keys out of Git.

## Next milestones

1. Replace provisional copy and workshop information with approved public content.
2. Confirm final name / domain / legal searches before publishing a branded public URL.
3. Establish a real public contact channel and privacy policy.
4. Invite a small pilot group with explicit consent and a simple content review procedure.
5. Evaluate legal structure, nonprofit eligibility, governance, funding, moderation, and privacy before launching any member accounts or financial features.

**License:** No explicit open-source license is granted in v0.1. This prototype is for the project owner's review and iteration.
