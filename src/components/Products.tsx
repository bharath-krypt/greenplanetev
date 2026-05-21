import { useEffect, useMemo, useState } from "react";
import {
  COLLECTIONS,
  getCollectionProducts,
  searchProducts,
  TOTAL_PRODUCTS,
} from "../data/catalog";
import { B2BProductCard } from "./B2BProductCard";

export function Products() {
  const [activeCollection, setActiveCollection] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ category?: string }>).detail;
      if (detail.category) setActiveCollection(detail.category);
    };
    window.addEventListener("filter-products", handler);
    return () => window.removeEventListener("filter-products", handler);
  }, []);

  useEffect(() => {
    const onHash = () => {
      const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
      const cat = params.get("category");
      if (cat) setActiveCollection(cat);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    return searchProducts(search, 200);
  }, [search]);

  const visibleCollections = useMemo(() => {
    if (searchResults) return [];
    if (activeCollection === "all") return COLLECTIONS;
    return COLLECTIONS.filter((c) => c.handle === activeCollection);
  }, [activeCollection, searchResults]);

  return (
    <section id="products" className="py-20 px-4 sm:px-6 bg-surface-elevated/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Product catalog
            </h2>
            <p className="mt-2 text-muted">
              {TOTAL_PRODUCTS} SKUs with bulk quantity tiers · GST as per category
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm w-full sm:w-64 focus:outline-none focus:border-brand/50"
            />
            <select
              value={activeCollection}
              onChange={(e) => setActiveCollection(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm max-w-xs focus:outline-none focus:border-brand/50"
            >
              <option value="all">All categories</option>
              {COLLECTIONS.map((c) => (
                <option key={c.handle} value={c.handle}>
                  {c.title} ({c.productIds.length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {!searchResults && (
          <nav
            className="sticky top-[4.5rem] z-30 -mx-4 px-4 py-3 mb-8 bg-surface-elevated/95 backdrop-blur border-y border-border sm:mx-0 sm:rounded-xl sm:border sm:px-3"
            aria-label="Jump to category"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveCollection("all")}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeCollection === "all"
                    ? "bg-brand text-on-brand"
                    : "bg-surface border border-border text-muted hover:text-foreground"
                }`}
              >
                All
              </button>
              {COLLECTIONS.map((c) => (
                <button
                  key={c.handle}
                  type="button"
                  onClick={() => {
                    setActiveCollection(c.handle);
                    document.getElementById(`collection-${c.handle}`)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCollection === c.handle
                      ? "bg-brand text-on-brand"
                      : "bg-surface border border-border text-muted hover:text-foreground"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </nav>
        )}

        {searchResults ? (
          <div>
            <p className="text-sm text-muted mb-6">
              {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for
              &ldquo;{search}&rdquo;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((product) => (
                <B2BProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {visibleCollections.map((collection) => {
              const products = getCollectionProducts(collection.handle);
              if (products.length === 0) return null;

              return (
                <section
                  key={collection.handle}
                  id={`collection-${collection.handle}`}
                  className="scroll-mt-36 [content-visibility:auto]"
                >
                  <header className="mb-6 border-b border-border pb-3">
                    <h3 className="font-display text-xl sm:text-2xl font-bold">
                      {collection.title}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {products.length} product{products.length === 1 ? "" : "s"}
                    </p>
                  </header>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <B2BProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
