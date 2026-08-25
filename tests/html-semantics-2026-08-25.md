# HTML Semantics Audit — 2026-08-25

**Target:** http://localhost:3000 (`next dev`, Next.js 16.3.2) · commit `a35f7a0`
**Standard:** WCAG 2.2 Level AA · HTML Living Standard content models
**Scope:** `/` and `/polityka-prywatnosci` — element choice and document structure only
**Verified in:** Chromium 145, Firefox 148 (rendered DOM, not source reading)
**Status:** all 5 Serious and all 9 Moderate findings **fixed** on 2026-08-25.
The 9 Minor findings are **open** — deliberately deferred, not overlooked.

Contrast, reflow, motion, keyboard and consent behaviour are covered by
`tests/test-2026-08-25.md` and are not revisited here.

## Summary

| | |
|---|---:|
| axe-core violations (`wcag2a/2aa/21a/21aa/22aa` + `best-practice`) on `/` | **0** |
| Serious | 5 — all fixed |
| Moderate | 9 — all fixed |
| Minor | 9 — open |

axe checks that an `<img>` *has* an `alt`. It cannot check whether the element
chosen was the right one, whether a heading's accessible name is a readable
sentence, or whether a `<div>` is standing in for a heading. Every finding below
sits in that gap.

The landmark structure, the contact form and the privacy page are done properly;
see *Already correct* at the end.

---

## Serious

### S-1 · `#statement-title` has no readable accessible name — 1.3.1 (A)

`components/Statement.tsx:46-54`

The heading splits on `' '` and emits one `<span class="stmt-word inline-block">`
per word with no text node between them; the visual gap is `margin-right: 0.18em`.
A margin is not a word boundary.

Measured — `#statement-title`.innerText, identical in both engines:

```
402m²powierzchnicałkowitej.170m²powierzchniużytkowej.1600metrówdziałki.Trzykondygnacje.Solidnydomz2018roku…
```

That is the accessible name, and the string a visitor copies. Fix: emit `{' '}`
between the spans (wrap each in a `Fragment`), and move the visual rhythm to
`word-spacing` on the heading if the margin is doing typographic work.

The hero heading escapes the same bug only because `hero.headline` carries
`&nbsp;` between its parts.

**Fixed** — `components/Statement.tsx`. Each word is wrapped in a `Fragment` with a real `{' '}` after it. The 0.18 em gap the margin used to add is preserved by `word-spacing: -0.06em` on the `<h2>` (a space in Cormorant Garamond advances 0.238 em, measured in-browser), so the line breaks are unchanged: still six lines, still 476 px tall. `innerText` now reads `402 m² powierzchni całkowitej. 170 m²…`.

### S-2 · Three headings contain block-level children — 4.1.1 / 1.3.1

`components/Hero.tsx:135` · `components/Pricing.tsx:80-90` · `components/Contact.tsx:73-85`

Headings take phrasing content only. All three wrap `<div>`s used as
`overflow: hidden` masks for the GSAP line reveals. Confirmed in the rendered
DOM: `h1#hero-title`, `h2#cena-title`, `h2#kontakt-title` each return a block
child from `querySelector('div,p,ul,ol,section')`.

Fix: `<span className="block …">`. Renders identically, keeps the line break in
the accessible name, no CSS or GSAP selector changes.

**Fixed** — `Hero.tsx`, `Pricing.tsx`, `Contact.tsx`. Every mask is now `<span className="block …">`. No heading returns a block child from `querySelector('div,p,ul,ol,section')`.

### S-3 · All 21 photo captions are duplicated verbatim in `alt` — 1.1.1 (A)

`components/Gallery.tsx:89,97` · `components/Interior.tsx:102,108`

Both pass `p.label` to `alt` and print the same `p.label` in the `<figcaption>`.
Measured: 21 of 21 figures where the caption starts with the image's own alt.
Every figure is announced twice — "Jadalnia, obraz. Jadalnia. 07 / 15."

The `<figure>`/`<figcaption>` pairing is right and should stay. Fix at the `alt`:
either `alt=""` so the caption alone names the figure, or write an alt that
describes what is visible beyond the label — "Łazienka główna — widok całości"
tells a non-sighted visitor nothing about the room.

