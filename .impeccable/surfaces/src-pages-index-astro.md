---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/produk.astro","src/pages/mutu-proses.astro","src/pages/tentang-kami.astro","src/pages/hubungi-kami.astro","src/pages/berita/index.astro","src/pages/404.astro"]
---

# Surface brief: whole company-profile site (Beranda leads)

Scope: full redesign of every route (Beranda, Produk + detail, Mutu & Proses, Tentang Kami, Berita + detail, Hubungi Kami, 404) plus new English static pages (/en/, /en/quality-process, /en/about, /en/contact). Mode: Persuade (Beranda, Hubungi); Read for Berita detail and Mutu & Proses body, same world with more restraint.

Audience/job: Indonesian distributors and wholesalers checking whether KLG is a credible, consistent supplier before requesting a meeting on WhatsApp. Owner's complaint: current site looks generic and AI-made (em dashes, template hero), and does not convince buyers.

New content: map of Indonesia with Muara Baru (company address) and branches Padang, Kupang, Bitung, Manokwari, Jayapura. Roles of the branches are unconfirmed; label them "Cabang" only.

Owner revision (2026-10-24, after first review): home hero is text only, no product photo (a video is planned for later); product cards stay card-sized even when only one product is active; Padang added.

## Direction contract

THESIS: The site is the painted side of a steel fish carrier at Muara Baru, read from bridge to keel. It refuses the navy-gradient corporate hero with a floating photo and a row of equal cards.

OWN-WORLD: Hull blue #0B6AA8 fields with faint vertical plate seams, superstructure white #F3F6F8, logo blue #0582C6 for large marks, ink #1A2633, antifouling oxide #9E3A26 only at the keel (footer). Archivo on its width axis: wide 125 heavy caps as hull lettering, condensed 62 for draft-mark numerals, normal width for reading. Square welded plates, heavy rules, no radius, no shadows, no gradients.

STORY: The visitor sees a real supplier painted with its own name and home port, sees the products, checks the claim-to-evidence ledger and the specification sheet, sees six locations on a chart of Indonesia, and taps Jadwalkan Pertemuan.

FIRST VIEWPORT: White superstructure header (logo as-is, nav, ID/EN, ink CTA plate). Below, full-width hull-blue field with seams: h1 in wide heavy caps across the full container (up to 6rem), then a 3px white sheer line and a deck row with the stacked port line "MUARA BARU · JAKARTA / SEJAK 2020", the lede, and the white CTA plate plus outline plate. No photo (owner revision; video planned). Draft-mark rail at the left edge.

FORM: Lambung Muara Baru (hull markings), candidate 7 of 7. seed:4ff332cc145f8919. Signature interaction: the draft-mark rail is a section index; a waterline bar travels to the active section as the visitor scrolls (IntersectionObserver, links work without JS). Raises: every numeral is a real index or count; colour owns full horizontal fields; one strict seam grid; narrow screens repack whole bands.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Branch roles, branch photos, certifications, capacity: not available; do not invent.
- English covers every page (/en/...), including products and news; Sanity content uses an optional "English" group and falls back to Indonesian when empty.
