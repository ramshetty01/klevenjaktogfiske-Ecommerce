"use client";

import { ArrowRight, Star, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/kj/types";
import { formatNok, discountPercent } from "@/lib/kj/types";
import { useCart } from "@/lib/kj/cart-store";

interface ProductCardProps {
  product: Product;
  onOpen?: (slug: string) => void;
  /** Compact variant — used in dense shop grid (smaller text). */
  compact?: boolean;
}

/**
 * Compact product card used in shop grids and the home page.
 *
 * - Image with hover-zoom
 * - Tag badge (top-left): color-coded by tag type
 * - Discount % badge (top-right) when on sale
 * - Stock status line
 * - Price + struck-through original price
 * - Rating row (stars hidden when no reviews)
 * - "Add to cart" button (appears on hover, bottom-right of image)
 *
 * Clicking the card opens the product detail page via onOpen(slug).
 * Clicking the add-to-cart button stops propagation and adds the product.
 */
export function ProductCard({ product, onOpen, compact = false }: ProductCardProps) {
  const { toast } = useToast();
  const add = useCart((s) => s.add);

  const discount = discountPercent(product);
  const inStock = product.stockCount > 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!inStock) {
      toast({
        title: "Ikke på lager",
        description: product.stockLabel ?? "Produktet er ikke tilgjengelig akkurat nå.",
        variant: "destructive",
      });
      return;
    }
    try {
      await add(product, 1);
      toast({
        title: "Lagt i handlevognen",
        description: `${product.name} er nå i handlevognen.`,
      });
    } catch {
      toast({
        title: "Kunne ikke legge til",
        description: "Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  const open = () => onOpen?.(product.slug);

  // Tag color mapping
  const tagClass = (tag: string) => {
    if (tag.startsWith("-") || tag === "Tilbud") return "bg-[#c75d2c] text-white";
    if (tag === "Nyhet") return "bg-[#1f2d3a] text-white";
    if (tag === "Begrenset") return "bg-[#2d4a3e] text-white";
    if (tag === "Premium") return "bg-[#2d4a3e] text-white";
    if (tag === "Populært") return "bg-[#f0c548] text-[#1f2d3a]";
    return "bg-[#f0c548] text-[#1f2d3a]"; // Bestselger
  };

  return (
    <article
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`Åpne ${product.name}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,45,58,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0c548]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f4f3ef]">
        { }
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Tag badge */}
        {product.tag && (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${tagClass(product.tag)}`}
          >
            {product.tag}
          </span>
        )}

        {/* Discount % badge */}
        {discount > 0 && (
          <span
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#c75d2c] text-[11px] font-bold text-white shadow-md"
            aria-label={`${discount}% rabatt`}
          >
            -{discount}%
          </span>
        )}

        {/* Add-to-cart button (appears on hover) */}
        <button
          onClick={handleAdd}
          aria-label={`Legg ${product.name} i handlevognen`}
          className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white text-[#1f2d3a] opacity-0 shadow-md transition-all duration-300 hover:bg-[#f0c548] group-hover:translate-y-0 group-hover:opacity-100 focus:opacity-100"
        >
          <Plus size={14} strokeWidth={2.2} />
        </button>
      </div>

      <div className={`flex flex-1 flex-col gap-0.5 ${compact ? "px-2.5 py-2" : "px-3 py-3"}`}>
        {/* Category label */}
        <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a96a1]">
          {product.category?.name ?? "Kleven"}
        </div>

        {/* Name */}
        <h3
          className={`font-semibold leading-tight text-[#1f2d3a] line-clamp-2 ${
            compact ? "text-[12px]" : "text-[13px]"
          }`}
        >
          {product.name}
        </h3>

        {/* Subtitle */}
        {product.subtitle && (
          <p className="text-[10px] font-light text-[#6b7884] line-clamp-1">
            {product.subtitle}
          </p>
        )}

        {/* Stock status */}
        {product.stockLabel && (
          <p
            className={`mt-0.5 text-[9px] font-medium uppercase tracking-[0.04em] ${
              inStock ? "text-[#3d5e4f]" : "text-[#c75d2c]"
            }`}
          >
            {product.stockLabel}
          </p>
        )}

        {/* Price row */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[13px] font-bold text-[#1f2d3a]">
            {formatNok(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] font-light text-[#a0a8b0] line-through">
              {formatNok(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#8a96a1]">
            <Star size={10} className="fill-[#f0c548] text-[#f0c548]" />
            <span className="font-semibold text-[#1f2d3a]">
              {product.rating.toFixed(1)}
            </span>
            <span>({product.reviewCount})</span>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Skeleton placeholder for a ProductCard. Renders the same outer shape
 * with shimmer-grey boxes — used during API fetches.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="aspect-square animate-pulse bg-[#f4f3ef]" />
      <div className="flex flex-col gap-1.5 px-2.5 py-2">
        <div className="h-2 w-12 animate-pulse rounded bg-[#f4f3ef]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#f4f3ef]" />
        <div className="h-2 w-2/3 animate-pulse rounded bg-[#f4f3ef]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[#f4f3ef]" />
      </div>
    </div>
  );
}

/** Small invisible re-export for type-only imports */
export type { Product };
export { ArrowRight }; // (kept for callers that still import the icon from here)
