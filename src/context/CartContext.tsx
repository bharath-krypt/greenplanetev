import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { tierIndexForQty } from "../data/catalog";
import type { Product } from "../data/site";

export type CartItem = {
  product: Product;
  qty: number;
  tierIndex: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, tierIndex?: number) => void;
  setQty: (product: Product, qty: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getQty: (id: string) => number;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const setQty = useCallback((product: Product, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== product.id));
      return;
    }
    const tierIndex = tierIndexForQty(product.tiers, qty);
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty, tierIndex } : i,
        );
      }
      return [...prev, { product, qty, tierIndex }];
    });
    setOpen(true);
  }, []);

  const addItem = useCallback(
    (product: Product) => {
      setQty(product, product.minQty ?? 1);
    },
    [setQty],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  const updateQty = useCallback(
    (id: string, qty: number) => {
      const item = items.find((i) => i.product.id === id);
      if (!item) return;
      setQty(item.product, qty);
    },
    [items, setQty],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const getQty = useCallback(
    (id: string) => items.find((i) => i.product.id === id)?.qty ?? 0,
    [items],
  );

  const { total, count } = useMemo(() => {
    let total = 0;
    let count = 0;
    for (const item of items) {
      const price = item.product.tiers[item.tierIndex]?.price ?? 0;
      total += price * item.qty;
      count += item.qty;
    }
    return { total, count };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      setOpen,
      addItem,
      setQty,
      removeItem,
      updateQty,
      clearCart,
      getQty,
      total,
      count,
    }),
    [items, isOpen, addItem, setQty, removeItem, updateQty, clearCart, getQty, total, count],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
