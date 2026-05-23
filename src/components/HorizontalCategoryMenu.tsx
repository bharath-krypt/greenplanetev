import { useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { COLLECTIONS } from "../data/catalog";
import { useProductFilter } from "../context/ProductFilterContext";
import { CategoryDrawer } from "./CategoryDrawer";

export function HorizontalCategoryMenu() {
  const { activeCollection, selectCategory } = useProductFilter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeCollection]);

  return (
    <>
      <nav
        id="quick-category-menu"
        aria-label="Filter by category"
        className="sticky z-[12] border-y border-border bg-surface pl-28 before:relative top-14 md:top-[4.25rem]"
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="absolute left-0 top-0 bottom-0 z-20 flex w-28 flex-col items-center justify-center gap-1 border-r border-border bg-surface text-center"
          aria-label="Open all categories"
        >
          <LayoutGrid className="h-5 w-5 text-brand" />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted leading-tight px-2">
            Categories
          </span>
        </button>

        <div className="flex overflow-x-auto scrollbar-none">
          {COLLECTIONS.map((collection) => {
            const active = activeCollection === collection.handle;
            return (
              <button
                key={collection.handle}
                ref={active ? activeRef : undefined}
                type="button"
                onClick={() => selectCategory(collection.handle)}
                className={`shrink-0 border-r border-border px-4 py-3.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors last:border-r-0 ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-foreground/85 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {collection.title}
              </button>
            );
          })}
        </div>
      </nav>

      <CategoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
