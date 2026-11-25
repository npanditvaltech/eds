# Library setup prompt

Reusable prompt for setting up the Document Authoring library (blocks, templates, icons) on a site.

**Before you use it:** turn on "Allow LLM to use my Adobe credentials…" in Settings → LLM Permissions. Keep the approval line so uploads go through in one step. To set up only part of the library, delete the sections you don't need.

```text
Set up the DA library for this site (blocks, templates, icons) per the aem.live
"Set up library" docs. I approve uploading everything below to DA under /library and
adding Blocks, Templates and Icons rows to the "library" tab of the DA project config.
Don't preview or publish.

1. Blocks: one page per block at library/blocks/<block> (default + "block (variant)"
   variants, plus a library-metadata description). Skip header, footer and blocks
   that can't render. Sheet library/blocks.json: name, path.
2. Templates: one page per real page template at library/templates/<template>, with
   its sections, blocks, section styles and metadata, using placeholder content.
   Sheet library/templates.json: key, value.
3. Icons: upload the site's icons folder to library/icons/. Sheet library/icons.json:
   key (name), icon (DA link to the SVG).
4. Config: keep all existing tabs and rows. Library rows (title, path, format) point to
   each sheet; Icons uses format :<content>:.
5. Check the pages in local preview, keep local in sync, read everything back from DA,
   then summarize what was created, what was skipped and which surfaces changed.
```
