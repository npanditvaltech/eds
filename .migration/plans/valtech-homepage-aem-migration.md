# Migration Plan: valtech.com homepage to AEM Edge Delivery Services

## Overview
This plan moves the **valtech.com homepage** (`https://www.valtech.com/`) to AEM Edge Delivery Services. The page will be rebuilt from scratch: its content and blocks, the site design, the header and navigation, and the footer. After this first page is done, the same setup can be reused for more pages or templates.

**Target project:** `npanditvaltech/eds`, authored in Document Authoring
**Scope:** One page (the homepage)
**Includes:** Content and blocks, design and styling, header and navigation, footer

## Approach
1. **Project setup.** Confirm the project type and which block library it uses, so new blocks reuse existing ones wherever possible.
2. **Page analysis.** Scrape the homepage, take screenshots, split it into sections, and decide for each part whether it becomes a block, a block variant or default content.
3. **Block mapping and code.** Link each part of the source page to an AEM block and write or adapt the block code (JS/CSS), keeping each block's CSS limited to that block.
4. **Import setup.** Write the parsers, transformers and the homepage import script that turn the source page into AEM content.
5. **Content import.** Run the import for the homepage and check the result in the local preview.
6. **Design migration.** Extract the site-wide design values (fonts, colors, spacing, buttons) and style each block to match the original.
7. **Header and navigation.** Rebuild the header, the nav menu and any megamenu for desktop and mobile, and check how hover and click behave.
8. **Footer.** Rebuild the footer layout, links and mobile behavior.
9. **Visual check.** Compare the migrated page with the original page and fix any differences.

## Guardrails
- All work stays **in your local workspace**. Nothing is uploaded to Document Authoring, previewed remotely or published unless you ask for it.
- The vendored core script (`scripts/aem.js`) won't be changed.
- Block code assumes authors may leave out or add cells, so it handles missing or extra content.
- No commits or pushes are made unless you ask for them. If you do, the PR will include the required branch preview link.

## Checklist
- [ ] Confirm the project type and block library, and record them in the project settings
- [ ] Scrape `https://www.valtech.com/`, including metadata, images and cleaned HTML
- [ ] Analyze the page: sections, authoring decisions, block variants
- [ ] Name block variants and reuse existing ones where they are similar enough
- [ ] Add block and section mappings to the page template configuration
- [ ] Generate or adapt the block code (JS/CSS) for every mapped block
- [ ] Generate the import parsers and transformers (cleanup, sections, media)
- [ ] Generate the homepage import script
- [ ] Bundle and run the import for the homepage
- [ ] Check that the imported content renders correctly in the preview
- [ ] Extract site-wide design values (fonts, colors, spacing, buttons)
- [ ] Style each migrated block to match the source
- [ ] Migrate the header and navigation (desktop, mobile, megamenu if present)
- [ ] Migrate the footer (desktop and mobile)
- [ ] Compare the full page with the original and fix differences
- [ ] Summarize the results, list any remaining gaps, and confirm what changed (local only)

## Notes
- Execution requires switching to **Execute mode**. Plan mode only builds this plan.
- If valtech.com blocks automated access, scraping will switch to a fallback method automatically.
