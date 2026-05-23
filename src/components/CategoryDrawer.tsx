import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { COLLECTIONS } from "../data/catalog";
import { useProductFilter } from "../context/ProductFilterContext";

type CategoryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CategoryDrawer({ open, onClose }: CategoryDrawerProps) {
  const { activeCollection, selectCategory } = useProductFilter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filteredCollections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COLLECTIONS;
    return COLLECTIONS.filter((c) => c.title.toLowerCase().includes(q));
  }, [query]);

  const showAll =
    !query.trim() || "all categories".includes(query.trim().toLowerCase());

  const pick = (handle: string) => {
    selectCategory(handle);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[var(--color-overlay)] backdrop-blur-sm lg:hidden"
            aria-label="Close categories"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed left-0 top-0 bottom-0 z-[56] w-[min(100vw-3rem,20rem)] bg-surface-elevated border-r border-border flex flex-col shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
              <h2 className="font-display font-bold text-base flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-brand" />
                Categories
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="shrink-0 border-b border-border px-3 py-3">
              <label className="sr-only" htmlFor="category-drawer-search">
                Search categories
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  id="category-drawer-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm placeholder:text-muted focus:border-brand/50 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-2" aria-label="All categories">
              {showAll && (
                <button
                  type="button"
                  onClick={() => pick("all")}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    activeCollection === "all"
                      ? "bg-brand/15 text-brand font-semibold"
                      : "text-muted hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  All categories
                </button>
              )}
              {filteredCollections.map((collection) => (
                <button
                  key={collection.handle}
                  type="button"
                  onClick={() => pick(collection.handle)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    activeCollection === collection.handle
                      ? "bg-brand/15 text-brand font-semibold"
                      : "text-muted hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  {collection.title}
                  <span className="ml-1 text-xs opacity-70">
                    ({collection.productIds.length})
                  </span>
                </button>
              ))}
              {filteredCollections.length === 0 && !showAll && (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  No categories match &ldquo;{query}&rdquo;
                </p>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
