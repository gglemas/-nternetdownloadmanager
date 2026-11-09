# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The website serves people looking for a free, open-source download manager for Windows. Many are not technical and want clear setup instructions, accurate feature descriptions, and a dependable download. The site is published in 21 languages, including Arabic and Persian right to left.

Secondary visitors include Linux users (supported, tested on GNOME, KDE Plasma, Xfce and Cinnamon), Mac users (experimental builds), people reading help pages while using the app, and contributors (code, translations, bug reports) arriving from GitHub.

## Product Purpose

Mister Download Manager (MDM) is a free, open-source (GPL-3.0) download manager for Windows and Linux, built in Rust. The website helps visitors understand its capabilities, choose the right build, download it with confidence, and find help through tutorials and the FAQ.

Success means visitors understand what MDM does, find an appropriate build, and can answer their questions in the help pages.

## Positioning

MDM combines a clear Windows desktop workflow with multi-connection downloads, crash-safe resume, built-in torrents and video downloads, browser integration, and 86 interface languages. It is free, with no ads, trial, or sign-up. macOS builds are experimental.

MDM is independently written in Rust. Product names and marks belonging to third parties remain attributed where legally required; the website does not imply affiliation.

## Operating Context

- Visitors may be new to download managers and need straightforward descriptions of capabilities and limitations.
- Downloads are from GitHub Releases: a Windows installer, portable zip, plain zip; Linux packages (.deb, .rpm, AppImage, tar.gz); macOS builds marked experimental. The browser extension ships for Chrome, Edge, Brave, Opera, Vivaldi and Firefox.
- Help pages are read alongside the running app, often to find a menu or setting.
- Contact and support happen on GitHub only (issues, discussions); there is no email or form.

## Capabilities and Constraints

- Static site: `tools/website/build.py` builds `website/`, `docs/` (help) and `CHANGELOG.md` (news) into `target/site`; GitHub Pages serves it at misterdownloadmanager.com. Plain HTML, CSS and JavaScript, no framework, no external scripts except the Statcounter visit counter.
- Every page exists in 21 languages (`tools/website/sitei18n.py`, catalogs in `i18n/site/`); layout must hold for long German words, CJK, Thai, Bengali and right-to-left Arabic/Persian. Text in scripts is translated through `window.MDM_I18N`.
- Light and dark themes; the visitor's system choice is the default.
- Describe capabilities accurately, use real app screenshots, and respect third-party attribution.

## Evidence on Hand

- Real, unretouched screenshots of the app: `website/assets/screens/` (light and dark) and `docs/images/`.
- The app's logo (`website/assets/logo-*`), its 71 flag icons (`crates/app/assets/flags/`, lipis flag-icons, MIT), browser logos for the extension (`website/assets/browsers/`).
- No testimonials, reviews, user counts, press or customer logos exist; none may be invented. GitHub stars are shown only as a live count.

## Product Principles

1. Clear first: visitors should understand the app and its workflow from the real interface.
2. Accurate, not inflated: describe capabilities and limits precisely; use real screenshots.
3. Free means free: no dark patterns, no upsell, no data collection beyond the visit counter.
4. Every language is first-class: no page reads as a translation of an English layout.
5. Honest about limits: experimental builds (macOS), what Linux lacks yet, and missing features are stated plainly.

## Accessibility & Inclusion

Non-technical visitors in many languages and scripts: plain words, readable sizes, full keyboard use, right-to-left layouts that mirror properly, WCAG AA contrast in both themes.
