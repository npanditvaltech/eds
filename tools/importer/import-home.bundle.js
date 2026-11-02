/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-fullbleed.js
  function parse(element, { document }) {
    const cells = [];
    const img = element.querySelector(".hero-bg img, img");
    if (img) {
      const bg = document.createElement("img");
      bg.src = img.getAttribute("src");
      bg.alt = img.getAttribute("alt") || "";
      cells.push([bg]);
    } else {
      cells.push([""]);
    }
    const content = [];
    const scope = element.querySelector(".hero-content-inner, .hero-content") || element;
    const eyebrow = scope.querySelector("p.tag");
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      content.push(p);
    }
    const heading = scope.querySelector("h1, h2");
    if (heading) content.push(heading);
    const lead = scope.querySelector("p.hero-lead, p.paragraph-xl");
    if (lead) content.push(lead);
    scope.querySelectorAll(".button-group a[href]").forEach((a) => {
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent.trim();
      const isSecondary = /ghost|secondary/.test(a.className);
      const wrap = document.createElement(isSecondary ? "em" : "strong");
      wrap.append(link);
      const p = document.createElement("p");
      p.append(wrap);
      content.push(p);
    });
    cells.push([content]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-fullbleed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document }) {
    const imgSrc = element.querySelector(".featured-article-image img, img");
    const imageCell = [];
    if (imgSrc) {
      const img = document.createElement("img");
      img.src = imgSrc.getAttribute("src");
      img.alt = imgSrc.getAttribute("alt") || "";
      imageCell.push(img);
    }
    const textScope = [...element.children].find((c) => !c.classList.contains("featured-article-image")) || element;
    const textCell = [];
    const tag = textScope.querySelector("p.tag");
    if (tag) {
      const p = document.createElement("p");
      p.textContent = tag.textContent.trim();
      textCell.push(p);
    }
    const heading = textScope.querySelector("h1, h2, h3");
    if (heading) textCell.push(heading);
    textScope.querySelectorAll("p:not(.tag)").forEach((p) => {
      if (p.textContent.trim() && !p.closest(".featured-article-footer")) textCell.push(p);
    });
    textScope.querySelectorAll(".featured-article-footer a[href]").forEach((a) => {
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent.trim();
      const strong = document.createElement("strong");
      strong.append(link);
      const p = document.createElement("p");
      p.append(strong);
      textCell.push(p);
    });
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-cards.js
  function parse3(element, { document }) {
    const cells = [];
    const labels = [...element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button")].filter((b, i, arr) => arr.indexOf(b) === i).map((b) => b.textContent.trim());
    const panes = [...element.querySelectorAll(".tab-pane")];
    panes.forEach((pane, i) => {
      let label = labels[i];
      if (!label) {
        const id = (pane.id || "").replace(/^tab-/, "");
        label = id ? id.charAt(0).toUpperCase() + id.slice(1) : `Tab ${i + 1}`;
      }
      const content = [];
      pane.querySelectorAll(".article-card").forEach((card) => {
        const href = card.getAttribute("href") || card.querySelector("a[href]") && card.querySelector("a[href]").getAttribute("href");
        const srcImg = card.querySelector(".article-card-image img, img");
        if (srcImg) {
          const img = document.createElement("img");
          img.src = srcImg.getAttribute("src");
          img.alt = srcImg.getAttribute("alt") || "";
          content.push(img);
        }
        const tag = card.querySelector(".article-card-meta .tag, .tag");
        if (tag && tag.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = tag.textContent.trim();
          content.push(p);
        }
        const srcHeading = card.querySelector("h1, h2, h3, h4, h5, h6");
        if (srcHeading) {
          const h3 = document.createElement("h3");
          if (href) {
            const a = document.createElement("a");
            a.href = href;
            a.textContent = srcHeading.textContent.trim();
            h3.append(a);
          } else {
            h3.textContent = srcHeading.textContent.trim();
          }
          content.push(h3);
        }
        const desc = card.querySelector(".article-card-body p");
        if (desc && desc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          content.push(p);
        }
      });
      cells.push([label, content]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-ticker.js
  function parse4(element, { document }) {
    const root = element.closest && element.closest(".ticker-strip") || element;
    if (!root.parentNode) return;
    const track = root.querySelector(".ticker-track") || root;
    let rawLabels = [...track.querySelectorAll("span:not(.ticker-sep)")].map((s) => s.textContent);
    if (!rawLabels.length) {
      rawLabels = track.textContent.split(/[·•\n\r]+/);
    }
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    rawLabels.forEach((raw) => {
      const text = raw.replace(/\s+/g, " ").trim();
      if (!text || /^[·•|\-–—]+$/.test(text)) return;
      const key = text.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      cells.push([text]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-ticker", cells });
    root.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const cells = [];
    element.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-question");
      const question = q ? q.textContent.replace(/\s+/g, " ").trim() : "";
      if (!question) return;
      const a = item.querySelector(".faq-answer");
      const answer = [];
      if (a) {
        const blockChildren = [...a.children].filter((c) => /^(P|UL|OL|H[1-6]|TABLE|BLOCKQUOTE)$/.test(c.tagName));
        if (blockChildren.length) {
          answer.push(...blockChildren);
        } else if (a.textContent.trim()) {
          const p = document.createElement("p");
          p.append(...a.childNodes);
          answer.push(p);
        }
      }
      cells.push([question, answer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse6(element, { document }) {
    if (!element.parentNode) return;
    const sources = [...element.querySelectorAll("img")];
    const next = element.nextElementSibling;
    const nextIsWideTile = next && next.classList.contains("utility-margin-top-lg") && next.querySelector("img") && !next.textContent.trim();
    if (nextIsWideTile) {
      sources.push(...next.querySelectorAll("img"));
    }
    const cells = [];
    sources.forEach((src) => {
      const img = document.createElement("img");
      img.src = src.getAttribute("src");
      img.alt = src.getAttribute("alt") || "";
      cells.push([img, ""]);
    });
    if (nextIsWideTile) next.remove();
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse7(element, { document }) {
    const content = [];
    const heading = element.querySelector("h1, h2, h3");
    if (heading) content.push(heading);
    element.querySelectorAll(":scope > p, :scope > div:not(.button-group) > p").forEach((p) => {
      if (p.textContent.trim()) content.push(p);
    });
    element.querySelectorAll(".button-group a[href]").forEach((a) => {
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent.trim();
      const isSecondary = /ghost|secondary/.test(a.className);
      const wrap = document.createElement(isSecondary ? "em" : "strong");
      wrap.append(link);
      const p = document.createElement("p");
      p.append(wrap);
      content.push(p);
    });
    const cells = [[content]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-adventures-cleanup.js
  function absolutizeImages(element, payload) {
    const base = payload.params && payload.params.originalURL || payload.url;
    if (!base) return;
    element.querySelectorAll("img[src]").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return;
      try {
        img.setAttribute("src", new URL(src, base).toString());
      } catch (e) {
      }
    });
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      absolutizeImages(element, payload);
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "nav.nav-menu",
        "#nav-menu",
        ".nav-megamenu",
        ".nav-mobile-menu-button",
        "footer.footer.inverse-footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "noscript",
        "link",
        'iframe[src*="googletagmanager"]'
      ]);
    }
    if (hookName === "afterTransform") {
      absolutizeImages(element, payload);
      const doc = element.ownerDocument;
      element.querySelectorAll(".button-group").forEach((group) => {
        const paras = [...group.querySelectorAll("a")].map((a) => {
          const p = doc.createElement("p");
          const wrap = doc.createElement(a.classList.contains("button--ghost") ? "em" : "strong");
          wrap.append(a);
          p.append(wrap);
          return p;
        });
        group.replaceWith(...paras);
      });
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        ".nav-megamenu",
        "footer.footer",
        "script",
        "style",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("data-track") || n.startsWith("data-analytics") || n.startsWith("data-gtm") || n === "onclick" || n === "onload") {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/wknd-adventures-sections.js
  var MARKER = "data-excat-section-id";
  function findSection(root, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (sections.length < 2) return;
    const document = element.ownerDocument || payload.document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSection(element, section.selector);
        if (!el) continue;
        if (section.style) el.setAttribute(`${MARKER}-el`, section.id);
        if (i > 0 || section.style) {
          const hr = document.createElement("hr");
          if (section.style) hr.setAttribute(MARKER, section.id);
          if (i === 0) hr.setAttribute(`${MARKER}-first`, "true");
          el.parentNode.insertBefore(hr, el);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const surviving = element.querySelector(`[${MARKER}-el="${section.id}"]`);
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        const anchor = surviving || marker;
        if (!anchor) continue;
        const metadata = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadata);
      }
      element.querySelectorAll(`[${MARKER}-el]`).forEach((el) => el.removeAttribute(`${MARKER}-el`));
      element.querySelectorAll(`hr[${MARKER}-first]`).forEach((hr) => hr.remove());
      element.querySelectorAll(`[${MARKER}]`).forEach((el) => el.removeAttribute(MARKER));
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    "name": "home",
    "urls": [
      "https://wknd-adventures.com/"
    ],
    "representativeUrl": "https://wknd-adventures.com/",
    "description": "WKND Adventures homepage: full-bleed hero, featured article, activity tabs, ticker, start-here CTA band, FAQ, how-we-work editorial index, field gallery and closing CTA",
    "urlPattern": "/",
    "blocks": [
      {
        "name": "hero-fullbleed",
        "instances": [
          "section.hero-section.hero-section--full",
          "section.hero-section"
        ]
      },
      {
        "name": "columns-feature",
        "instances": [
          "section.secondary-section .featured-article",
          ".featured-article"
        ]
      },
      {
        "name": "tabs-cards",
        "instances": [
          ".tab-container.tab-container--wide",
          ".tab-container"
        ]
      },
      {
        "name": "cards-ticker",
        "instances": [
          "div.ticker-strip",
          ".ticker-track"
        ]
      },
      {
        "name": "accordion-faq",
        "instances": [
          ".faq-list"
        ]
      },
      {
        "name": "cards-gallery",
        "instances": [
          "section.inverse-section .grid-images",
          ".grid-layout.grid-images"
        ]
      },
      {
        "name": "hero-cta",
        "instances": [
          "section.accent-section .container.utility-text-align-center",
          "section.accent-section .container"
        ]
      }
    ],
    "sections": [
      {
        "id": "rc1",
        "name": "Hero",
        "selector": [
          "#main-content > section.hero-section.hero-section--full",
          "section.hero-section"
        ],
        "style": null,
        "blocks": [
          "hero-fullbleed"
        ],
        "defaultContent": []
      },
      {
        "id": "rc2",
        "name": "Featured Article",
        "selector": [
          "section.secondary-section:has(.featured-article)",
          "#main-content > section.section.secondary-section:nth-of-type(2)"
        ],
        "style": "beige",
        "blocks": [
          "columns-feature"
        ],
        "defaultContent": []
      },
      {
        "id": "rc3",
        "name": "Browse by Activity",
        "selector": [
          "section.section:has(.tab-container)",
          "#main-content > section.section:nth-of-type(3)"
        ],
        "style": null,
        "blocks": [
          "tabs-cards"
        ],
        "defaultContent": [
          ".section-heading h2"
        ]
      },
      {
        "id": "rc4",
        "name": "Activity Ticker",
        "selector": [
          "#main-content > div.ticker-strip",
          "div.ticker-strip"
        ],
        "style": null,
        "blocks": [
          "cards-ticker"
        ],
        "defaultContent": []
      },
      {
        "id": "rc5",
        "name": "Start Here",
        "selector": [
          "section.inverse-section:has(.container--narrow)",
          "#main-content > section.section.inverse-section:nth-of-type(4)"
        ],
        "style": "dark",
        "blocks": [],
        "defaultContent": [
          ".container--narrow > p.tag",
          ".container--narrow > h2",
          ".container--narrow > p.paragraph-lg",
          ".container--narrow > .button-group"
        ]
      },
      {
        "id": "rc6",
        "name": "Quick Answers",
        "selector": [
          "section.section:has(.faq-list)",
          "#main-content > section.section:nth-of-type(5)"
        ],
        "style": null,
        "blocks": [
          "accordion-faq"
        ],
        "defaultContent": [
          ".section-heading h2"
        ]
      },
      {
        "id": "rc7",
        "name": "How We Work",
        "selector": [
          "section.secondary-section:has(.editorial-index)",
          "#main-content > section.section.secondary-section:nth-of-type(6)"
        ],
        "style": "beige",
        "blocks": [],
        "defaultContent": [
          ".section-heading h2",
          ".editorial-index"
        ]
      },
      {
        "id": "rc8",
        "name": "In the Field",
        "selector": [
          "section.inverse-section:has(.grid-images)",
          "#main-content > section.section.inverse-section:nth-of-type(7)"
        ],
        "style": "dark",
        "blocks": [
          "cards-gallery"
        ],
        "defaultContent": [
          ".section-heading h2",
          ".section-heading a.text-button"
        ]
      },
      {
        "id": "rc9",
        "name": "Closing CTA",
        "selector": [
          "#main-content > section.section.accent-section",
          "section.accent-section"
        ],
        "style": "orange, centered",
        "blocks": [
          "hero-cta"
        ],
        "defaultContent": []
      }
    ]
  };
  var parsers = {
    "hero-fullbleed": parse,
    "columns-feature": parse2,
    "tabs-cards": parse3,
    "cards-ticker": parse4,
    "accordion-faq": parse5,
    "cards-gallery": parse6,
    "hero-cta": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
