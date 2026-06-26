"use client";

import { Truck } from "lucide-react";

interface ShippingBannerProps {
  size?: "sm" | "md";
}

/**
 * Bright-yellow scrolling marquee advertising free shipping.
 * Text: "Fraktfritt i Norge på ordre over 2500,-"
 * The track is duplicated enough times so the -50% translate animation loops seamlessly.
 */
export function ShippingBanner({ size = "md" }: ShippingBannerProps) {
  const pad = size === "sm" ? "py-2.5" : "py-3.5";
  const fontSize = size === "sm" ? "text-[13px]" : "text-[15px]";

  const Item = () => (
    <span className="inline-flex items-center gap-3 px-4">
      <Truck size={18} strokeWidth={2} className="text-[#1f2d3a]" />
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#1f2d3a] ${fontSize}`}
      >
        Fraktfritt i Norge over 2500,-
      </span>
      <span className="px-2 text-[#1f2d3a]/40">•</span>
      <span
        className={`font-semibold uppercase tracking-[0.18em] text-[#1f2d3a] ${fontSize}`}
      >
        Rask levering 2–4 dager
      </span>
      <span className="px-2 text-[#1f2d3a]/40">•</span>
    </span>
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#f4d35e" }}
      role="marquee"
      aria-label="Fraktfritt i Norge på ordre over 2500 kroner"
    >
      <div className={`kj-marquee-track ${pad}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Item key={i} />
        ))}
      </div>
    </div>
  );
}
