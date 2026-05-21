import { Minus, Plus } from "lucide-react";
import { useMemo } from "react";
import type { Product } from "../data/site";
import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";

type B2BProductCardProps = {
  product: Product;
};

function formatDescription(description?: string, tiers?: Product["tiers"]) {
  if (description?.trim()) {
    return description.replace(/^Quantity and Rates?:\n?/i, "").trim();
  }
  if (!tiers?.length) return "";
  return tiers.map((t) => `${t.qty}: ₹${t.price}`).join("\n");
}

export function B2BProductCard({ product }: B2BProductCardProps) {
  const { items, setQty } = useCart();
  const minQty = product.minQty ?? 1;

  const cartItem = items.find((i) => i.product.id === product.id);
  const qty = cartItem?.qty ?? 0;
  const tierIndex = cartItem?.tierIndex ?? 0;
  const unitPrice = product.tiers[tierIndex]?.price ?? product.tiers[0]?.price ?? 0;

  const description = useMemo(
    () => formatDescription(product.description, product.tiers),
    [product.description, product.tiers],
  );

  const handleAdd = () => setQty(product, minQty);
  const handlePlus = () => setQty(product, qty + 1);
  const handleMinus = () => {
    if (qty <= minQty) setQty(product, 0);
    else setQty(product, qty - 1);
  };

  const handleInput = (value: string) => {
    const n = parseInt(value, 10);
    if (Number.isNaN(n) || n <= 0) {
      setQty(product, 0);
      return;
    }
    setQty(product, Math.max(n, minQty));
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm transition-shadow hover:shadow-md">
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square overflow-hidden bg-surface-elevated"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-2"
        />
      </a>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {description && (
          <pre className="mt-2 flex-1 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted">
            {description}
          </pre>
        )}

        <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
          {qty === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-on-brand hover:bg-brand-dim transition-colors"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMinus}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-elevated"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={minQty}
                value={qty}
                onChange={(e) => handleInput(e.target.value)}
                className="h-9 w-12 rounded-lg border border-border bg-surface text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={handlePlus}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-elevated"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="ml-2 text-sm font-semibold text-brand">₹{unitPrice}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
