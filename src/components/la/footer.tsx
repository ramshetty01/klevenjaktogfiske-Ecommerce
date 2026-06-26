"use client";

import { Instagram, Facebook, Twitter, Music2, ArrowRight } from "lucide-react";
import type { PageId } from "./header";

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const go = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative w-full border-t border-white/10 text-white"
      style={{ backgroundColor: "#2c3e50" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col">
            <h3
              className="mb-8 text-[28px] font-light tracking-[0.01em]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Lemon <span className="opacity-70">&amp;</span> Ardent
            </h3>

            <div className="flex flex-col gap-4 text-[14px] font-light leading-relaxed text-[#bdc3c7]">
              <a href="tel:123-456-7890" className="hover:text-white">
                123-456-7890
              </a>
              <a href="mailto:info@mysite.com" className="hover:text-white">
                info@mysite.com
              </a>
              <span>
                500 Terry Francine St.
                <br />
                San Francisco, CA 94158
              </span>
            </div>

            {/* Social icons */}
            <div className="mt-8 flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Music2, label: "TikTok" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2c3e50] transition-all duration-300 hover:bg-[#f7dc6f] hover:scale-105"
                >
                  <Icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Right column: policy links */}
          <div className="flex flex-col items-start md:items-end">
            <div className="flex flex-col gap-3 text-[14px] font-light text-[#bdc3c7] md:items-end">
              {[
                "Privacy Policy",
                "Accessibility Statement",
                "Shipping Policy",
                "Terms & Conditions",
                "Refund Policy",
              ].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 text-[13px] font-light text-[#95a5a6]">
          <p>© 2035 by Lemon &amp; Ardent.</p>
          <p>Powered and secured by Wix</p>
        </div>
      </div>
    </footer>
  );
}

/* Small floating "commitment" chip used inside some pages */
export function CommitmentChip({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
    >
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2d3748]">
          Our Commitment
        </p>
        <p className="text-[11px] text-[#718096]">Quality, expertise, support</p>
      </div>
      <ArrowRight
        size={14}
        className="text-[#718096] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2d3748]"
      />
    </button>
  );
}
