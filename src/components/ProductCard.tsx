import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "../data/site";
import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [tierIndex, setTierIndex] = useState(0);
  const price = product.tiers[tierIndex]?.price ?? 0;

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-surface-card overflow-hidden hover:border-brand/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-brand text-on-brand text-xs font-bold">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1 text-amber-400 mb-2">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs text-muted">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {product.name}
        </h3>
        {product.compatible && (
          <p className="text-xs text-muted mt-2">
            Fits: {product.compatible.join(", ")}
          </p>
        )}
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted font-medium">Bulk pricing</p>
          <div className="flex flex-wrap gap-1.5">
            {product.tiers.map((tier, i) => (
              <button
                key={tier.qty}
                type="button"
                onClick={() => setTierIndex(i)}
                className={`px-2 py-1 rounded-md text-xs transition-colors ${
                  tierIndex === i
                    ? "bg-brand/20 text-brand border border-brand/40"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                {tier.qty}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted">From</p>
            <p className="text-xl font-bold text-brand">₹{price}</p>
          </div>
          <button
            type="button"
            onClick={() => addItem(product, tierIndex)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand text-on-brand text-sm font-semibold hover:bg-brand-dim transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
