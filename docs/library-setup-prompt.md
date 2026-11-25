# Library setup prompt

A reusable prompt for setting up the Document Authoring library (blocks, templates and icons) on a site.

## Before you use it

- In **Settings → LLM Permissions**, turn on "Allow LLM to use my Adobe credentials for admin.hlx.page and Document Authoring uploads".
- Keep the approval wording in the prompt. It lets the uploads go through in one step; without it, each upload stops and asks you to confirm.
- You don't need to fill in `{org}/{site}`. The site's Document Authoring location is looked up automatically.
- To set up only part of the library, delete the sections you don't need and remove the matching rows from the config list in step 4.
- Placeholders are left out on purpose. They also need a change to the site code before they show correctly on published pages.

## Prompt

```text
Set up the Document Authoring library for this site (blocks, templates and icons),
following the aem.live "Set up library" docs (/docs/ew/administering/set-up-library).

I explicitly approve these changes to Document Authoring (DA) for this request:
- upload the library block pages, template pages, their images, the icon SVGs and the
  blocks, templates and icons sheets to DA under /library
- add a "library" tab to the DA project config with Blocks, Templates and Icons rows.
Do NOT preview or publish anything to EDS preview or live.

1. Blocks
   - For each block in the site code, create a library page at library/blocks/<block>:
     the default version plus every style variant, with the heading row written as
     "block (variant)". Base the samples on real usage in the imported pages, using
     placeholder images and short neutral text where needed.
   - Add a library-metadata block (name, description) after each block so authors
     know when to use it.
   - Skip header, footer and any block that can't render a working sample, and tell
     me which ones you skipped and why.
   - Create the blocks sheet library/blocks.json with columns "name" and "path", where
     path is https://content.da.live/{org}/{site}/library/blocks/<block>.

2. Templates
   - Create one template page per real page template at library/templates/<template>.
     Copy the structure of its representative page: every section in order, its blocks,
     section-metadata styles and the metadata block. Use placeholder text and images
     only. Skip stub pages.
   - Create the templates sheet library/templates.json with columns "key" (the name
     shown to authors) and "value" (https://content.da.live/{org}/{site}/library/templates/<template>).

3. Icons
   - Use the SVGs in the site code's icons folder. Upload each one to library/icons/<name>.svg.
   - Create the icons sheet library/icons.json with columns "key" (the icon name, no
     colons) and "icon" (the link to that SVG in DA).

4. Project config
   - Read the current DA project config first and keep every existing tab and row.
   - Add or update the "library" tab with columns title, path and format, and these rows:
     Blocks    -> https://content.da.live/{org}/{site}/library/blocks.json
     Templates -> https://content.da.live/{org}/{site}/library/templates.json
     Icons     -> https://content.da.live/{org}/{site}/library/icons.json   (format: :<content>:)

5. Verify and report
   - Check every block and template page in the local preview before uploading.
   - Keep the local workspace in sync with everything you upload.
   - After uploading, read back each page, sheet and the config from DA to confirm
     they saved correctly.
   - Finish with a summary: what was created, what was skipped, and which surfaces
     changed (local, DA, preview, live).
```