**Fixed** — `data/site.ts` gains a distinct `alt` on all 21 photographs plus the 5 plan sheets, written after reviewing each image; `Photo` and `Interior` carry `alt: string`. Gallery, Interior and Plans read `p.alt` and keep `p.label` for the caption. Zero figures now have a caption that starts with the image's own alt. The `01 / 06` counters are `aria-hidden` because the list carries position.

> **Content note, needs your eye:** `interior-27` was captioned *Łazienka główna — strefa wanny* but shows the washbasin, and `interior-28` was captioned *umywalka i lustro* but shows the corner bath. The two labels were transposed, so they have been swapped. One line to revert if the reading is wrong.

### S-4 · Consent `<label>` wraps `<div>`s and swallows a paragraph into the name — 4.1.1 / 2.4.6

`components/consent/ConsentBanner.tsx:158-165`

`<label>` takes phrasing content only. The consequence is not cosmetic: the
checkbox's accessible name becomes title **plus** the whole explanatory body,
read as one sentence on every focus.

Fix: `<span className="block">` for the title inside the label; move the body to
a sibling `<p id="consent-analytics-desc">` and point `aria-describedby` at it.

Only renders when `NEXT_PUBLIC_GA_ID` is set — live in production if analytics
are switched on.

**Fixed** — `ConsentBanner.tsx`. The label holds the title only; the body is a sibling `<p id="consent-analytics-desc">` referenced by `aria-describedby`. Verified with `NEXT_PUBLIC_GA_ID` set: the checkbox's accessible name is now `Analityka`, not the title plus the paragraph.

### S-5 · The consent dialog's `<h2>` precedes the page `<h1>` — 1.3.1 / 2.4.6

`app/layout.tsx:103` · `components/consent/ConsentBanner.tsx:130-136`

Mounting the banner ahead of `{children}` to fix its tab-order position is sound
and documented. The side effect is that its `<h2>` "Zgody" is the first heading
in the outline, before any `<h1>`.

A dialog needs no heading to be labelled. Demote the title to `<p id="consent-title">`;
`role="dialog"` + `aria-labelledby` names it just as well from a non-heading
element, and the tab-order fix stays as is.

`tests/specs/structure.spec.ts:20` does not catch this — it tests for *skipped*
levels (`h.level - prev.level > 1`), and h2 → h1 is a negative step.

**Fixed** — `ConsentBanner.tsx`. The panel title is a `<p>` keeping `id="consent-title"`; `role="dialog"` + `aria-labelledby` still names it. With the banner visible the first heading in the document is `H1`, and the dialog contains no headings at all.

---

## Moderate

### M-1 · Four label/value blocks are `<div>` pairs, not `<dl>` — 1.3.1

`components/Stats.tsx:67-86` · `components/Pricing.tsx:110-120` ·
`components/Location.tsx:208-226` · `components/Contact.tsx:299-327`

The rendered home page contains **zero** `<dl>` elements. All four are
name-to-value structures ("Powierzchnia całkowita → 402,35 m²",
"Chata na Groniu → 600 m") where the relationship exists only in the layout.

Fix: `<dl>` on the grid, `<dt>`/`<dd>` on the halves. A wrapping `<div>` around
each pair is valid inside `<dl>` and keeps the CSS grid intact.

**Fixed** — `<dl>`/`<dt>`/`<dd>` in `Stats.tsx`, `Pricing.tsx` and `Contact.tsx` (3 on the page, up from 0), with the wrapper `<div>` per pair keeping each grid intact. Location is handled as an `<ol>` under M-3 instead — its rows carry three data points, not two, and the visible `01…12` numbering makes an ordered list the better fit.

### M-2 · Visual headings marked up as `<div>` / `<p>` — 1.3.1 / 2.4.10

`components/Potential.tsx:72` · `components/Plans.tsx:77` ·
`components/Pricing.tsx:124` · `components/Contact.tsx:234,243`

A ~24 000 px page offers twelve headings. Opportunity cards, plan-sheet titles
and the `text-6xl` closing pricing statement are set at heading scale with no
heading role, so heading navigation reaches the section titles and nothing inside.

`Floorplan.tsx:75` gets this right with `<h3>` — that is the pattern to copy.
The form's status titles are a fair exception: they sit in a live region and are
announced on change.

