"use client";

import { ArrowRight } from "lucide-react";

interface ShippingBannerProps {
  /** vertical padding scale */
  size?: "sm" | "md";
}

/**
 * Bright-yellow scrolling marquee that reads "FREE SHIPPING WORLDWIDE"
 * repeated, with a right-arrow between each repetition.
 *
 * The track is duplicated twice so the -50% translate animation loops seamlessly.
 */
export function ShippingBanner({ size = "md" }: ShippingBannerProps) {
  const pad = size === "sm" ? "py-2.5" : "py-3.5";
  const fontSize = size === "sm" ? "text-[13px]" : "text-[15px]";

  const Item = () => (
    <span className="inline-flex items-center gap-3 px-4">
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#2c3e50] ${fontSize}`}
      >
        Free Shipping Worldwide
      </span>
      <ArrowRight size={16} strokeWidth={2} className="text-[#2c3e50]" />
    </span>
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#f0f447" }}
      role="marquee"
      aria-label="Free shipping worldwide"
    >
      <div className={`la-marquee-track ${pad}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Item key={i} />
        ))}
      </div>
    </div>
  );
}
