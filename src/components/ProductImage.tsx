import { useEffect, useState } from "react";
import { isBlockedProductImage } from "../data/blockedProductImages";
import {
  isProductImageFallback,
  PRODUCT_IMAGE_FALLBACK,
  resolveProductImage,
} from "../utils/productImage";

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

function classesForFallback(base: string): string {
  return `${base
    .replace(/\bobject-\S+/g, "")
    .replace(/\bgroup-hover:scale-\S+/g, "")
    .trim()} object-contain p-4 sm:p-6`;
}

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [current, setCurrent] = useState(() => resolveProductImage(src));

  useEffect(() => {
    setCurrent(resolveProductImage(src));
  }, [src]);

  const fallback = isProductImageFallback(current);

  return (
    <img
      src={current}
      alt={alt}
      className={fallback ? classesForFallback(className) : className}
      loading="lazy"
      onError={() => setCurrent(PRODUCT_IMAGE_FALLBACK)}
      onLoad={(e) => {
        const img = e.currentTarget;
        const src = img.currentSrc || img.src;
        if (isBlockedProductImage(src)) {
          setCurrent(PRODUCT_IMAGE_FALLBACK);
        }
      }}
    />
  );
}
