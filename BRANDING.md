<!--
File: BRANDING.md
Purpose: Single reference for the lab's branding and document-formatting conventions.
Why: Gives Cursor (and any cloud agent or collaborator) one place to learn how we style content, so edits match our look without hunting through config and SCSS.
RELEVANT FILES: Agents.md, config/_default/params.yaml, assets/scss/template.scss, layouts/shortcodes/callout.html
-->

# Branding & Formatting Guide

This is the one place to learn how the **People Analytics Lab of the Bayou** styles its website and documents.

Read this before editing content, styles, or layouts. When you change how something looks, update this file so it stays true.

The live site is [bayoupal.netlify.app](https://bayoupal.netlify.app/). It is built with Hugo on the Hugo Blox "Research Group" theme (`theme.toml`).

## Lab identity

The lab's full name is **People Analytics Lab of the Bayou**. Write it out in full on first use. It is based at Nicholls State University and focuses on organizational behavior, human resource management, and workplace analytics.

The site title and base URL live in `config/_default/hugo.yaml`. The organization name and SEO description live in `config/_default/params.yaml` under `marketing.seo`.

## Logo and icons

The official lab logo is the circular crest: the Louisiana map with the Bayou region in red, the lab name around the ring, and the tagline "Using Evidence to Transform Organizations." The master copy lives at `static/img/image1.png`.

The Hugo Blox theme resolves the navbar logo from `assets/media/logo.png` (and `assets/media/logo_dark.png` for dark mode), and the favicon from `assets/media/icon.png`. All of these hold the crest. The navbar logo is shown when `header.navbar.show_logo` is `true` in `params.yaml`.

For convenience, the crest is also mirrored at `assets/media/pal-bayou-logo.png` and `static/img/pal-bayou-logo.png`. Reuse these files rather than creating new logo variants. If you replace the logo, update every copy listed here so they stay in sync.

## Colors

We keep a small, consistent palette. Use these values instead of inventing new ones.

- Headings and primary dark text: `#2c3e50`
- Muted caption text: `#555`
- Lighter secondary text (italic subtitles): `#777`
- Callout accent border: `#667eea`
- Callout background: `#f8f9fa`

These come from `assets/scss/template.scss` and the callout shortcode. When you need a new color, add it here first and explain why.

## Typography and appearance

Appearance is set in `config/_default/params.yaml` under `appearance`:

- Day theme: `minimal`
- Font: `native` (use the system font stack, do not add web fonts)
- Font size: `L`

The look is clean, academic, and readable. Prefer generous white space over dense layouts.

## Document (content) formatting

Content lives in `content/` as Markdown with Hugo front matter. Match the front matter of nearby files in the same folder (for example, look at an existing post in `content/post/` before adding a new one).

Our custom spacing rules in `assets/scss/template.scss` handle readable paragraphs, heading spacing, and figure sizing automatically. You usually do not need inline styles in content.

Writing style follows the rules in `Agents.md`: plain, conversational English, short sentences, and a blank line after each long sentence. Avoid long bullet lists in prose content.

### Figure captions (Economist style)

Figures use a two-part caption. The primary title is bold and dark (`#2c3e50`); the secondary title is smaller, lighter (`#777`), and italic. The styling is defined in `assets/scss/template.scss` under `.article-style figure figcaption`.

### Callout boxes

Use the callout shortcode to make important explanatory text stand out. It renders a box with the lab's accent border and light background.

```
{{< callout >}}
Your important note here.
{{< /callout >}}
```

Defined in `layouts/shortcodes/callout.html`.

### Citations and references

Publications use **APA** style. This is set in `config/_default/params.yaml` under `publications.citation_style`.

For a one-off reference inside prose, use the APA reference shortcode:

```
{{< apa_ref authors="Author, A. A." year="2024" title="Title of work" source="Journal Name" doi="https://doi.org/..." >}}
```

Defined in `layouts/shortcodes/apa_ref.html`. Publication lists and citation cards are formatted by the partials in `layouts/partials/` (for example `apa_citation.html` and `li_card.html`).

## Where the source of truth lives

If this guide and the code ever disagree, the code wins. Update this file to match.

- Site config: `config/_default/params.yaml`, `config/_default/hugo.yaml`, `config/_default/menus.yaml`
- Base theme: `theme.toml`
- Custom styles: `assets/scss/template.scss`
- Reusable formatting: `layouts/shortcodes/` and `layouts/partials/`
- Layout examples: `layout-examples.html`
- House rules and writing style: `Agents.md`
