// app/config/tools.config.ts

export type ToolGroupId = 'calculators' | 'finance' | 'listing' | 'operations';

export interface ToolItem {
  slug: string;     // folder name under /app
  label: string;    // visible name
  desc?: string;    // short description
  group: ToolGroupId;
}

export const TOOL_GROUPS: Record<ToolGroupId, string> = {
  calculators: 'Calculators',
  finance: 'Finance',
  listing: 'Listing Tools',
  operations: 'Operations',
};

export const TOOLS: ToolItem[] = [
  // --- Calculators ---
  { slug: 'calculator',        label: 'Profit & RTO',        desc: 'Net margin & RTO impact',    group: 'calculators' },
  { slug: 'ppc-calculator',    label: 'PPC / Ads',           desc: 'ACOS, ROAS & breakeven',     group: 'calculators' },
  { slug: 'volumetric',        label: 'Volumetric Weight',   desc: 'Courier chargeable weight',  group: 'calculators' },
  { slug: 'odr-calculator',    label: 'Account Health (ODR)',desc: 'Order defect rate monitor',  group: 'calculators' },
  { slug: 'volume-calculator', label: 'Price vs Volume',     desc: 'Price elasticity sandbox',   group: 'calculators' },
  { slug: 'influencer-roi',    label: 'Influencer ROI',      desc: 'Campaign performance math',  group: 'calculators' },

  // --- Finance ---
  { slug: 'price-finder',        label: 'Target Price Finder', desc: 'Reverse-calc ideal price', group: 'finance' },
  { slug: 'price-matcher',       label: 'Price Matcher',       desc: 'Competitor comparison',    group: 'finance' },
  { slug: 'bundle-calculator',   label: 'Bundle Profit',       desc: 'Kit & combo margin',       group: 'finance' },
  { slug: 'landed-cost',         label: 'Landed Cost',         desc: 'Import duty & freight',    group: 'finance' },
  { slug: 'storage-fee-planner', label: 'Storage Fee Planner', desc: 'Monthly warehouse fees',   group: 'finance' },
  { slug: 'ltsf-calculator',     label: 'LTSF Calculator',     desc: 'Long-term storage impact', group: 'finance' },

  // --- Listing Tools ---
  { slug: 'keywords',         label: 'Keyword Explorer',   desc: 'Seed & long-tail ideas',     group: 'listing' },
  { slug: 'keyword-density',  label: 'Keyword Density',    desc: 'Competitor copy coverage',   group: 'listing' },
  { slug: 'keyword-mixer',    label: 'Keyword Mixer',      desc: 'Phrase / exact mixing',      group: 'listing' },
  { slug: 'title-optimizer',  label: 'Title Optimizer',    desc: 'SEO-optimized titles',       group: 'listing' },
  { slug: 'bullet-builder',   label: 'Bullet Builder',     desc: 'Benefits & feature bullets', group: 'listing' },
  { slug: 'html-formatter',   label: 'HTML Formatter',     desc: 'Clean product descriptions', group: 'listing' },
  { slug: 'lqs-checker',      label: 'LQS Checker',        desc: 'Basic listing audit',        group: 'listing' },
  { slug: 'sku-generator',    label: 'SKU Generator',      desc: 'Smart custom SKUs',          group: 'listing' },
  { slug: 'ab-test',          label: 'A/B Test Calculator',desc: 'Statistical significance',   group: 'listing' },

  // --- Operations ---
  { slug: 'inventory-planner', label: 'Inventory Planner',      desc: 'Replenishment planning', group: 'operations' },
  { slug: 'deal-planner',      label: 'Deal / Discount Planner',desc: 'Promo impact planning',  group: 'operations' },
  { slug: 'qr-generator',      label: 'QR Generator',           desc: 'QR codes for inserts',   group: 'operations' },
  { slug: 'cbm-calculator',    label: 'CBM Calculator',         desc: 'Carton CBM & freight',   group: 'operations' },
  { slug: 'barcode-generator', label: 'Barcode Generator',      desc: 'FNSKU / UPC labels',     group: 'operations' },
];
