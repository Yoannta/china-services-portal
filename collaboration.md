# COLLABORATION LOG (MANAGER)

## Format
- `INS-XXX`: manager order
- `FIX-XXX`: employee fix claim
- `CHK-XXX`: manager validation result

## Template
ID: INS-XXX
Section: <page/module>
Defects:
- <fact 1>
- <fact 2>
Impact: <one line>
Order:
1. <action 1 with value>
2. <action 2 with value>
Accept:
- <criterion 1>
- <criterion 2>

---

ID: INS-001
Section: Etudes page (`etudes.html`, `css/etudes.css`, `js/etudes.js`, `js/main.js`)
Defects:
- Duplicate critical init: Lenis + GSAP ticker run in both `main.js` and `etudes.js`.
- Mobile menu mismatch: JS targets `.main-nav` while page nav is `.et-header__nav`.
- Vertical rhythm is too loose (`.et-section: 8rem`, `.et-section__header: 5rem`, `.et-window__body: padding 5rem + gap 5rem`).
Impact: unstable behavior risk + weak mobile UX + premium perception drops due to visual emptiness.
Order:
1. Keep one Lenis/ticker source per page; disable global Lenis path on `etudes-page`.
2. Fix burger logic with coherent selector and null guard before `classList`.
3. Tighten spacing: `.et-section` 6.5rem desktop / 4rem mobile; `.et-section__header` 3rem; `.et-window__body` padding 3rem desktop / 2rem mobile, gap 2.5rem.
4. Soften overlays: hero max dark stop 0.82; domain edge stops max 0.72.
Accept:
- One Lenis instance on Etudes only.
- No JS error when burger is clicked on mobile.
- Visible reduction of empty vertical gaps.
- README update includes exact values changed + before/after + desktop/mobile test notes.