**Fixed** — `<h3>` on the opportunity cards, the plan-sheet titles, the plans note, the nearby-list label, the contact rationale callout, and the Pricing closing statement. The page now has 1 `h1`, 11 `h2` and 18 `h3` with no skipped levels. The form's success/error titles were deliberately left as-is for the reason given above.

### M-3 · Repeated card sets are not lists — 1.3.1

`Gallery.tsx:81-104` · `Interior.tsx:92-116` · `Potential.tsx:62-82` ·
`Plans.tsx:57-86` · `Location.tsx:207-227`

The whole home page renders three lists — the three room lists inside the floor
cards. Fifteen interior photos, six gallery photos, three opportunity cards,
three plan sheets and twelve nearby destinations are all sibling `<div>`/`<figure>`.

`<ul>`/`<li>` gives the count and position ("list, 15 items… item 7 of 15").
`<figure>` nests inside `<li>` fine. The nearby list is numbered `01…12` on
screen, so it is specifically `<ol>` — and the numbers can come from `::marker`
instead of `String(i + 1).padStart(2, '0')`.

**Fixed** — `<ul>`/`<li>` in Gallery, Interior, Potential and Plans; `<ol>`/`<li>` for the nearby list. Seven lists and one ordered list on the page, up from three. Decorative index numerals are `aria-hidden` so position is not announced twice.

### M-4 · Two named regions have no heading — 1.3.1 / 2.4.6

`components/Stats.tsx:49-54` · `components/Marquee.tsx:32-35`

Eleven of thirteen `<section>`s name themselves via `aria-labelledby` → visible
heading, which is the pattern to keep. These two use an `aria-label` whose text
appears nowhere on screen and contain no heading — so the property's six headline
figures are unreachable by heading navigation.

Fix: promote the eyebrow (`04 — Specyfikacja`) to `<h2 id="dom-title">` and point
`aria-labelledby` at it. No visual change; sighted and screen-reader visitors
then read the same name.

**Fixed** — `Stats.tsx` is labelled `aria-labelledby="dom-title"` pointing at the eyebrow, now an `<h2>`. No `<section>` on either route is left without a heading.

### M-5 · The marquee is a landmark named for content it hides — 1.3.6 / 4.1.2

`components/Marquee.tsx:32-50`

The `<section>` is called "Najważniejsze informacje o nieruchomości" and its
entire contents are `aria-hidden="true"`. A visitor who navigates to that
landmark finds one pause button.

The `aria-hidden` is correct — the text is decorative and repeats the stats
section. The region is what should go: plain `<div>`, keep the pause button
exactly as it is (already outside the hidden subtree and properly labelled).

**Fixed** — `Marquee.tsx` renders a `<div>`. The pause button is untouched. `marquee.label` removed from `data/site.ts` as dead copy.

### M-6 · No `<address>` and no `<time>` anywhere — 1.3.1

`components/Contact.tsx:298-327` · `app/polityka-prywatnosci/page.tsx:25` ·
`components/Footer.tsx:43`

Measured across both routes: zero of each. The contact block is the page's
contact information for its owner — exactly what `<address>` is for. Three dates
are plain strings: "Obowiązuje od 1 czerwca 2026 r.", "© 2026", and the build
year in the structured data.

Caveat on `<address>`: it applies to the contact details of the page or article
it sits in, not arbitrary postal addresses. Here it fits — this is the seller's
own contact block, not the property's marketing address.

**Fixed** — `<address className="not-italic">` wraps the three contact rows in `Contact.tsx` (the rationale callout stays outside it, as it is not contact detail). `<time dateTime>` on the footer year and the policy's effective date; `footer.copyright` became `{ year, rest }` so the year can be wrapped.

### M-7 · `<strong>` used as a list marker, with a class cancelling its weight — 1.3.1

`app/polityka-prywatnosci/page.tsx:83-100`

`<strong className="font-normal">a)</strong>` is self-cancelling: the element
declares strong importance and the class removes the weight that would convey it.
The enumerators are doing the job of an ordered list — `<ol type="a">` with the
marker styled via `::marker`.

**Fixed** — `<ol className="list-[lower-alpha] list-inside …">`, enumerators removed from the text.

### M-8 · Em dashes typed into list items as substitute bullets — 1.3.1

`app/polityka-prywatnosci/page.tsx:68-74, 113-118, 123-132, 144-147`

