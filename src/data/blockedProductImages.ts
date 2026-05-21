import raw from "../../scraped/products.json";

/** Vendor logo / generic placeholders — never show these as product photos. */
const BLOCKED_URL_PATTERNS = [
  /baluka/i,
  /\bbem\b/i,
  /_bem[._-]/i,
  /bem-premium/i,
  /bem_premium/i,
  /placeholder/i,
  /default[-_]?(image|product)/i,
  /no[-_]?image/i,
  // Baluka curved text logo (single-use placeholder)
  /image_e524d5bb-4191-45a3-8a3d-4a3b429a81bf/i,
  // BEM full logo & store default WhatsApp uploads reused across SKUs
  /WhatsAppImage2025-12-01at7\.41\.18PM/i,
  /WhatsApp_Image_2026-04-29_at_11\.10\.57_PM_1/i,
  /image_2_7c4787b4-67a7-4c88-ab77-c9a1db95bba6/i,
  /file_000000004d5c720893e223a6064bf210/i,
];

function isBlockedByPattern(url: string): boolean {
  return BLOCKED_URL_PATTERNS.some((re) => re.test(url));
}

/** URLs reused across multiple products are store-wide placeholders. */
function buildBlockedUrlSet(): Set<string> {
  const counts = new Map<string, number>();

  for (const p of raw.products) {
    const url = p.imageUrl?.trim();
    if (!url) continue;
    counts.set(url, (counts.get(url) ?? 0) + 1);
  }

  const blocked = new Set<string>();

  for (const [url, count] of counts) {
    if (count >= 2 || isBlockedByPattern(url)) {
      blocked.add(url);
    }
  }

  return blocked;
}

export const BLOCKED_PRODUCT_IMAGE_URLS = buildBlockedUrlSet();

export function isBlockedProductImage(url: string): boolean {
  return BLOCKED_PRODUCT_IMAGE_URLS.has(url) || isBlockedByPattern(url);
}
