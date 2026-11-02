# WKND Adventures Homepage Migration Plan

## Overview
This plan moves the **homepage** of https://wknd-adventures.com/ to AEM Edge Delivery Services. It covers the page content, the blocks it needs, the visual design, the header and navigation, and the footer. The project uses Document Authoring as its content source, and all work stays in the local workspace and preview. Nothing will be uploaded to Document Authoring or published unless you ask for that separately.

**Scope (confirmed):**
- Pages: homepage only (`/`)
- Included: page content, design styling, header and navigation, footer
- Excluded: other pages, uploading to Document Authoring, EDS preview or live publishing

## Approach
1. **Project check:** Confirm the project type (Document Authoring) and which block library to use. Check what blocks already exist (cards, columns, hero, fragment, header, footer, widget) so they get reused.
2. **Page analysis:** Scrape the homepage, capture screenshots, and split the page into sections. Identify each content pattern and decide what is a block and what is plain content.
3. **Block mapping and variants:** Map each section to an existing block where possible, reusing a variant when it's at least 80% similar. Create custom blocks only where nothing fits.
4. **Import setup:** Generate the cleanup and section transformers, the per-block parsers and a homepage import script.
5. **Content import:** Run the import to produce the homepage content, then validate the result against the original.
6. **Block code:** Generate or update the JS and CSS for any new or changed blocks, then refine them against the imported content.
7. **Design migration:** Pull global design tokens from the source site (colors, fonts, spacing, buttons) and style each block to match.
8. **Header and navigation:** Rebuild the desktop header, any megamenus and the mobile menu, then validate them against the original.
9. **Footer:** Rebuild the footer layout for desktop and mobile, then validate it.
10. **Visual QA:** Compare the full page against the original and fix any remaining styling, content or layout differences.

## Checklist
- [ ] Confirm the project type and block library, and record them in the migration project settings
- [ ] Scrape the homepage and save the analysis (screenshots, cleaned HTML, metadata, images)
- [ ] Identify sections, content patterns and authoring decisions for the homepage
- [ ] Name block variants, reusing existing blocks and variants where they're at least 80% similar
- [ ] Add the block and section mappings to the homepage template
- [ ] Generate the import transformers (cleanup, sections) and block parsers
- [ ] Generate the homepage import script
- [ ] Run the import and produce the homepage content locally
- [ ] Validate the imported content against the source page and fix parser or transformer issues
- [ ] Generate or refine block code (JS/CSS) for every block the homepage uses
- [ ] Pull global design tokens (colors, typography, spacing, buttons) into the site styles
- [ ] Style each homepage block to match the original
- [ ] Migrate the header and navigation (desktop, megamenu if there is one, mobile), then validate
- [ ] Migrate the footer (desktop and mobile), then validate
- [ ] Run a full-page visual comparison against the original and fix the differences found
- [ ] Final check in the local preview on desktop and mobile
- [ ] Summarize what changed (local workspace only) and suggest next steps, such as more pages or uploading to Document Authoring

## Notes and Constraints
- All content and code changes are **local only**. Uploading to Document Authoring or publishing needs a separate, explicit request.
- Re-running the import scripts later will overwrite any manual edits to the imported homepage content.
- If the source site blocks automated access, the scrape step will fall back to an alternate retrieval method.
- To publish the code later, the change has to go through a pull request that includes a `{branch}--eds--npanditvaltech.aem.page/` preview link.
- **Execution requires switching to Execute mode.** This is the plan only; no work has started yet.
