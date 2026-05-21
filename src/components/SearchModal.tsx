import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { searchProducts } from "../data/catalog";
import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return searchProducts("", 6);
    return searchProducts(query, 20);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[var(--color-overlay)] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="fixed left-4 right-4 top-24 z-[80] max-w-xl mx-auto rounded-2xl border border-border bg-surface-elevated shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="h-5 w-5 text-muted shrink-0" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search motors, BMS, bearings, model..."
                className="flex-1 py-4 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-foreground p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="p-4 text-sm text-muted text-center">
                  No parts found
                </li>
              ) : (
                results.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        addItem(p);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 text-left transition-colors"
                    >
                      <ProductImage
                        src={p.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-surface-elevated"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-brand">
                          from ₹{p.tiers[p.tiers.length - 1]?.price ?? p.tiers[0]?.price}
                        </p>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
