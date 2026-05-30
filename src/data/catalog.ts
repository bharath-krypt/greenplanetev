import raw from "../../scraped/products.json";
import { resolveProductImage } from "../utils/productImage";
import { withDescriptionQtyLabels } from "../utils/productPricing";
import type { PriceTier, Product } from "./site";

type ScrapedVariant = {
  id: number;
  title: string;
  price: number;
  sku: string | null;
  available: boolean;
};

type ScrapedProduct = {
  id: string;
  shopifyId: number;
  name: string;
  handle: string;
  url: string;
  categories: string[];
  categoryHandles: string[];
  description: string;
  tiers: PriceTier[];
  imageUrl: string;
  available: boolean;
  variants: ScrapedVariant[];
};

type ScrapedCollection = {
  title: string;
  handle: string;
  productsCount: number;
};

const data = raw as {
  collections: ScrapedCollection[];
  products: ScrapedProduct[];
};

export type Collection = ScrapedCollection & {
  productIds: string[];
};

/** Site-wide price adjustment applied when loading catalog tiers. */
export const PRICE_MARKUP = 1.1;

function applyPriceMarkup(tiers: PriceTier[]): PriceTier[] {
  return tiers.map((tier) => ({
    ...tier,
    price: Math.round(tier.price * PRICE_MARKUP),
  }));
}

/** Minimum order qty from the first bulk tier label (e.g. "01–05" → 1, "02 Pcs - 05" → 2). */
export function parseMinQty(tiers: PriceTier[]): number {
  const label = tiers[0]?.qty ?? "";
  const match = label.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/** Pick the best bulk tier for a cart quantity. */
export function tierIndexForQty(tiers: PriceTier[], qty: number): number {
  let best = 0;
  for (let i = 0; i < tiers.length; i++) {
    const min = parseMinQty([tiers[i]]);
    if (qty >= min) best = i;
  }
  return best;
}

function resolveTiers(description: string, tiers: PriceTier[]): PriceTier[] {
  const markedUp = applyPriceMarkup(tiers);
  return withDescriptionQtyLabels(description, markedUp);
}

function toProduct(p: ScrapedProduct): Product {
  const variant = p.variants[0];
  const tiers =
    p.tiers.length > 0
      ? resolveTiers(p.description, p.tiers)
      : applyPriceMarkup([{ qty: "1 pc", price: variant?.price ?? 0 }]);

  return {
    id: p.id,
    name: p.name,
    category: p.categoryHandles[0] ?? "other",
    image: resolveProductImage(p.imageUrl),
    tiers,
    rating: 4.5,
    reviews: 0,
    description: p.description,
    minQty: parseMinQty(tiers),
    shopifyId: String(p.shopifyId),
    variantId: variant ? String(variant.id) : undefined,
    available: p.available,
  };
}

/** Same-category products for the detail spotlight (excludes the current SKU). */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const rest = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category !== product.category,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export const ALL_PRODUCTS: Product[] = data.products
  .filter((p) => p.available !== false)
  .map(toProduct);

const productsById = new Map(ALL_PRODUCTS.map((p) => [p.id, p]));

const collectionMap = new Map<string, Collection>();
for (const c of data.collections) {
  collectionMap.set(c.handle, { ...c, productIds: [] });
}

const unassigned: string[] = [];

for (const p of data.products) {
  if (p.available === false) continue;
  const handles = p.categoryHandles?.length ? p.categoryHandles : [];
  if (handles.length === 0) {
    unassigned.push(p.id);
    continue;
  }
  for (const handle of handles) {
    const col = collectionMap.get(handle);
    if (col && !col.productIds.includes(p.id)) {
      col.productIds.push(p.id);
    }
  }
}

if (unassigned.length > 0) {
  collectionMap.set("other", {
    title: "More parts",
    handle: "other",
    productsCount: unassigned.length,
    productIds: unassigned,
  });
}

export const COLLECTIONS: Collection[] = [
  ...data.collections
    .map((c) => collectionMap.get(c.handle))
    .filter((c): c is Collection => !!c && c.productIds.length > 0),
  ...(collectionMap.has("other") ? [collectionMap.get("other")!] : []),
];

export const TOTAL_PRODUCTS = ALL_PRODUCTS.length;

export function getProduct(id: string): Product | undefined {
  return productsById.get(id);
}

export function getCollectionProducts(handle: string): Product[] {
  const col = collectionMap.get(handle);
  if (!col) return [];
  return col.productIds
    .map((id) => productsById.get(id))
    .filter((p): p is Product => !!p);
}

export function searchProducts(query: string, limit = 50): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_PRODUCTS.slice(0, limit);
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category.includes(q),
  ).slice(0, limit);
}
