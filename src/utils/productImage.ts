import { isBlockedProductImage } from "../data/blockedProductImages";
import { COMPANY } from "../data/site";

export const PRODUCT_IMAGE_FALLBACK = COMPANY.logo;

export function resolveProductImage(url?: string | null): string {
  if (!url?.trim()) return PRODUCT_IMAGE_FALLBACK;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return PRODUCT_IMAGE_FALLBACK;
  if (isBlockedProductImage(trimmed)) return PRODUCT_IMAGE_FALLBACK;
  return trimmed;
}

export function isProductImageFallback(src: string): boolean {
  return src === PRODUCT_IMAGE_FALLBACK;
}
