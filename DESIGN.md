---
name: PT Katalis Lintas Global
description: Company profile for a Muara Baru fish supplier, painted like the side of a steel fish carrier from bridge to keel.
colors:
  hull: "#0b6aa8"
  hull-deep: "#08497a"
  logo-blue: "#0582c6"
  oxide: "#9e3a26"
  paint: "#f3f6f8"
  paint-shade: "#e3eaef"
  ink: "#1a2633"
  ink-soft: "#3f4d5a"
  on-hull: "#ffffff"
  on-hull-soft: "#e1eef8"
  on-oxide-soft: "#f6e3dd"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5.4vw, 5.25rem)"
    fontWeight: 850
    lineHeight: 0.96
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 3.15rem)"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.7vw, 1.4rem)"
    fontWeight: 760
    lineHeight: 1.2
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  lead:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(1.08rem, 1.7vw, 1.28rem)"
    fontWeight: 400
    lineHeight: 1.55
    fontVariation: "'wdth' 100"
  port-line:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(0.95rem, 1.5vw, 1.35rem)"
    fontWeight: 780
    lineHeight: 1.2
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 125"
  label:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 760
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 112"
  draft-numeral:
    fontFamily: "'Archivo Variable', 'Archivo', system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 6vw, 5.5rem)"
    fontWeight: 820
    lineHeight: 1
    fontFeature: "'tnum' 1, 'lnum' 1"
    fontVariation: "'wdth' 62"
rounded:
  none: "0px"
spacing:
  rule: "3px"
  rule-heavy: "6px"
  gutter: "clamp(1rem, 4vw, 3.5rem)"
  section: "clamp(4.5rem, 9vw, 8.5rem)"
  container: "84rem"
  rail: "4.5rem"
components:
  button-primary:
    backgroundColor: "{colors.hull}"
    textColor: "{colors.on-hull}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-hull}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "3.25rem"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-hull}"
  button-on-hull-primary:
    backgroundColor: "{colors.on-hull}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.4rem"
    height: "3.25rem"
  button-on-hull-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-hull}"
  header-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-hull}"
    rounded: "{rounded.none}"
    padding: "0 1.1rem"
    height: "2.9rem"
  header-cta-hover:
    backgroundColor: "{colors.hull}"
  filter-plate:
    backgroundColor: "{colors.paint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1.15rem"
    height: "3rem"
  filter-plate-active:
    backgroundColor: "{colors.hull}"
    textColor: "{colors.on-hull}"
  product-card:
    backgroundColor: "{colors.paint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(1.25rem, 2.5vw, 1.75rem)"
  company-plate:
    backgroundColor: "{colors.paint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1rem 1.35rem"
---

# Design System: PT Katalis Lintas Global

## Overview

**Creative North Star: "Lambung Muara Baru" (the painted hull at Muara Baru)**

Every page reads like the side of a steel fish carrier, top to bottom: a white superstructure header with an ink rule under it, full-width hull-blue fields lettered in wide heavy capitals with the home port written beneath the name, white welded plates of specs and evidence bolted between them, and an oxide-red keel as the footer. Color owns whole horizontal bands; it never arrives as a tint, a badge, or a gradient wash.

The material is flat painted steel. Plates are square, joined by heavy ink rules (3px and 6px) and thin seam lines. Depth comes from band changes (paint, paint-shade, hull, keel) and from rule weight, never from shadow. Numerals are draft marks: condensed, tall, and only ever a real index or count (section order, process step, location number).

The density is a working document's, not a brochure's. Claims sit in a ledger beside their evidence, the specification sheet lists what a buyer agrees in the meeting, and the six locations sit on a real chart of Indonesia. The system rejects the navy-gradient corporate hero with a floating photo and a row of equal rounded cards.

