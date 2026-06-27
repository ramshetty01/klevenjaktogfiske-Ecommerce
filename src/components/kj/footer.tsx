"use client";

import { Instagram, Facebook, MapPin, Phone, Mail, ArrowRight, Clock } from "lucide-react";
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

  const serviceLinks: { label: string; href?: string }[] = [
    { label: t("footer.terms") },
    { label: t("footer.shipping") },
    { label: t("footer.returns") },
    { label: t("footer.privacy") },
    { label: t("footer.contact") },
  ];

  const hours: { day: string; time: string; closed?: boolean; highlight?: boolean }[] = [
    { day: t("footer.mon"), time: "08:30 – 16:30" },
    { day: t("footer.tue"), time: "08:30 – 16:30" },
    { day: t("footer.wed"), time: "08:30 – 16:30" },
    { day: t("footer.thu"), time: "08:30 – 18:00", highlight: true },
    { day: t("footer.fri"), time: "08:30 – 16:30" },
    { day: t("footer.sat"), time: "10:00 – 15:00" },
    { day: t("footer.sun"), time: t("footer.closed"), closed: true },
  ];

  return (
    <footer
      className="relative w-full border-t border-white/10 text-white"
      style={{ backgroundColor: "#20231F" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-10">
        {/* ===== 4-COLUMN GRID ===== */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Column 1: KLEVEN — brand + tagline + contact + socials */}
          <div className="flex flex-col">
            {/* Brand */}
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/kleven-logo.png"
                alt="Kleven Jakt & Fiske"
                className="h-10 w-auto"
              />
            </div>

            {/* Tagline */}
            <p className="mb-5 text-[12px] font-light leading-relaxed text-[#687066]">
              {t("footer.tagline")}
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2.5 text-[12px] font-light text-[#687066]">
              <a
                href="tel:+4778407140"
                className="flex items-center gap-2 transition-colors hover:text-[#287E05]"
              >
                <Phone size={13} strokeWidth={1.6} className="text-[#287E05]" />
                78 40 71 40
              </a>
              <a
                href="mailto:Camilla@klevenjakt-fiske.no"
                className="flex items-center gap-2 transition-colors hover:text-[#287E05]"
              >
                <Mail size={13} strokeWidth={1.6} className="text-[#287E05]" />
                <span className="break-all">Camilla@klevenjakt-fiske.no</span>
              </a>
              <span className="flex items-start gap-2">
                <MapPin
                  size={13}
                  strokeWidth={1.6}
                  className="mt-0.5 flex-shrink-0 text-[#287E05]"
                />
                <span>
                  Brenneriveien 2
                  <br />
                  9601 Hammerfest, {lang === "no" ? "Norge" : "Norway"}
                </span>
              </span>
            </div>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-2.5">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:bg-[#287E05] hover:text-[#20231F] hover:scale-105"
                >
                  <Icon size={14} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="flex flex-col">
            <h4 className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#287E05]">
              <span className="h-px w-6 bg-[#287E05]" />
              {t("footer.categories")}
            </h4>
            <ul className="grid grid-cols-1 gap-2.5 text-[13px] font-light text-[#687066]">
              {categoryLinks.map((c) => (
                <li key={c.label}>
                  <button
                    onClick={() =>
                      go("shop", c.slug ? { shopFilters: { category: c.slug } } : undefined)
                    }
                    className="text-left transition-colors hover:text-[#287E05]"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="flex flex-col">
            <h4 className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#287E05]">
              <span className="h-px w-6 bg-[#287E05]" />
              {t("footer.customerService")}
            </h4>
            <ul className="grid grid-cols-1 gap-2.5 text-[13px] font-light text-[#687066]">
              {serviceLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href ?? "#"}
                    className="transition-colors hover:text-[#287E05]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="flex flex-col">
            <h4 className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#287E05]">
              <span className="h-px w-6 bg-[#287E05]" />
              <Clock size={13} strokeWidth={2} />
              {t("footer.openingHours")}
            </h4>
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
              <ul className="divide-y divide-white/5">
                {hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between gap-4 px-4 py-2 text-[12px]"
                  >
                    <span className="font-light text-[#687066]">{h.day}</span>
                    <span
                      className={`font-medium ${
                        h.closed
                          ? "text-[#687066]"
                          : h.highlight
                          ? "text-[#287E05]"
                          : "text-white"
                      }`}
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Bottom: Copyright ===== */}
        <div className="mt-12 flex flex-col gap-1 border-t border-white/10 pt-6 text-[12px] font-light text-[#687066] sm:flex-row sm:items-center sm:justify-between">
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
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#20231F]">
          {t("nav.categories")}
        </p>
        <p className="text-[11px] text-[#687066]">
          {lang === "no" ? "Jakt · Fiske · Friluftsliv" : "Hunt · Fish · Outdoors"}
        </p>
      </div>
      <ArrowRight
        size={14}
        className="text-[#687066] transition-transform group-hover:translate-x-0.5 group-hover:text-[#20231F]"
      />
    </button>
  );
}
