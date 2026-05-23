import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProductFilterContextValue = {
  activeCollection: string;
  setActiveCollection: (handle: string) => void;
  selectCategory: (handle: string) => void;
};

const ProductFilterContext = createContext<ProductFilterContextValue | null>(null);

export function ProductFilterProvider({ children }: { children: ReactNode }) {
  const [activeCollection, setActiveCollection] = useState("all");

  const selectCategory = useCallback((handle: string) => {
    setActiveCollection(handle);
    window.location.hash =
      handle === "all" ? "#products" : `#products?category=${handle}`;

    requestAnimationFrame(() => {
      if (handle === "all") {
        document.getElementById("products")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }
      document.getElementById(`collection-${handle}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, []);

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
      const hash = window.location.hash;
      if (!hash.startsWith("#products")) return;
      const params = new URLSearchParams(hash.split("?")[1] ?? "");
      const cat = params.get("category");
      setActiveCollection(cat ?? "all");
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const value = useMemo(
    () => ({ activeCollection, setActiveCollection, selectCategory }),
    [activeCollection, selectCategory],
  );

  return (
    <ProductFilterContext.Provider value={value}>{children}</ProductFilterContext.Provider>
  );
}

export function useProductFilter() {
  const ctx = useContext(ProductFilterContext);
  if (!ctx) {
    throw new Error("useProductFilter must be used within ProductFilterProvider");
  }
  return ctx;
}