**Key Characteristics:**
- Full-width color bands in a fixed vertical order: paint header, hull fields, paint and paint-shade plates, oxide keel.
- Archivo on its width axis: 125 wide heavy caps for hull lettering, 112 for plate labels, 100 for reading, 62 condensed for draft numerals.
- Square corners everywhere; heavy ink rules as the joinery.
- One seam grid, in sixths of the content container, only on open hull fields.
- Draft-mark section rail with a travelling waterline on wide screens.

## Colors

A working ship's paint schedule: one deep hull blue carrying the identity, white superstructure, near-black ink for rules and type, and a single antifouling red held to the waterline and below.

### Primary
- **Hull Blue** (hull): the open fields (hero, page hero, CTA band, process and locations sections, 404), the primary button on light plates, the active filter plate, active nav underline color, selection highlight, and the submerged part of the draft rail. It is the brand's own logo blue deepened to carry white text.
- **Deep Hull** (hull-deep): text-level blue on light plates: current and hovered nav links, news dates, evidence emphasis inside the ledger, text-button color, and the locations chart field.
- **Logo Blue** (logo-blue): kept at the logo's exact value. In the build it appears only as the focus-visible outline; it is not used for fields or body text.

### Tertiary
- **Antifouling Oxide** (oxide): the keel only. Footer background, the Muara Baru (head office) map marker, and the Muara Baru cell in the locations list. Nothing else.
- **Keel Wash** (on-oxide-soft): secondary text on the oxide keel (footer descriptions, region names, legal line).

### Neutral
- **Superstructure White** (paint): page background, header, light plates (product cards, company plate, spec sheet, filter plates), and the white frame around the hero photo.
- **Shaded Deck** (paint-shade): alternate section band and image-loading ground.
- **Ink** (ink): all headings and body text on paint, every structural rule, the header CTA plate, spec pin markers, and the ink stripe of the waterline.
- **Soft Ink** (ink-soft): secondary copy on paint (leads, card descriptions, evidence text, labels in the company plate).
- **On-Hull White** (on-hull) and **On-Hull Mist** (on-hull-soft): headings and body copy on hull fields respectively.
- **Seams**: white at 13% alpha on hull fields, ink at 12% alpha on paint (`rgba(255,255,255,0.13)`, `rgba(26,38,51,0.12)`), used for seam lines and dividers inside plates.

### Named Rules
**The Waterline Rule.** Oxide red lives at and below the waterline: the footer keel and the single Muara Baru home-port mark (map pin and list cell). Never use it for buttons, alerts, links, or emphasis anywhere above.

**The Whole-Band Rule.** Color is applied as full-width horizontal bands or whole plates. No tinted cards floating on a different tint, no colored chips, no partial washes.

## Typography

**Display Font:** Archivo Variable (with Archivo, system-ui, sans-serif), self-hosted, width axis 62 to 125
**Body Font:** Archivo Variable at normal width
**Label/Mono Font:** none distinct; labels and numerals are Archivo at other widths

**Character:** One family stretched like stencilled hull lettering. Wide and heavy for names painted on steel, condensed for draft marks, plain width for reading, so the whole site speaks with one voice in different paint jobs.

### Hierarchy
- **Display** (850, wdth 125, uppercase, see `typography.display`): h1 only. The hero tightens it to clamp(2.1rem, 4.85vw, 4.6rem) over seven of twelve columns; page heroes cap at 16ch.
- **Headline** (850, wdth 125, uppercase): h2 section titles, max width 13 to 18ch. Ledger claims and product names use the same wide heavy caps at title-to-headline sizes.
- **Title** (760, wdth 112, sentence case): h3 inside plates and timelines; news headlines stay in sentence case at this width.
- **Body** (400, 1.0625rem, line-height 1.6): paragraphs capped at 68ch. **Lead** text (see `typography.lead`) caps at 44rem.
- **Port line** (780, wdth 125, 0.14em tracking, uppercase): the home-port line "MUARA BARU · JAKARTA" and "SEJAK 2020" written directly under a hero title or the footer name, like the port of registry under a ship's name. It sits below the heading it belongs to, never above.
- **Label** (760 to 780, wdth 112, 0.05 to 0.08em tracking, uppercase, 0.74 to 0.95rem): buttons, filter plates, category tags, spec keys, definition terms, dates.
- **Draft numeral** (820, wdth 62, tabular lining figures, line-height 1): draft rail marks (1.85rem), process step numbers (3.6 to 5.5rem), location and meeting-step indices.

