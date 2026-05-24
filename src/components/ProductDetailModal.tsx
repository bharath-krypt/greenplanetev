import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { getRelatedProducts } from "../data/catalog";
import { useCart } from "../context/CartContext";
import { useProductDetail } from "../context/ProductDetailContext";
import { getDisplayTiers, getProductNotes } from "../utils/productPricing";
import { ProductImage } from "./ProductImage";

export function ProductDetailModal() {
  const { product, closeProduct, openProduct } = useProductDetail();
  const { items, setQty } = useCart();

  const related = useMemo(
    () => (product ? getRelatedProducts(product, 4) : []),
    [product],
  );

  const displayTiers = useMemo(
    () => (product ? getDisplayTiers(product.description, product.tiers) : []),
    [product],
  );

  const notes = useMemo(
    () => (product ? getProductNotes(product.description) : undefined),
    [product],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProduct();
    };
    if (product) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, closeProduct]);

  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [product]);

  const cartItem = product ? items.find((i) => i.product.id === product.id) : undefined;
  const qty = cartItem?.qty ?? 0;
  const minQty = product?.minQty ?? 1;
  const tierIndex = cartItem?.tierIndex ?? 0;
  const unitPrice = product?.tiers[tierIndex]?.price ?? product?.tiers[0]?.price ?? 0;

  const handleAdd = () => {
    if (!product) return;
    setQty(product, minQty);
  };

  const handlePlus = () => {
    if (!product) return;
    setQty(product, qty + 1);
  };

  const handleMinus = () => {
    if (!product) return;
    if (qty <= minQty) setQty(product, 0);
    else setQty(product, qty - 1);
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[var(--color-overlay)] backdrop-blur-sm"
            onClick={closeProduct}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="fixed inset-x-4 top-[10vh] z-[100] mx-auto flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl sm:inset-x-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
              <h2
                id="product-detail-title"
                className="pr-2 font-display text-lg font-bold leading-snug sm:text-xl"
              >
                {product.name}
              </h2>
              <button
                type="button"
                onClick={closeProduct}
                className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain">
              <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:p-5">
                <div className="aspect-square overflow-hidden rounded-xl border border-border bg-surface">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-3"
                  />
                </div>

                <div className="flex flex-col">
                  {notes && (
                    <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                      {notes}
                    </p>
                  )}

                  {displayTiers.length > 0 && (
                    <div className="rounded-xl border border-border bg-surface p-3">
                      <p className="text-xs font-medium text-muted">Bulk pricing</p>
                      <ul className="mt-2 space-y-1.5">
                        {displayTiers.map((tier) => (
                          <li
                            key={tier.qty}
                            className="flex justify-between gap-3 text-sm"
                          >
                            <span className="text-muted">{tier.qty}</span>
                            <span className="shrink-0 font-semibold text-brand">
                              ₹{tier.price.toLocaleString("en-IN")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                    {qty === 0 ? (
                      <>
                        <span className="text-lg font-bold text-brand">
                          ₹{(product.tiers[0]?.price ?? 0).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          onClick={handleAdd}
                          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand hover:bg-brand-dim transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to cart
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handleMinus}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium">{qty}</span>
                          <button
                            type="button"
                            onClick={handlePlus}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-lg font-bold text-brand">
                          ₹{unitPrice.toLocaleString("en-IN")} / unit
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {related.length > 0 && (
                <section className="border-t border-border px-4 py-4 sm:px-5">
                  <h3 className="mb-3 text-sm font-semibold">Related parts</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {related.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => openProduct(p)}
                        className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-card text-left transition-colors hover:border-brand/40 hover:shadow-sm"
                      >
                        <div className="aspect-square bg-surface-elevated p-1">
                          <ProductImage
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <p className="line-clamp-2 p-2 text-xs font-medium leading-snug">
                          {p.name}
                        </p>
                        <p className="px-2 pb-2 text-xs font-semibold text-brand">
                          ₹{(p.tiers[0]?.price ?? 0).toLocaleString("en-IN")}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
