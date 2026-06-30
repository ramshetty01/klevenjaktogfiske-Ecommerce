"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { PageId, NavContext } from "../kj/header";
import { useCart } from "@/lib/kj/cart-store";
import { useLang } from "@/lib/kj/lang-store";
import { formatNok } from "@/lib/kj/types";
import { ShippingBanner } from "../kj/shipping-banner";

interface CartPageProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

const FREE_SHIPPING_THRESHOLD = 2500;
const PLACEHOLDER = "/images/product-placeholder.svg";

/**
 * Image with onError fallback to the placeholder.
 *
 * Each cart line is keyed by `item.id` in the parent, so the component
 * remounts when the underlying product changes — no sync effect needed.
 */
function CartImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(
    src && src.trim().length > 0 ? src : PLACEHOLDER,
  );
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="96px"
      quality={70}
      unoptimized={imgSrc.startsWith("http")}
      className="h-full w-full object-cover transition-transform hover:scale-105"
      onError={() => {
        if (imgSrc !== PLACEHOLDER) setImgSrc(PLACEHOLDER);
      }}
    />
  );
}

export function CartPage({ onNavigate }: CartPageProps) {
  const { t } = useLang();
  const { items, subtotal, totalCount, loading, initialized, hydrate, setQuantity, remove } = useCart();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  if (initialized && items.length === 0) {
    return (
      <div className="kj-page-enter flex min-h-[60vh] flex-col items-center justify-center bg-white px-6 py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F4F4F4]">
          <ShoppingBag size={32} className="text-[#858585]" strokeWidth={1.5} />
        </div>
        <h1
          className="mt-6 text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.01em] text-[#212121]"
          style={{ fontFamily: "var(--font-manrope), sans-serif" }}
        >
          {t("cart.empty")}
        </h1>
        <p className="mt-2 max-w-sm text-center text-[14px] font-light text-[#858585]">
          {t("cart.emptyDesc")}
        </p>
        <Button
          onClick={() => onNavigate("shop")}
          className="mt-8 rounded-full bg-[#428701] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#212121] shadow-[0_8px_24px_rgba(240,197,72,0.30)] transition-all hover:bg-[#369400]"
        >
          {t("cart.emptyCta")}
          <ArrowRight size={14} className="ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="kj-page-enter">
      <ShippingBanner size="md" />

      <section className="w-full bg-[#F4F4F4]">
        <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#858585]">
            {t("cart.title")}
          </div>
          <h1
            className="text-[clamp(2.25rem,4.5vw,3.25rem)] font-bold tracking-[-0.02em] text-[#212121]"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            {t("cart.title")}
          </h1>
          <p className="mt-2 text-[14px] font-light text-[#858585]">
            {totalCount > 0
              ? t("cart.itemsInCart", { count: totalCount })
              : t("cart.noItems")}
          </p>

          {/* Free shipping progress bar */}
          <div className="mt-8 rounded-lg border border-black/5 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-[#0056a7]" strokeWidth={1.6} />
              <p className="flex-1 text-[13px] text-[#212121]">
                {qualifiesForFreeShipping ? (
                  <span className="font-semibold text-[#428701]">
                    {t("cart.freeShippingEarned")}
                  </span>
                ) : (
                  <>{t("cart.freeShippingProgress", { amount: formatNok(remaining) })}</>
                )}
              </p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#F4F4F4]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#0056a7] to-[#428701]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Cart items + summary */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items list */}
            <div className="flex flex-col gap-3">
              {loading && !initialized ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-lg bg-white/60"
                  />
                ))
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center"
                    >
                      {/* Image */}
                      <button
                        onClick={() => onNavigate("product", { productSlug: item.product.slug })}
                        className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#FFFFFF]"
                      >
                        { }
                        <CartImage src={item.product.imageUrl} alt={item.product.name} />
                      </button>

                      {/* Details */}
                      <div className="flex flex-1 flex-col gap-1">
                        {item.product.brand && (
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#858585]">
                            {item.product.brand.name}
                          </p>
                        )}
                        <button
                          onClick={() => onNavigate("product", { productSlug: item.product.slug })}
                          className="text-left text-[14px] font-semibold leading-tight text-[#212121] hover:text-[#0056a7]"
                        >
                          {item.product.name}
                        </button>
                        {item.product.stockLabel && (
                          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-[#428701]">
                            {item.product.stockLabel}
                          </p>
                        )}
                          <p className="text-[13px] font-bold text-[#212121]">
                          {item.product.price > 0 ? (
                            <>
                              {formatNok(item.product.price)}
                              {item.product.originalPrice && (
                                <span className="ml-2 text-[11px] font-light text-[#a0a8b0] line-through">
                                  {formatNok(item.product.originalPrice)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#0056a7]">
                              {t("cart.priceSeeProduct")}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Quantity + actions */}
                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <div className="flex items-center rounded-full border border-[#d0d5d2] bg-white">
                          <button
                            aria-label={t("cart.decreaseQty")}
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#212121] hover:bg-[#F4F4F4]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-[14px] font-semibold text-[#212121]">
                            {item.quantity}
                          </span>
                          <button
                            aria-label={t("cart.increaseQty")}
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-[#212121] hover:bg-[#F4F4F4]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#212121]">
                            {item.product.price > 0
                              ? formatNok(item.product.price * item.quantity)
                              : "—"}
                          </span>
                          <button
                            aria-label={t("cart.remove")}
                            onClick={() => remove(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[#858585] transition-colors hover:bg-[#f8a530]/10 hover:text-[#f8a530]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border border-black/5 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <h2 className="text-[16px] font-semibold uppercase tracking-[0.1em] text-[#212121]">
                  {t("cart.summaryTitle")}
                </h2>

                <dl className="mt-4 flex flex-col gap-2 text-[13px]">
                  <div className="flex items-center justify-between">
                    <dt className="text-[#858585]">{t("cart.subtotal")}</dt>
                    <dd className="font-semibold text-[#212121]">{formatNok(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#858585]">{t("cart.shipping")}</dt>
                    <dd className="font-semibold text-[#212121]">
                      {qualifiesForFreeShipping ? (
                        <span className="text-[#428701]">{t("cart.free")}</span>
                      ) : (
                        t("cart.calculatedAtCheckout")
                      )}
                    </dd>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-[#d0d5d2] pt-3">
                    <dt className="text-[14px] font-semibold text-[#212121]">{t("cart.total")}</dt>
                    <dd className="text-[20px] font-bold text-[#212121]">
                      {formatNok(subtotal)}
                    </dd>
                  </div>
                </dl>

                <Button
                  className="mt-6 w-full rounded-full bg-[#428701] px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#212121] shadow-[0_8px_24px_rgba(240,197,72,0.30)] transition-all hover:bg-[#369400] hover:shadow-[0_12px_30px_rgba(217,168,56,0.40)]"
                >
                  {t("cart.checkout")}
                  <ArrowRight size={16} className="ml-2" />
                </Button>

                <button
                  onClick={() => onNavigate("shop")}
                  className="mt-3 w-full text-center text-[12px] font-medium text-[#858585] hover:text-[#212121] hover:underline"
                >
                  {t("cart.continueShopping")}
                </button>

                {/* Trust badges */}
                <div className="mt-6 flex flex-col gap-2 border-t border-[#d0d5d2] pt-4 text-[11px] text-[#858585]">
                  <p className="flex items-center gap-2">
                    <Truck size={14} className="text-[#0056a7]" /> {t("banner.fastDelivery")}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#0056a7]">✓</span> {t("cart.openReturn")}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#0056a7]">✓</span> {t("cart.securePayment")}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