### Named Rules
**The Hull Lettering Rule.** Wide 125 heavy caps belong to h1, h2, ledger claims, product names, location names, and the footer name. Body copy and h3 never go wide.

**The Real Numeral Rule.** A condensed draft numeral must be a true index or count. Never use one as decoration or as a fake statistic.

**The Port-Below Rule.** Supporting identity lines go under the title they belong to. No eyebrow or kicker text above headings.

## Layout

A centered content container (`spacing.container`, inset by `spacing.gutter`) inside full-bleed bands. Sections breathe on `spacing.section` vertical padding. Splits are asymmetric twelfths: 7/5 for hero and split headings and contact, 5/7 for the ledger and about preview, 5/6 for the spec section. Grids collapse to one column between 780px and 960px; the hero stacks at 900px.

**The seam grid.** Open hull fields (hero, page hero, CTA band, 404) carry faint vertical plate seams spaced at one sixth of the container width, starting at the container's left edge, so seams fall on the same columns as the content. Below 780px the spacing becomes thirds. The footer keel repeats the same sixths at lower alpha. Plate structures (process plates, locations chart and list, meeting steps, ledgers) sit on hull fields without seams: they carry their own welded dividers and never a second grid.

**The draft rail.** At 1360px and wider, a fixed 4.5rem rail on the left edge lists every `data-draft` section of the page (minimum three) as condensed numerals. The body is padded by the rail width. A hull-blue waterline fills the rail from the bottom up to the active section, capped by a white then ink boot-topping stripe; at rest (first section) its top sits exactly on the header's ink rule. Links work without JavaScript; below 1360px the rail is not built.

