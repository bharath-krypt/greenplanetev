import { COLLECTIONS, getCollectionProducts } from "../data/catalog";
import { useProductFilter } from "../context/ProductFilterContext";
import { ProductImage } from "./ProductImage";

function collectionThumb(handle: string): string | undefined {
  return getCollectionProducts(handle)[0]?.image;
}

export function CategoryQuickGrid() {
  const { selectCategory } = useProductFilter();

  return (
    <section
      className="border-b border-border bg-surface px-4 sm:px-6 py-6"
      aria-label="Browse categories"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {COLLECTIONS.map((collection) => {
            const thumb = collectionThumb(collection.handle);
            return (
              <button
                key={collection.handle}
                type="button"
                onClick={() => selectCategory(collection.handle)}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-card p-2 sm:p-3 hover:border-brand/40 hover:bg-surface-elevated transition-colors text-center"
              >
                <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-lg bg-white border border-border/80">
                  {thumb ? (
                    <ProductImage
                      src={thumb}
                      alt=""
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-2xl opacity-60" aria-hidden>
                      ⚡
                    </span>
                  )}
                </span>
                <span className="text-[10px] sm:text-xs font-medium leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                  {collection.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
