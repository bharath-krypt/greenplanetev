import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { COMPANY } from "../data/site";
import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";
import { buildWhatsAppOrderMessage } from "../utils/whatsappOrderMessage";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQty, total, clearCart } =
    useCart();

  const orderPreview = buildWhatsAppOrderMessage(items);
  const whatsappMessage = encodeURIComponent(orderPreview);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[var(--color-overlay)] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[80] w-full max-w-md bg-surface-elevated border-l border-border flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand" />
                Your cart ({items.length})
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground p-1"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted">
                <ShoppingBag className="h-12 w-12 mb-4 opacity-40" />
                <p>Your cart is empty</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-4 text-brand text-sm font-medium hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto p-5 space-y-4">
                  {items.map((item) => {
                    const tier = item.product.tiers[item.tierIndex];
                    return (
                      <li
                        key={item.product.id}
                        className="flex gap-4 p-3 rounded-xl border border-border bg-surface-card"
                      >
                        <ProductImage
                          src={item.product.image}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover bg-surface-elevated"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted mt-0.5">{tier?.qty}</p>
                          <p className="text-brand font-bold mt-1">
                            ₹{(tier?.price ?? 0) * item.qty}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const min = item.product.minQty ?? 1;
                                if (item.qty <= min) removeItem(item.product.id);
                                else updateQty(item.product.id, item.qty - 1);
                              }}
                              className="h-7 w-7 flex items-center justify-center rounded-md border border-border"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm w-6 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.product.id, item.qty + 1)
                              }
                              className="h-7 w-7 flex items-center justify-center rounded-md border border-border"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="ml-auto text-muted hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="p-5 border-t border-border space-y-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Estimate</span>
                    <span className="text-brand">₹{total}</span>
                  </div>
                  <p className="text-xs text-muted">
                    Final price incl. GST confirmed on WhatsApp
                  </p>
                  <pre className="max-h-40 overflow-y-auto rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed whitespace-pre-wrap text-muted font-sans">
                    {orderPreview}
                  </pre>
                  <a
                    href={`https://wa.me/${COMPANY.whatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3.5 rounded-xl bg-brand text-on-brand font-semibold hover:bg-brand-dim"
                  >
                    Order via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full text-sm text-muted hover:text-foreground"
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