**The home hero is text only** (owner's decision, 2026-10-24: a video will take this place later). The h1 runs the full container width in hull lettering up to 6rem, like a ship's name painted on the hull. Under it a 3px white sheer line carries a deck row: the stacked port line, the lede, and the two CTAs. Do not put a product photo back into the hero; when the video arrives it belongs to this hull field, behind or beside the name, without displacing the deck row.

**Product cards stay card-sized.** On Beranda the section intro sits left (5fr) and cards fill an auto-fill grid on the right (min 16rem); on Produk the grid is auto-fill at min 17rem. A single product never stretches across the row.

**Navigation collapse.** At 1180px and below, the header nav becomes a full-height hull-blue panel with wide caps links on seam dividers and a white CTA plate.

## Elevation & Depth

Flat. There are no shadows anywhere in the build. Depth is carried by band order (paint superstructure over hull fields over the oxide keel), by rule weight (6px ink for the top edge of ledgers, timelines, and heavy plates; 3px ink for row joins and plate borders; 1px seams inside plates), and by paint frames around photos. The header is sticky and separated only by its 3px ink rule.

### Named Rules
**The Welded Plate Rule.** Separate things with ink rules and band changes, never with shadow or blur. If an element needs to stand out, give it a heavier rule or a full band, not a lift.

## Shapes

Square welded plates (0px radius) throughout: buttons, cards, tags, map pins, markers, dialogs, filters. Borders are solid ink or white at 3px or 6px; the only dashed lines are the fill-in rules of the spec sheet and the map's equator. Photos are cropped to fixed ratios (4:3 product cards, 3:2 news) and framed in paint on hull fields. Gradients appear only as hard-stop stripe devices: the seam lines and the waterline stripe on the draft rail. There are no soft or decorative gradients.

## Components

### Buttons
Heavy painted plates with an arrow that nudges forward on hover.
- **Shape:** square (0px), 3px border, min height 3.25rem, uppercase label at wdth 112 with a square-capped arrow icon.
- **Primary:** hull field with white text on paint backgrounds; on hull fields it inverts to a white plate with ink text.
- **Hover / Focus:** background and border shift to ink over 220ms on the shared ease-out; the arrow translates 4px. Focus is a 3px logo-blue outline offset 3px (white inside the footer).
- **Secondary:** transparent with a 3px ink outline (white on hull); hover fills ink (white with deep-hull text on hull).
- **Text:** no padding, 3px bottom rule in currentColor, deep-hull text.
- **Header CTA:** smaller ink plate (2.9rem) that turns hull blue on hover; inside the mobile panel it becomes a white plate.

### Chips (filter plates)
- **Style:** a run of square paint plates joined by 3px ink rules on all sides, uppercase labels.
- **State:** hover shades to paint-shade; pressed (`aria-pressed`) fills hull blue with white text.

### Cards / Containers
- **Corner Style:** square.
- **Background:** paint.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** product cards carry a 3px ink frame with a 3px rule under the photo and an ink category tag pinned to the photo's top-left corner. News items drop the frame and hang from a 6px ink top rule. Company plate and spec sheet use a 6px ink frame with 3px or seam row joins.
- **Internal Padding:** about 1 to 1.75rem.
- **Hover:** product photos scale to 1.03 over 900ms; nothing else moves.

### Navigation
- **Desktop:** paint header, 5rem tall, 3px ink bottom rule. Links at 0.9rem, weight 620; hover and current page get a 3px underline in hull blue with deep-hull text. A small outlined "ID" tag marks Indonesian-only pages on the English site.
- **Mobile (1180px and below):** two-bar toggle that crosses on open; full-height hull panel with wide heavy caps links separated by seam lines.

### Claim Ledger (signature)
A two-column table, 5/7, opened by a 6px ink rule and joined by 3px ink rules: the claim in wide heavy caps on the left, the operational evidence in soft ink on the right with deep-hull emphasis. Column heads are small wide-tracked caps; on narrow screens the columns stack and the heads hide.

### Welded Plates on Hull (signature)
Process steps, meeting steps, and the locations list sit on hull fields as a row of plates inside a 3px white frame, divided by 1px white rules at 35% (or seams). Each plate opens with a large condensed draft numeral. They stack vertically on narrow screens.

### Locations Chart (signature)
A deep-hull chart of Indonesia with a faint graticule and dashed equator, paint landmass, and square ink pins with white borders and numbered labels. Muara Baru is the larger oxide pin; branch tags are paint plates with a 2px ink border. Tags hide below 860px and the list repacks to two columns with Muara Baru spanning the row.

## Do's and Don'ts

### Do:
- **Do** lay color as full-width bands in hull order: paint header, hull fields, paint plates, oxide keel.
- **Do** join plates with ink rules at 3px (`spacing.rule`) and 6px (`spacing.rule-heavy`), and keep every corner square.
- **Do** put the seam grid (sixths of the container, thirds below 780px) only on open hull fields: hero, page hero, CTA band, 404.
- **Do** use wide 125 heavy caps for names and titles, normal width for reading, and condensed 62 numerals only for real indices and counts.
- **Do** write the port line under the title it belongs to.
- **Do** keep the home hero text-only until the owner's video is ready.
- **Do** mark every top-level page section with `data-draft` so the draft rail can index it.

### Don't:
- **Don't** use oxide red anywhere above the keel except the single Muara Baru mark.
- **Don't** add eyebrows or kicker lines above headings.
- **Don't** round corners, add shadows, or paint soft or decorative gradients; the only gradients are hard-stop seam and stripe lines.
- **Don't** lay seams over plate structures on a hull field; plates carry their own dividers, never a second grid.
- **Don't** use em dashes in visible copy.
- **Don't** use draft numerals as decoration or invented statistics.
- **Don't** float a photo on a navy gradient or line up a row of equal rounded cards as a hero.
