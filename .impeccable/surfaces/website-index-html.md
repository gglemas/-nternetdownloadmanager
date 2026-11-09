# Website design brief

- **Audience/action:** People looking for a free, open-source download manager for Windows. Help them understand the product and download the Windows installer from GitHub Releases.
- **Proof:** Show the real app window, clear feature details, and free price. Use only accurate claims and real, unretouched screenshots.
- **Scope:** Every page built by `tools/website/build.py`. Home and download persuade; help, FAQ, news, and legal pages use the same visual world more quietly. Support 21 languages, including RTL Arabic and Persian, in light and dark themes.
- **Concept:** A download is a delivery. The real MDM window is the parcel; the site is its waybill; the price is nothing.
- **Visual world:** Logo blue as the page-scale board; thermal-label white sheets with black ink and fine rules. Condensed grotesk caps for field names, plain grotesk for reading, tabular figures for numbers. Use a real scannable Code 128 release barcode. Dark theme: navy depot and reverse-printed labels. Green is reserved for Download and delivered states.
- **First viewport:** Slim header; real app window about 84% of content width. A roughly one-third-width waybill overlaps its lower-start corner, slightly tilted, with contact and soft shadows. It contains sender/logo, large headline, subline, green Download action, macOS/Linux links and icons, postage, Windows compatibility, version, size, and barcode. Beneath the window: caption and contributor photos/“+N”. On mobile, window is full-width, label overlaps below, then caption and contributors.
- **Story:** Visitors see the real app, understand its download, browser, and automation features, then find the right build to download.
- **Signature interaction:** The waybill feeds out once; reduced motion skips directly to the final state.

# Craft requirements

- Verify rendered output: contrast (body ≥4.5:1, large text ≥3:1), purposeful offset/blur shadows, spacing, readable type and breakpoint overflow, responsive composition, keyboard focus, and real working controls/states.
- Theme browser surfaces (selection, caret, scrollbars, focus, underline, tabular numerals) to the design.
- Use product-specific copy; controls name actions and errors explain recovery.
- Avoid default scaffolds and decoration: icon-card grids, hero-metric templates, eyebrow labels (banned), unnecessary section numbers/modals, gradients, decorative glass, hard block shadows, fake data visuals, costume monospace, system display faces, emoji/glyph icons, and geometric photo cutouts.
- Finish with review/verdict, `DESIGN.md`, and provenance for every shipped raster.