Four `<ul className="list-none">` blocks suppress the real marker and open each
`<li>` with a literal `— `. A screen reader reads "dash imię i nazwisko" for
every item. Restore the marker and style it: `li::marker { content: '— ' }`.

**Fixed** — five lists (one more than first counted) now use a `.dash-list` class with `li::marker { content: '—  ' }` in `globals.css`; the 20 literal `— ` prefixes are gone from the text. Where `::marker` `content` is unsupported the declaration is ignored and the disc marker stands, so there is always a marker.

### M-9 · `<em>` carrying legal citations — 1.3.1

`app/polityka-prywatnosci/page.tsx:87, 93, 98`

`<em>art. 6 ust. 1 lit. b RODO</em>` uses stress emphasis for a statutory
reference, changing how a screen reader inflects it. The italic marks a technical
reference in a different voice — that is `<i>`. `<cite>` suits the title of the
regulation itself.

**Fixed** — the three statutory references are `<i>`. One `<strong>` remains on the page and it is genuine emphasis.

---

## Minor — open

Deferred at your request; listed here so they are on the record.

| ID | Finding | Where |
|---|---|---|
| m-1 | `cursor-zoom-in` on a plan card that does not zoom — a mouse user is invited to click something inert, a keyboard user is never offered it. Give each sheet a `<button>`/link to the full-resolution file, or drop the cursor. (3.2.4) | `Plans.tsx:59` |
| m-2 | Submission failures announced through `role="status"` (polite). An error belongs in `role="alert"`; splitting success and error into two regions also stops the previous outcome being re-announced. (3.3.1, 4.1.3) | `Contact.tsx:231-261` |
| m-3 | Required fields not identified in visible text. `required` maps to `aria-required`, so the programmatic half is covered; nothing on screen says which two of five are mandatory until the browser rejects the submit. (3.3.2) | `Contact.tsx:152-196` |
| m-4 | `disabled` on the submit button drops it out of the a11y tree mid-submission — focus is discarded to `<body>` at the moment of pressing. `aria-disabled="true"` plus the early return already in the handler keeps focus. (2.4.3, 4.1.2) | `Contact.tsx:264-268` |
| m-5 | Skip-link target is not focusable. Chromium and Firefox honour the sequential focus navigation starting point; WebKit historically did not and is untested here. `tabIndex={-1}` on `<main id="tresc">` removes the doubt. (2.4.1) | `page.tsx:27`, `polityka-prywatnosci/page.tsx:16` |
| m-6 | The pause button changes label *and* `aria-pressed` — state announced twice. Prefer a stable label + `aria-pressed`. (4.1.2) | `Marquee.tsx:53-65` |
| m-7 | `role="presentation"` alongside `aria-hidden="true"` — a no-op on a `<div>`; `aria-hidden` already removes the subtree. | `Preloader.tsx:172-176` |
| m-8 | Internal links written as raw `<a>` — full document load rather than client transition, unlike the header's `<Link>`. Not an a11y failure; inconsistent and loses the prefetch. | `Footer.tsx:35-40`, `Contact.tsx:283-288` |
| m-9 | The one `<nav>` landmark holds a single CTA. A thirteen-section page offers no way between sections but scrolling, though the anchors (`#dom`, `#galeria`, `#uklad`, `#lokalizacja`, `#plany`, `#kontakt`) all exist. (2.4.5) | `Header.tsx:84-111` |

---

## Already correct

- `lang="pl"` on `<html>`; exactly one `<main>`, one `<header>`, one `<footer>`, correctly outside each other.
- Eleven of thirteen `<section>`s named by `aria-labelledby` → a real visible heading.
- Skip link is the first element in `<body>` and the first tab stop, hidden by position not `display: none`.
- All 21 photographs use `<figure>` + `<figcaption>`.
- The privacy policy is an `<article>` with a clean `h1` → eleven `h2` outline, each section labelled by its own heading.
- Every form control has a real `<label for>`; identity fields declare `autoComplete`; the honeypot is hidden by `display: none` *and* `tabIndex={-1}`, which is the correct treatment for a spam trap.
- Every decorative SVG (arrow, wordmark, map) carries `aria-hidden="true"` — and the map's four pin labels all reappear as text in the nearby list, so nothing is lost by hiding it.
- `ConsentLink` is a `<button>`, not a link: it opens a dialog, and the distinction was made correctly.
- `Floorplan.tsx` uses `<h3>` and `<ul>`/`<li>` — the exact structure M-2 and M-3 ask for elsewhere.

