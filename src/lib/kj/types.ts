/**
 * Shared frontend type definitions for the Kleven storefront.
 *
 * These mirror the shape of the JSON returned by the API routes — they
 * live in src/lib/kj/ so both client pages and any future server
 * components can import them.
 */

export interface BrandRef {
  name: string;
  slug: string;
}

export interface CategoryRef {
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  images: string; // JSON-encoded array
  sku: string;
  stockCount: number;
  stockLabel: string | null;
  tag: string | null;
  rating: number;
  reviewCount: number;
  sales90: number;
  conversionRate: number;
  popularity: number;
  seasonBoost: number;
  margin: number;
  isNew: boolean;
  createdAt: string;
  externalId: string | null;
  externalUrl: string | null;
  brandId: string | null;
  brand: BrandRef | null;
  categoryId: string | null;
  category: CategoryRef | null;
  subcategoryId: string | null;
  subcategory: CategoryRef | null;
}

export interface ProductDetail extends Product {
  brand: BrandRef & { country?: string | null; description?: string | null };
  reviews: Review[];
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string;
    stockCount: number;
    stockLabel: string | null;
    tag: string | null;
    brand: { name: string } | null;
  };
}

export interface CartResponse {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
}

export interface ProductListResponse {
  products: Product[];
  page: number;
  perPage: number;
  totalPages: number;
  totalCount?: number;
  sort: string;
}

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  count: number;
  subcategories: { id: string; name: string; slug: string; parentId: string; count: number }[];
}

export interface BrandNode {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  description: string | null;
  count: number;
}

/** Format NOK like "kr 1 499" */
export function formatNok(n: number): string {
  return "kr " + n.toLocaleString("no-NO").replace(/\u00a0/g, " ");
}

/** Discount percentage for a product (0–100 rounded). 0 when no original. */
export function discountPercent(p: { price: number; originalPrice?: number | null }): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}
