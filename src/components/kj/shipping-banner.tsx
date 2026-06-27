"use client";

import { Truck, Clock } from "lucide-react";
import { useLang } from "@/lib/kj/lang-store";

interface ShippingBannerProps {
  size?: "sm" | "md";
  /** "vertical" scrolls items up in a tall narrow column; "horizontal" scrolls left in a thin strip. */
  direction?: "vertical" | "horizontal";
  /** For vertical mode: the visible viewport height in pixels. */
  height?: number;
}

/**
 * Bright-yellow marquee advertising free shipping.
 *
 * Vertical mode: items stack in a column and scroll upward in a seamless loop.
 *   The list is duplicated once so the -50% translateY animation loops without a gap.
 * Horizontal mode: items lay out in a single row and scroll left.
 */
export function ShippingBanner({
  size = "md",
  direction = "horizontal",
  height = 110,
}: ShippingBannerProps) {
  const fontSize = size === "sm" ? "text-[13px]" : "text-[15px]";
  const itemPad = "py-0.5";
  const { t } = useLang();

  // Render one marquee item as inline JSX (not a nested component — avoids
  // React remounting children on every render, which can cause removeChild errors).
  const renderItem = (key: string | number, ariaHidden?: boolean) => (
    <div
      key={key}
      className={`flex items-center justify-center gap-3 px-4 leading-tight ${itemPad}`}
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      <Truck size={16} strokeWidth={2} className="text-[#212121]" />
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#212121] ${fontSize}`}
      >
        {t("banner.freeShipping")}
      </span>
      <span className="px-1 text-[#212121]/40">•</span>
      <Clock size={14} strokeWidth={2} className="text-[#212121]" />
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#212121] ${fontSize}`}
      >
        {t("banner.fastDelivery")}
      </span>
      <span className="px-1 text-[#212121]/40">•</span>
    </div>
  );

  /* ------- HORIZONTAL variant ------- */
  if (direction === "horizontal") {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "#f1c40f" }}
        role="marquee"
        aria-label={`${t("banner.freeShipping")}. ${t("banner.fastDelivery")}.`}
      >
        {/* Left + right fade masks so items softly appear/disappear */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12"
          style={{
            background:
              "linear-gradient(to right, #f1c40f 0%, rgba(241,196,15,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12"
          style={{
            background:
              "linear-gradient(to left, #f1c40f 0%, rgba(241,196,15,0) 100%)",
          }}
        />
        <div className={`kj-marquee-track ${itemPad}`}>
          {Array.from({ length: 8 }).map((_, i) => renderItem(i, i >= 4))}
        </div>
      </div>
    );
  }

  /* ------- VERTICAL variant ------- */
  const items = Array.from({ length: 4 }).map((_, i) => i);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#f1c40f", height: `${height}px` }}
      role="marquee"
      aria-label={`${t("banner.freeShipping")}. ${t("banner.fastDelivery")}.`}
    >
      {/* Top + bottom fade masks */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4"
        style={{
          background:
            "linear-gradient(to bottom, #f1c40f 0%, rgba(241,196,15,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4"
        style={{
          background:
            "linear-gradient(to top, #f1c40f 0%, rgba(241,196,15,0) 100%)",
        }}
      />

      <div className="kj-marquee-vertical-track">
        {items.map((i) => renderItem(`a-${i}`, i >= 4))}
        {items.map((i) => renderItem(`b-${i}`, true))}
      </div>
    </div>
  );
}
