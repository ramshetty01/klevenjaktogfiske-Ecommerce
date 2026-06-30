"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Star, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/kj/types";
import { formatNok, discountPercent } from "@/lib/kj/types";
import { useCart } from "@/lib/kj/cart-store";
import { useLang } from "@/lib/kj/lang-store";
import type { TranslationKey } from "@/lib/kj/i18n";

const PLACEHOLDER = "/images/product-placeholder.svg";

interface ProductCardProps {
  product: Product;
  onOpen?: (slug: string) => void;
  /** Compact variant — used in dense shop grid (smaller text). */
  compact?: boolean;
  /** Load immediately when the card is initially visible above the fold. */
  priority?: boolean;
}

/** Map raw Norwegian tag values to translation keys. */
const TAG_KEY: Record<string, TranslationKey> = {
  Bestselger: "tag.bestseller",
  Nyhet: "tag.new",
  Tilbud: "tag.sale",
  Begrenset: "tag.limited",
  Premium: "tag.premium",
  Populært: "tag.popular",
};

/** Translate a stock label like "20+ På lager" → "20+ in stock" (EN). */
function localizeStock(label: string, lang: "no" | "en"): string {
  if (lang === "no") return label;
  return label
    .replace(/på lager/i, "in stock")
    .replace(/ikke på lager/i, "out of stock")
    .replace(/se produkt/i, "see product")
    .replace(/på vei/i, "incoming");
}

/**
 * Compact product card used in shop grids and the home page.
 */
export function ProductCard({ product, onOpen, compact = false, priority = false }: ProductCardProps) {
  const { toast } = useToast();
  const add = useCart((s) => s.add);
  const { t, lang } = useLang();

  const discount = discountPercent(product);
  const inStock = product.stockCount > 0;
  const priceUnknown = !product.price || product.price === 0;

  const [imgSrc, setImgSrc] = useState<string>(
    product.imageUrl && product.imageUrl.trim().length > 0
      ? product.imageUrl
      : PLACEHOLDER,
  );

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!inStock) {
      toast({
        title: t("shop.outOfStock"),
        description: product.stockLabel ?? t("product.unavailable"),
        variant: "destructive",
      });
      return;
    }
    try {
      await add(product, 1);
      toast({
        title: t("product.addedToCart"),
        description: t("product.addedToCartDesc", { qty: 1, name: product.name }),
      });
    } catch {
      toast({
        title: t("common.error"),
        description: t("product.tryAgain"),
        variant: "destructive",
      });
    }
  };

  const open = () => onOpen?.(product.slug);

  // Localized tag display
  const localizedTag = product.tag
    ? TAG_KEY[product.tag]
      ? t(TAG_KEY[product.tag])
      : product.tag // tags like "-30%" stay as-is
    : null;

  // Tag color mapping (uses original tag value for color logic)
  const tagClass = (tag: string) => {
    if (tag.startsWith("-") || tag === "Tilbud") return "bg-[#f8a530] text-white";
    if (tag === "Nyhet") return "bg-[#212121] text-white";
    if (tag === "Begrenset") return "bg-[#0056a7] text-white";
    if (tag === "Premium") return "bg-[#0056a7] text-white";
    if (tag === "Populært") return "bg-[#428701] text-[#212121]";
    return "bg-[#428701] text-[#212121]"; // Bestselger
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
      aria-label={`${t("common.open")} ${product.name}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[6px] border border-black/5 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,45,58,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#428701]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#FFFFFF]">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 31vw, (max-width: 1279px) 22vw, 240px"
          quality={72}
          unoptimized={imgSrc.startsWith("http")}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => {
            if (imgSrc !== PLACEHOLDER) setImgSrc(PLACEHOLDER);
          }}
        />

        {/* Tag badge */}
        {localizedTag && product.tag && (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${tagClass(product.tag)}`}
          >
            {localizedTag}
          </span>
        )}

        {/* Discount % badge */}
        {discount > 0 && (
          <span
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f8a530] text-[11px] font-bold text-white shadow-md"
            aria-label={`${discount}% ${t("common.off")}`}
          >
            -{discount}%
          </span>
        )}

        {/* Add-to-cart button (appears on hover) */}
        <button
          onClick={handleAdd}
          aria-label={`${t("common.add")} ${product.name} ${t("common.toCart")}`}
          className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#212121] opacity-100 shadow-md transition-all duration-300 hover:bg-[#428701] md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus:opacity-100"
        >
          <Plus size={14} strokeWidth={2.2} />
        </button>
      </div>

      <div className={`flex flex-1 flex-col gap-0.5 ${compact ? "px-2.5 py-2" : "px-3 py-3"}`}>
        {/* Category label */}
        <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#858585]">
          {product.category?.name ?? product.brand?.name ?? "Kleven"}
        </div>

        {/* Name */}
        <h3
          className={`font-semibold leading-tight text-[#212121] line-clamp-2 ${
            compact ? "text-[13px]" : "text-[14px]"
          }`}
        >
          {product.name}
        </h3>

        {/* Subtitle */}
        {product.subtitle && (
          <p className="text-[10px] font-light text-[#858585] line-clamp-1">
            {product.subtitle}
          </p>
        )}

        {/* Stock status */}
        {product.stockLabel && (
          <p
            className={`mt-0.5 text-[9px] font-medium uppercase tracking-[0.04em] ${
              inStock ? "text-[#428701]" : "text-[#f8a530]"
            }`}
          >
            {localizeStock(product.stockLabel, lang)}
          </p>
        )}

        {/* Price row */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          {priceUnknown ? (
            <span className="text-[14px] font-bold text-[#212121]">{t("shop.seePrice")}</span>
          ) : (
            <span className="text-[14px] font-bold text-[#212121]">
              {formatNok(product.price)}
            </span>
          )}
          {!priceUnknown && product.originalPrice && (
            <span className="text-[10px] font-light text-[#a0a8b0] line-through">
              {formatNok(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="mt-1 flex items-center gap-1 text-[9px] text-[#858585]">
            <Star size={10} className="fill-[#428701] text-[#428701]" />
            <span className="font-semibold text-[#212121]">
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
      <div className="aspect-square animate-pulse bg-[#FFFFFF]" />
      <div className="flex flex-col gap-1.5 px-2.5 py-2">
        <div className="h-2 w-12 animate-pulse rounded bg-[#FFFFFF]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#FFFFFF]" />
        <div className="h-2 w-2/3 animate-pulse rounded bg-[#FFFFFF]" />
        <div className="h-3 w-16 animate-pulse rounded bg-[#FFFFFF]" />
      </div>
    </div>
  );
}

/** Small invisible re-export for type-only imports */
export type { Product };
export { ArrowRight }; // (kept for callers that still import the icon from here)
