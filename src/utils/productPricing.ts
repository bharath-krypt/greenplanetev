import type { PriceTier, Product } from "../data/site";

const PRICE_LINE =
  /(?:^|\s)(?:Rs\.?|₹)\s*[\d,]+(?:\.\d+)?|:\s*(?:Rs\.?|₹)\s*[\d,]+(?:\.\d+)?/i;

const GENERIC_QTY = /^per unit$/i;

/** Pull qty-range labels from description (supports single-line and multi-line). */
function extractQtyLabelsFromDescription(description: string): string[] {
  const text = description
    .replace(/^Quantity and (?:Rates?|Price):?\s*/im, "")
    .trim();
  if (!text) return [];

  const labels: string[] = [];
  const re = /([^:\n]+?)\s*:\s*(?:Rs\.?|₹)\s*[\d,]+(?:\.\d+)?/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const label = match[1].trim();
    if (label && !/^quantity/i.test(label)) labels.push(label);
  }
  return labels;
}

/** Use qty labels from description when scraped tiers only say "per unit". */
export function withDescriptionQtyLabels(
  description: string | undefined,
  tiers: PriceTier[],
): PriceTier[] {
  if (!description?.trim() || tiers.length === 0) return tiers;

  const labels = extractQtyLabelsFromDescription(description);
  const genericQty = tiers.every((t) => GENERIC_QTY.test(t.qty.trim()));
  if (!genericQty || labels.length === 0) return tiers;

  return tiers.map((tier, i) => ({ ...tier, qty: labels[i] ?? tier.qty }));
}

export function getDisplayTiers(
  description: string | undefined,
  tiers: PriceTier[],
): PriceTier[] {
  const mapped = withDescriptionQtyLabels(description, tiers);
  return mapped.filter((t) => !GENERIC_QTY.test(t.qty.trim()));
}

/** Non-price lines from the scraped description (specs, notes, etc.). */
export function getProductNotes(description: string | undefined): string | undefined {
  if (!description?.trim()) return undefined;

  const notes = description
    .replace(/^Quantity and (?:Rates?|Price):?\s*/im, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !PRICE_LINE.test(line))
    .join("\n")
    .trim();

  return notes || undefined;
}

export function formatCardBody(description: string | undefined, tiers: Product["tiers"]): string {
  const displayTiers = getDisplayTiers(description, tiers);
  const pricing =
    displayTiers.length > 0
      ? displayTiers
          .map((t) => `${t.qty}: ₹${t.price.toLocaleString("en-IN")}`)
          .join("\n")
      : "";

  const notes = getProductNotes(description);
  if (notes && pricing) return `${notes}\n\n${pricing}`;
  return pricing || notes || "";
}
