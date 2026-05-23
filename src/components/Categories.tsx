import { ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../data/catalog";
import { useProductFilter } from "../context/ProductFilterContext";

const TOP_COLLECTIONS = [...COLLECTIONS]
  .sort((a, b) => b.productIds.length - a.productIds.length)
  .slice(0, 8);

export function Categories() {
  const { selectCategory } = useProductFilter();

  return (
    <section id="categories" className="py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Shop by category
          </h2>
          <p className="mt-3 text-muted">
            {COLLECTIONS.length} categories covering every electric two-wheeler
            component — from hub motors to body trim.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_COLLECTIONS.map((cat) => (
            <a
              key={cat.handle}
              href={`#products?category=${cat.handle}`}
              onClick={(e) => {
                e.preventDefault();
                selectCategory(cat.handle);
              }}
              className="group relative p-6 rounded-2xl border border-border bg-surface-card hover:border-brand/40 hover:bg-surface-elevated transition-all duration-300"
            >
              <h3 className="font-semibold group-hover:text-brand transition-colors line-clamp-2">
                {cat.title}
              </h3>
              <p className="text-xs text-brand mt-3 font-medium">
                {cat.productIds.length} products
              </p>
              <ArrowUpRight className="absolute top-6 right-6 h-4 w-4 text-muted opacity-0 group-hover:opacity-100 group-hover:text-brand transition-all" />
            </a>
          ))}
        </div>
        <p className="text-center mt-8">
          <a href="#products" className="text-sm text-brand font-medium hover:underline">
            View full catalog ({COLLECTIONS.length} categories)
          </a>
        </p>
      </div>
    </section>
  );
}
