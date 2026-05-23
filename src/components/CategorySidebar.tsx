import { COLLECTIONS } from "../data/catalog";
import { useProductFilter } from "../context/ProductFilterContext";

export function CategorySidebar() {
  const { activeCollection, selectCategory } = useProductFilter();

  return (
    <aside
      className="hidden lg:block w-56 shrink-0"
      aria-label="Filter by category"
    >
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-border bg-surface-card p-2 scrollbar-none">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Categories
        </p>
        <button
          type="button"
          onClick={() => selectCategory("all")}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            activeCollection === "all"
              ? "bg-brand/15 text-brand font-semibold"
              : "text-muted hover:bg-foreground/5 hover:text-foreground"
          }`}
        >
          All categories
        </button>
        {COLLECTIONS.map((collection) => (
          <button
            key={collection.handle}
            type="button"
            onClick={() => selectCategory(collection.handle)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              activeCollection === collection.handle
                ? "bg-brand/15 text-brand font-semibold"
                : "text-muted hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <span className="line-clamp-2">{collection.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
