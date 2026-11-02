# Site Discovery Plan: wknd-adventures.com pages and layouts

> **Status: Ready to run.** You've approved this plan, but nothing has run yet because this chat is still in Plan mode, which can't do the discovery. **Switch to Execute mode** and the steps below will run in order.

## Overview
This plan finds every page on **https://wknd-adventures.com/** (main locale only) and sorts the pages into **layouts (page templates)**. For each template it also lists the blocks those pages use. The result is a site catalog: how many page types the site has, which pages belong to each one, and which blocks each template needs. Migration planning starts from that catalog.

**Source:** `https://wknd-adventures.com/`
**Locale:** Main (default) locale only. Regional and language versions are left out.
**How pages are found:** From the sitemap first. If there is no sitemap, or it looks incomplete, links are crawled starting from the homepage.
**Target project:** `npanditvaltech/eds`, authored in Document Authoring

## Approach
1. **Find URLs.** Look for the sitemap or sitemap index (through `robots.txt` and `/sitemap.xml`) and collect every URL it lists.
2. **Crawl if needed.** If there is no sitemap, or it clearly misses parts of the site (for example, sections linked in the navigation or footer aren't in it), crawl links from the homepage. Crawled URLs are added to the sitemap URLs.
3. **Filter.** Keep only main-locale pages. Remove language and regional paths, duplicates, redirects, query-string variants, and files that aren't pages (PDFs, images).
4. **Sample pages.** Pick a representative set of pages and analyze each one's structure, sections and content patterns.
5. **Group into templates.** Pages with the same structure go into one template. Likely templates are homepage, adventure detail, adventure listing, magazine/article, article listing, about, FAQ and contact.
6. **List blocks.** For each template, find and describe its blocks and match each one to a block in the library. Anything that doesn't match is marked as a custom block or default content.
7. **Build the catalog.** Record the templates, their pages, and their blocks and variants in the site catalog.
8. **Review.** Report the number of URLs and templates, pages per template, shared and unique blocks, and any pages that don't fit or need a decision.

## Guardrails
- Discovery only reads from wknd-adventures.com. Nothing is imported, uploaded to Document Authoring, previewed remotely or published.
- Crawling stays on wknd-adventures.com, with a limit on depth and page count.
- This step doesn't create any block code or content.
- If the site blocks automated access, a backup scraping method is tried. If that also fails, discovery stops and I'll report it.

## Checklist
- [ ] Switch to Execute mode so discovery can run
- [ ] Look for the sitemap or sitemap index for `https://wknd-adventures.com/` (robots.txt, /sitemap.xml)
- [ ] Collect every URL the sitemap lists
- [ ] Check the sitemap against the homepage navigation and footer links to see if anything is missing
- [ ] If the sitemap is missing or incomplete, crawl from the homepage and add the crawled URLs
- [ ] Filter to main-locale pages only, without language/regional paths, duplicates, redirects or assets
- [ ] Choose a representative sample of pages to analyze
- [ ] Analyze the sampled pages for structure and sections
- [ ] Group all pages into templates (layouts)
- [ ] Describe and name each template's blocks and match them to the block library
- [ ] Create the site catalog (templates, pages, blocks, variants)
- [ ] Summarize: URL count, template count, pages per template, shared and unique blocks
- [ ] Flag pages that don't fit a template, and blocks that need a decision

## Notes
- **Discovery needs Execute mode.** Plan mode can only update this plan.
- After discovery you can review and adjust the catalog (rename, merge or split templates and blocks) before migration starts.
- The earlier valtech.com plans in this project are separate. This plan only covers wknd-adventures.com.
