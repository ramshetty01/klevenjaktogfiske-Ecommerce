"use client";

import { Instagram, Facebook, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/kj/lang-store";
import type { PageId, NavContext } from "./header";

interface FooterProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t, lang } = useLang();
  const go = (page: PageId, ctx?: NavContext) => {
    onNavigate(page, ctx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoryLinks: { label: string; slug?: string }[] = [
    { label: lang === "no" ? "Jaktutstyr" : "Hunting Gear", slug: "jakt" },
    { label: lang === "no" ? "Fiskeutstyr" : "Fishing Gear", slug: "fiske" },
    { label: lang === "no" ? "Camping & Friluftsliv" : "Camping & Outdoors", slug: "camping" },
    { label: lang === "no" ? "Bekledning" : "Clothing", slug: "klær" },
    { label: lang === "no" ? "Vintersport" : "Winter Sports", slug: "vintersport" },
    { label: lang === "no" ? "Husdyr" : "Pets", slug: "kjæledyr" },
    { label: lang === "no" ? "Fottøy" : "Footwear", slug: "fottøy1" },
    { label: "Outlet", slug: "outlet" },
  ];

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
                {t("nav.brandSubtitle")} AS
              </div>
            </div>

            <p className="mb-6 max-w-xs text-[13px] font-light leading-relaxed text-[#b8c0c8]">
              {t("footer.tagline")}
            </p>

            <div className="flex flex-col gap-3 text-[13px] font-light text-[#b8c0c8]">
              <a
                href="tel:+4778407140"
                className="flex items-center gap-2 hover:text-white"
              >
                <Phone size={14} strokeWidth={1.6} className="text-[#f0c548]" />
                78 40 71 40
              </a>
              <a
                href="mailto:Camilla@klevenjakt-fiske.no"
                className="flex items-center gap-2 hover:text-white"
              >
                <Mail size={14} strokeWidth={1.6} className="text-[#f0c548]" />
                Camilla@klevenjakt-fiske.no
              </a>
              <span className="flex items-start gap-2">
                <MapPin
                  size={14}
                  strokeWidth={1.6}
                  className="mt-0.5 text-[#f0c548]"
                />
                <span>
                  Brenneriveien 2
                  <br />
                  9601 Hammerfest, {lang === "no" ? "Norge" : "Norway"}
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
              {t("footer.categories")}
            </h4>
            <div className="flex flex-col gap-3 text-[13px] font-light text-[#b8c0c8]">
              {categoryLinks.map((c) => (
                <button
                  key={c.label}
                  onClick={() =>
                    go("shop", c.slug ? { shopFilters: { category: c.slug } } : undefined)
                  }
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
              {t("footer.customerService")}
            </h4>
            <div className="flex flex-col gap-3 text-[13px] font-light text-[#b8c0c8]">
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.terms")}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.shipping")}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.returns")}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.privacy")}
              </a>
              <a href="#" className="transition-colors hover:text-white">
                {t("footer.contact")}
              </a>
            </div>

            {/* Opening hours */}
            <div className="mt-6 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-[12px] font-light text-[#b8c0c8]">
              <p className="font-semibold text-white">{t("footer.openingHours")}</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.mon")}</span>
                  <span>08:30 – 16:30</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.tue")}</span>
                  <span>08:30 – 16:30</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.wed")}</span>
                  <span>08:30 – 16:30</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.thu")}</span>
                  <span className="text-[#f0c548]">08:30 – 18:00</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.fri")}</span>
                  <span>08:30 – 16:30</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.sat")}</span>
                  <span>10:00 – 15:00</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>{t("footer.sun")}</span>
                  <span className="text-[#8a96a1]">{t("footer.closed")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-white/10 pt-6 text-[12px] font-light text-[#8a96a1] sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright")}</p>
          <p>{t("footer.freeShippingNote")}</p>
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
  const { t, lang } = useLang();
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-3 text-left shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
    >
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a]">
          {t("nav.categories")}
        </p>
        <p className="text-[11px] text-[#8a96a1]">
          {lang === "no" ? "Jakt · Fiske · Friluftsliv" : "Hunt · Fish · Outdoors"}
        </p>
      </div>
      <ArrowRight
        size={14}
        className="text-[#8a96a1] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1f2d3a]"
      />
    </button>
  );
}