---

## Order to fix in

| Findings | Work | Why first |
|---|---|---|
| S-1 | Statement word spacing | One line. A whole heading currently announces as gibberish. |
| S-2, S-4 | `div` → `span.block` in headings and label | Mechanical, zero visual change, four invalid content models gone. |
| S-3 | Photo `alt` vs caption | 21 duplicated announcements; editorial decision, `data/site.ts` only. |
| S-5, M-4, M-5 | Heading order and region naming | Small, and makes heading/landmark navigation trustworthy. |
| M-1, M-2, M-3 | `dl`, headings in cards, lists | Largest structural gain; six components, no visual change. |
| M-6…M-9, m-1…m-9 | Element choice and polish | Individually small; one sweep rather than a campaign. |

---

## Verification after the fixes

Re-measured against the rendered DOM on the same dev server, plus a second
dev server started with `NEXT_PUBLIC_GA_ID=G-TEST1234567` (an isolated copy of
the project on a spare port, so the working server was never disturbed) to
exercise the consent panel:

| Check | Before | After |
|---|---|---|
| `#statement-title` accessible name | `402m²powierzchnicałkowitej…` | `402 m² powierzchni całkowitej…` |
| Headings with block children | `h1#hero-title`, `h2#cena-title`, `h2#kontakt-title` | none |
| `<label>` with block children | 1 (consent analytics) | none |
| Analytics checkbox accessible name | title + full body paragraph | `Analityka` |
| First heading in document (banner visible) | `H2` | `H1` |
| Figures whose caption repeats the image's alt | 21 of 21 | 0 |
| `<dl>` / `<address>` / `<time>` on `/` | 0 / 0 / 0 | 3 / 1 / 1 |
| `<ul>` / `<ol>` on `/` | 3 / 0 | 7 / 1 |
| Headings on `/` | 1 h1, 11 h2, 0 h3 | 1 h1, 11 h2, 18 h3 |
| `<section>`s with no heading | 2 | 0 |
| `<em>` / `<strong>` misuse on the policy | 3 `<em>`, 4 `<strong>` | 0 `<em>`, 1 genuine `<strong>` |
| Literal `— ` prefixes in list items | 20 | 0 |
| axe-core violations (same tag set) | 0 | 0 |

`tsc --noEmit` and `eslint` clean. Full Playwright suite on chromium:
**69 passed, 4 failed** — and all four failures are the consent specs
(`consent.spec.ts:5`, `consent-semantics.spec.ts:10` and `:65`,
`consent-axe.spec.ts:34`), every one of which needs the banner on screen.

Those four are gated on the environment, not on this change:

- `consent-axe.spec.ts:7` states the requirement in its own header —
  *"Requires: NEXT_PUBLIC_GA_ID=G-TEST1234567 npx next dev"*.
- The gate is `CONSENT_REQUIRED` in `utils/analytics.ts`, which is **not among
  the changed files** — nothing under `utils/` or `hooks/` was touched.
- The previous report, written at commit `2b416e8` before any of this work,
  records the same condition: *"the consent banner only renders when
  NEXT_PUBLIC_GA_ID is set … on a default local run the banner never appears."*
- Against a GA-enabled server, **all 12 consent tests pass**, including the four
  above, with axe clean in both themes.

A true before/after baseline run was not performed: reverting the working tree
to measure it was not something to do unasked. The four points above are why
the conclusion holds without one.

Statement line breaks were checked rather than assumed: the heading still sets
to six lines at 476 px, because `word-spacing: -0.06em` compensates for the
0.238 em advance of a real space in Cormorant Garamond (both measured
in-browser).

---

## Method and limits

Rendered DOM of both routes fetched from `next dev` and inspected directly;
heading outlines, content models, accessible names, figure/caption pairs and
landmark names probed via Playwright in Chromium 145 and Firefox 148; axe-core
4.11 over `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and
`best-practice`.

**Not covered:** WebKit (will not launch on this host — see the previous
report) and a real screen-reader session. S-4 and S-5 were originally read from
source because `NEXT_PUBLIC_GA_ID` is unset locally; both were measured in the
browser after the fix, against a GA-enabled copy of the project.
