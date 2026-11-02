# Site Discovery Plan: valtech.com pages and layouts

## Overview
This plan finds every page on **https://www.valtech.com/** (main locale only) and groups the pages into **layouts (page templates)**. For each template it also lists the blocks the pages use. You get a site catalog that shows how many page types the site has, which pages belong to each one, and which blocks each template needs. That catalog is the starting point for planning the migration.

**Source:** `https://www.valtech.com/`
**Locale:** Main (default English/global) only. Regional and language versions are left out.
**How pages are found:** From the sitemap only. Links are not crawled.
**Target project:** `npanditvaltech/eds`, authored in Document Authoring

## Approach
1. **Find URLs.** Read the site's sitemap (or sitemap index) and collect every URL it lists.
2. **Filter.** Keep only main-locale pages. Remove regional and language paths, duplicates, redirects, and non-page assets such as PDFs and images.
3. **Sample pages.** Analyze a representative set of pages for structure, sections and content patterns.
4. **Group into templates.** Put pages with the same structure into one template, for example homepage, service, industry, case study, insight/article, careers, office/location, contact, and listing pages.
5. **List blocks.** For each template, identify the blocks it uses, describe each one, and match it to a block from the library. Anything left over is marked as custom or default content.
6. **Build the catalog.** Record the templates, their pages and their blocks in the site catalog.
7. **Review.** Give a summary: number of URLs, number of templates, pages per template, shared and unique blocks, and any pages that don't fit or need a decision.

## Guardrails
- Discovery is **read-only** on valtech.com. Nothing is imported, uploaded to Document Authoring, previewed remotely or published.
- Only URLs in the sitemap are included. Pages missing from the sitemap won't be found, and I'll say so if that looks likely.
- No block code or content is generated in this step.

## Checklist
- [ ] Find and read the sitemap (or sitemap index) for `https://www.valtech.com/`
- [ ] Collect every URL listed in the sitemap
- [ ] Filter down to main-locale pages only, without regional/language paths, duplicates or assets
- [ ] Choose a representative sample of pages to analyze
- [ ] Analyze the sampled pages for structure and sections
- [ ] Group all pages into templates (layouts)
- [ ] Describe and name the blocks for each template and match them to the block library
- [ ] Create the site catalog (templates, pages, blocks, variants)
- [ ] Summarize the results: URL count, template count, pages per template, shared and unique blocks
- [ ] Flag pages that don't fit a template, and blocks that need a decision

## Notes
- Execution requires switching to **Execute mode**. Plan mode only builds this plan.
- If the sitemap is missing or incomplete, I'll stop and ask before falling back to crawling.
- After discovery, the catalog can be reviewed and adjusted (rename, merge or split templates and blocks) before migration starts.
- The earlier homepage migration plan is still a separate next step. It can use this catalog once discovery is done.
