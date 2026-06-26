"use client";

import { Instagram, Facebook, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
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
      style={{ backgroundColor: "#1f2d3a" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand + contact column */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div
                className="text-[22px] font-semibold tracking-[0.04em]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                KLEVEN
              </div>
              <div className="text-[10px] font-light uppercase tracking-[0.35em] text-[#f0c548]">
                Jakt &amp; Fiske AS
              </div>
            </div>

            <p className="mb-6 max-w-xs text-[13px] font-light leading-relaxed text-[#b8c0c8]">
              Norsk utstyr for jakt, fiske og friluftsliv siden 1985. Vi leverer
              kvalitetsutstyr fra de beste merkevarene — med rådgivning du kan
              stole på.
            </p>

            <div className="flex flex-col gap-3 text-[13px] font-light text-[#b8c0c8]">
              <a
                href="tel:+47XXXXXXXX"
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone size={14} strokeWidth={1.6} className="text-[#f0c548]" />
                +47 38 00 00 00
              </a>
              <a
                href="mailto:post@klevenjaktogfiske.no"
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail size={14} strokeWidth={1.6} className="text-[#f0c548]" />
                post@klevenjaktogfiske.no
              </a>
              <span className="flex items-start gap-2">
                <MapPin
                  size={14}
                  strokeWidth={1.6}
                  className="mt-0.5 text-[#f0c548]"
                />
                <span>
                  Strandgata 12
                  <br />
                  4580 Lyngdal, Norge
                </span>
              </span>
            </div>

            {/* Social icons */}
            <div className="mt-8 flex items-center gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#f0c548] hover:text-[#1f2d3a] hover:scale-105"
                >
                  <Icon size={16} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Middle column: categories */}
          <div className="flex flex-col">
            <h4 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#f0c548]">
              Kategorier
            </h4>
            <div className="flex flex-col gap-3 text-[13px] font-light text-[#b8c0c8]">
              {[
                { label: "Jaktutstyr", page: "shop" as PageId },
                { label: "Fiskeutstyr", page: "shop" as PageId },
                { label: "Camping & Friluftsliv", page: "shop" as PageId },
                { label: "Kniver", page: "shop" as PageId },
                { label: "Bekledning", page: "shop" as PageId },
                { label: "Sekker & Ryggsekker", page: "shop" as PageId },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={() => go(c.page)}
                  className="text-left transition-colors hover:text-white"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right column: customer service */}
          <div className="flex flex-col">
            <h4 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#f0c548]">
              Kundeservice
            </h4>
            <div className="flex flex-col gap-3 text-[13px] font-light text-[#b8c0c8]">
              <a href="#" className="transition-colors hover:text-white">
                Salgsbetingelser
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Frakt &amp; Levering
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Retur &amp; Bytte
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Personvern
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Kontakt Oss
              </a>
            </div>

            {/* Opening hours */}
            <div className="mt-6 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-[12px] font-light text-[#b8c0c8]">
              <p className="font-semibold text-white">Åpningstider</p>
              <p className="mt-1">Man–Fre: 09:00 – 17:00</p>
              <p>Lør: 10:00 – 15:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-white/10 pt-6 text-[12px] font-light text-[#8a96a1] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kleven Jakt &amp; Fiske AS. Organisasjonsnr. 987 654 321.</p>
          <p>Fraktfritt i Norge på ordre over 2500,-</p>
        </div>
      </div>
    </footer>
  );
}

/* Small floating chip used inside some pages */
export function CategoriesChip({
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
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a]">
          Våre Kategorier
        </p>
        <p className="text-[11px] text-[#8a96a1]">Jakt · Fiske · Friluftsliv</p>
      </div>
      <ArrowRight
        size={14}
        className="text-[#8a96a1] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1f2d3a]"
      />
    </button>
  );
}
