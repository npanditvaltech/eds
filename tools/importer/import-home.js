/* eslint-disable */
/* global WebImporter */

// Parsers
import heroFullbleedParser from './parsers/hero-fullbleed.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import tabsCardsParser from './parsers/tabs-cards.js';
import cardsTickerParser from './parsers/cards-ticker.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import heroCtaParser from './parsers/hero-cta.js';

// Transformers
import wkndAdventuresCleanupTransformer from './transformers/wknd-adventures-cleanup.js';
import wkndAdventuresSectionsTransformer from './transformers/wknd-adventures-sections.js';

const PAGE_TEMPLATE = {
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

const parsers = {
  'hero-fullbleed': heroFullbleedParser,
  'columns-feature': columnsFeatureParser,
  'tabs-cards': tabsCardsParser,
  'cards-ticker': cardsTickerParser,
  'accordion-faq': accordionFaqParser,
  'cards-gallery': cardsGalleryParser,
  'hero-cta': heroCtaParser,
};

const transformers = [
  wkndAdventuresCleanupTransformer,
  wkndAdventuresSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
