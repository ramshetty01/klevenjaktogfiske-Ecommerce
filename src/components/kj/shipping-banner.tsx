"use client";

import { Truck, Clock } from "lucide-react";

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
  direction = "vertical",
  height = 140,
}: ShippingBannerProps) {
  const fontSize = size === "sm" ? "text-[13px]" : "text-[15px]";
  const itemPad = size === "sm" ? "py-2" : "py-3";

  /* Each item is one line: icon + text + bullet separator */
  const Item = ({ index }: { index: number }) => (
    <div
      className={`flex items-center justify-center gap-3 px-4 ${itemPad}`}
      aria-hidden={index >= 4 ? "true" : undefined}
    >
      <Truck size={18} strokeWidth={2} className="text-[#1f2d3a]" />
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#1f2d3a] ${fontSize}`}
      >
        Fraktfritt i Norge over 2500,-
      </span>
      <span className="px-1 text-[#1f2d3a]/40">•</span>
      <Clock size={16} strokeWidth={2} className="text-[#1f2d3a]" />
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#1f2d3a] ${fontSize}`}
      >
        Rask levering 2–4 dager
      </span>
      <span className="px-1 text-[#1f2d3a]/40">•</span>
    </div>
  );

  /* ------- HORIZONTAL variant (original) ------- */
  if (direction === "horizontal") {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "#f4d35e" }}
        role="marquee"
        aria-label="Fraktfritt i Norge på ordre over 2500 kroner"
      >
        <div className={`kj-marquee-track ${size === "sm" ? "py-2.5" : "py-3.5"}`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Item key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ------- VERTICAL variant (new) ------- */
  // Render the item list TWICE so the -50% translateY loop is seamless.
  const items = Array.from({ length: 4 }).map((_, i) => i);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#f4d35e", height: `${height}px` }}
      role="marquee"
      aria-label="Fraktfritt i Norge på ordre over 2500 kroner. Rask levering 2 til 4 dager."
    >
      {/* Top + bottom fade masks so items softly appear/disappear */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8"
        style={{
          background:
            "linear-gradient(to bottom, #f4d35e 0%, rgba(244,211,94,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8"
        style={{
          background:
            "linear-gradient(to top, #f4d35e 0%, rgba(244,211,94,0) 100%)",
        }}
      />

      <div className="kj-marquee-vertical-track">
        {/* First set */}
        {items.map((i) => (
          <Item key={`a-${i}`} index={i} />
        ))}
        {/* Duplicate set for seamless loop */}
        {items.map((i) => (
          <Item key={`b-${i}`} index={i + 4} />
        ))}
      </div>
    </div>
  );
}
