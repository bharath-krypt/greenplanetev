import type { CartItem } from "../context/CartContext";

const RULE = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

function formatINR(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

function isBulkInquiry(unitPrice: number): boolean {
  return unitPrice <= 0;
}

export function buildWhatsAppOrderMessage(items: CartItem[]): string {
  if (items.length === 0) return "";

  const lines: string[] = [
    `${RULE} *NEW ORDER REQUEST* ${RULE}`,
    "",
  ];

  let subtotal = 0;
  let hasBulkInquiry = false;

  items.forEach((item, index) => {
    const tier = item.product.tiers[item.tierIndex];
    const unitPrice = tier?.price ?? 0;
    const bulk = isBulkInquiry(unitPrice);
    const lineTotal = unitPrice * item.qty;

    if (bulk) hasBulkInquiry = true;
    else subtotal += lineTotal;

    lines.push(`*${index + 1}. ${item.product.name}*`);
    lines.push(`├ Quantity: ${item.qty}`);

    if (bulk) {
      lines.push(`└ Price: *BULK INQUIRY*`);
    } else {
      lines.push(`├ Unit Price: ${formatINR(unitPrice)}`);
      lines.push(`└ Line Total: ${formatINR(lineTotal)}`);
    }
    lines.push("");
  });

  lines.push(RULE);
  lines.push(`*SUBTOTAL: ${formatINR(subtotal)}*`);
  if (hasBulkInquiry) {
    lines.push(`*(Excluding bulk inquiry items)*`);
  }
  lines.push(RULE);
  lines.push("");
  lines.push("_Please confirm pricing and availability_");

  return lines.join("\n").trimEnd();
}
