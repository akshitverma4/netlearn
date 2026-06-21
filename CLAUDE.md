# CLAUDE.md — NetLearn

Guidance for Claude Code (and humans) working in this repo. Keep this file
up to date as the app evolves.

## What this is
A self-contained, **no-build** static web app to learn computer-networking
concepts for Avigilon / CCTV support (Motorola Solutions). Open `index.html`
directly in a browser — no server, no npm, no bundler. All progress and custom
content are stored in the browser via `localStorage`.

## How to run / verify
- Run: open `index.html` in any browser (double-click, or `open index.html`).
- PWA/offline: the service worker only registers over **http(s) or localhost**, NOT
  `file://`. To test the PWA locally: `python3 -m http.server` in this dir, open
  `http://localhost:8000`. On GitHub Pages (HTTPS) it installs + works offline.
- Deployed via **GitHub Pages** (served at a subpath `user.github.io/repo/`), which
  is why every path in `index.html`, `manifest.webmanifest`, and `service-worker.js`
  is RELATIVE. Never switch to absolute (`/...`) paths — they break under the subpath.
- Syntax check all JS: `for f in js/data/*.js js/*.js js/features/*.js; do node --check "$f"; done`
- Logic check (no browser): shim `window` + `localStorage` in `node -e`, then
  `require` the data/store files (see git history of validation commands).
- There is **no test runner and no dependencies** by design. Do not add a build
  step or npm packages without explicit user approval.

## Hard constraints (do not break)
- **No ES modules / no `fetch`.** Scripts are plain `<script>` tags exposing
  globals (`window.CONCEPTS`, `window.Store`, `window.Content`, `window.NL`,
  `window.Router`, `window.Features`). This is required so the app works from
  `file://`.
- **Script load order matters** (see `index.html`):
  `concepts.js → more-questions.js → content.js → store.js → components.js →
   router.js → features/*.js → app.js`.
- Keep it framework-free vanilla JS, ES5-ish style (the existing code avoids
  arrow funcs in places for clarity/consistency — match the surrounding style).

## Architecture
```
index.html              app shell + script tags (load order)
css/styles.css          single dark "tech" theme, responsive
assets/diagrams/        rendered concept PNGs (content source)
source-diagrams/        original Python scripts the PNGs came from
js/
  data/
    concepts.js         window.CONCEPTS — base content model (10 CCTV concepts)
    more-questions.js   expansion pack; merged into CONCEPTS at load
    expand/*.js         per-CCTV-topic extra Q&A; each .concat()s onto a concept
    ccna/*.js           CCNA 200-301 topics; each pushes onto window.CONCEPTS
    content.js          window.Content — merges base + user-custom items
  store.js              window.Store — XP/level/mastery/streak/badges (localStorage)
  components.js         window.NL — DOM/UI helpers (el, ring, toast, tabs…)
  router.js             window.Router — hash routing
  features/
    flashcards.js       Features.flashcards
    diagrams.js         Features.diagram
    quiz.js             Features.quiz + Features.scenarios (shared engine)
    games.js            Features.game (concept tab) + Features.gamesHub
    test.js             Features.test (timed cross-concept exam)
  app.js                home dashboard, concept landing, badges, route wiring
```

### Content model (per concept)
`id, title, icon, blurb, track, diagram{img,takeaways[],hotspots[]}, keyFacts[],
flashcards[{front,back}], quiz[{q,choices[],answer,explain}],
scenarios[{situation,choices[],answer,explain}], games{match[],sort{},sequence{}}`
- `track`: "CCTV" (default if absent) or "CCNA" — home page groups by track.
- `diagram`, `scenarios`, `games` are OPTIONAL. CCNA topics have no diagram.
  Tabs (`NL.availableTabs`) and mastery weighting adapt to what exists, so a
  topic with only flashcards+quiz can still reach 100% mastery.

- `more-questions.js` appends extra `flashcards`/`quiz` onto the base arrays.
- `content.js` is the **read path** the features use: `Content.flashcards(id)`
  and `Content.quiz(id)` return built-in + custom merged, each item carrying a
  **stable `key`** (`"b"+index` built-in, `"c"+id` custom) so progress survives
  add/delete. Custom items live under `localStorage["netlearn.custom.v1"]`.

### Progress / scoring (`store.js`)
- `localStorage["netlearn.progress.v1"]`: xp, per-concept stats, seen/review
  card keys, badges, streak, best test.
- XP→Level at 100 XP/level. Mastery per concept blends quiz % (35), scenario %
  (25), flashcards-seen (25, anchored to **built-in** cards), game played (15).
- Flashcard recall awards XP only on first "Got it" per card key.
- Badges auto-unlock via `checkBadges()`; toast on unlock.

## Conventions
- Features render into the `#view` container; each `Features.x(view, conceptId)`.
- Use `NL.el(tag, attrs, children)` to build DOM; `NL.toast` / `NL.xpToast`
  for feedback; `NL.ring` / `NL.progressBar` for progress visuals.
- New routes: register in `app.js` via `Router.add(path, handler)`.
- Quiz answer `answer` is the **0-based index** into `choices`. Always validate
  indices when adding content. Sort-game items must be **unique across buckets**.

## Status / changelog
- v1 — All 10 concepts; features: flashcards, diagrams, games (match/sort/
  sequence), quiz, scenarios, knowledge test, scoring/levels/badges. Committed.
- v1.1 — Expansion pack (`more-questions.js`): flashcards 57→129, quiz 43→103.
  Added custom content (`content.js`): add/delete your own flashcards & quiz
  questions; custom quiz questions also feed the Knowledge Test. Added
  `CLAUDE.md`.
- v1.2 — Added 9 CCNA 200-301 exam topics (`js/data/ccna/`), web-researched,
  CCNA exam-format: OSI/TCP-IP, IPv4 subnetting, IPv6, switching/VLAN/STP,
  routing/OSPF, IP services, security/ACLs, wireless, automation. Each = 40
  flashcards + 40 quiz + 3 scenarios + match game. Totals: 19 topics, 489
  flashcards, 463 quiz Qs. Added `track` field + home grouping; tabs & mastery
  now adapt to diagram-less topics.
- v1.3 — Expanded all 10 CCTV topics to ~40 flashcards + 40 quiz each
  (`js/data/expand/`), CCNA exam-style, web-researched. Every one of the 19
  topics is now ~40/40. Totals: 763 flashcards, 760 quiz questions.
  To add content for a CCTV topic, append in its `expand/<id>.js`; for a CCNA
  topic, edit its `ccna/<id>.js`; new files must be wired into `index.html`.
- v1.4 — PWA: `manifest.webmanifest`, offline `service-worker.js` (precaches all
  48 assets, cache-first), app icons in `assets/icons/`, iOS add-to-home-screen
  meta tags, and notch-safe-area padding. Installable + works offline on mobile.
  NOTE: when adding/removing asset files, update the `ASSETS` list AND bump the
  `CACHE` version in `service-worker.js` so clients pull the new content.

## Ideas / backlog
- Custom scenario authoring (currently only cards + quiz are user-editable).
- Export/import progress + custom content as JSON.
- Spaced-repetition scheduling beyond the current "review-first" ordering.
