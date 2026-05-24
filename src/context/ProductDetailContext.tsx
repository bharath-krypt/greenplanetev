import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../data/site";

type ProductDetailContextValue = {
  product: Product | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
};

const ProductDetailContext = createContext<ProductDetailContextValue | null>(null);

export function ProductDetailProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  const openProduct = useCallback((p: Product) => setProduct(p), []);
  const closeProduct = useCallback(() => setProduct(null), []);

  const value = useMemo(
    () => ({ product, openProduct, closeProduct }),
    [product, openProduct, closeProduct],
  );

  return (
    <ProductDetailContext.Provider value={value}>
      {children}
    </ProductDetailContext.Provider>
  );
}

export function useProductDetail() {
  const ctx = useContext(ProductDetailContext);
  if (!ctx) {
    throw new Error("useProductDetail must be used within ProductDetailProvider");
  }
  return ctx;
}
