"use client";

import { useEffect, useState } from "react";
import {
  Crosshair, Fish, Tent, Shirt, Snowflake, PawPrint,
  Footprints, Tag, Gift, Bug, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/kj/lang-store";
import type { PageId, NavContext } from "../kj/header";
import { CategoriesChip } from "../kj/footer";
import type { CategoryNode } from "@/lib/kj/types";

interface CategoriesPageProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

// Icon mapping by category slug — matches the real Kleven catalog slugs.
const ICON_BY_SLUG: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  jakt: Crosshair,
  fiske: Fish,
  camping: Tent,
  klær: Shirt,
  vintersport: Snowflake,
  kjæledyr: PawPrint,
  fottøy1: Footprints,
  outlet: Tag,
  "gift-card": Gift,
  "kleven-fluer": Bug,
};

const DESCRIPTIONS: Record<string, string> = {
  jakt: "Presisjonsvåpen fra Sauer og Tikka, optikk fra Zeiss og Swarovski, termobekledning og alt annet du trenger for en vellykket jakt. Vi fører kun utstyr fra autoriserte forhandlere — kvalitet du kan stole på når det gjelder.",
  fiske: "Fra havfiske til fluefiske i fjellet. Vi har stenger, sneller, agn og tilbehør fra de beste merkene — for nybegynnere som for den erfarne sportsfisker. Ekspertene våre fisker selv, og vet hva som fungerer.",
  camping: "Telt, soveposer, kokeutstyr, hodelykter og alt du trenger for overnattingsturer i norsk natur. Vi har valgt ut produkter som tåler de tøffeste forholdene — fra fjellet til skogen til kysten.",
  klær: "Jaktklær, friluftsbekledning og utstyr som holder deg varm og tørr gjennom hele sesongen. Vi fører Fjellreven, Bergans, Härkila og Jerven — bekledning designet for og testet i skandinaviske forhold.",
  vintersport: "Ski, skøyter, bindinger og tilbehør for vintersesongen. Åsnes, Fischer og Swix — alt du trenger for å komme deg ut på snøen.",
  kjæledyr: "Trekkingutstyr, hundemat og alt til din beste venn. Non-Stop Dogwear, Trixie og Provit — for hundekjøring, canicross og hverdagslivet med hunden.",
  fottøy1: "Jaktko, fjellstøvler og vadestøvler — fra Lundhags, Hestra og Bergans. Robust fottøy for alle årstider og underlag.",
  outlet: "Kvalitetsutstyr til reduserte priser. Begrensede antall — først til mølla. Outlet-varer kan ha kosmetiske feil, men full funksjonalitet og garanti.",
  "gift-card": "Perfekt gave til jegeren eller fiskeren. Digitalt gavekort på 500, 1000 eller 2500 kroner — leveres på e-post, gyldig i 2 år.",
  "kleven-fluer": "Håndbundne fluer fra Kleven Jakt & Fiske — laksefluer, ørretfluer, sjøørretfluer og tubefluer. Tradisjonsrikt håndverk fra Hammerfest.",
};

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const { t, lang } = useLang();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories ?? []);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="kj-page-enter" style={{ backgroundColor: "#f5f1e8" }}>
      <section className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#8a96a1]">
            {t("categories.ourRange")}
          </p>
          <h1
            className="text-[clamp(2.75rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#1f2d3a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {t("categories.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-[20px] font-light leading-relaxed text-[#3a4856]">
            Ti hovedkategorier, over 4 000 artikler. Hver kategori er kuratert
            av eksperter som kjenner utstyret innvendig — fordi de bruker det
            selv.
          </p>
        </div>

        {/* Category list */}
        <div className="flex flex-col">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-t border-black/10 py-10 last:border-b">
                <div className="h-6 w-40 animate-pulse rounded bg-black/5" />
                <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-black/5" />
                <div className="mt-2 h-4 w-3/4 max-w-2xl animate-pulse rounded bg-black/5" />
              </div>
            ))
            : categories.map((c, idx) => {
              const Icon = ICON_BY_SLUG[c.slug] ?? Tag;
              const description = DESCRIPTIONS[c.slug] ?? "Håndplukkede produkter fra kvalitetsmerker.";
              // Show subcategories as brand list
              const subs = c.subcategories.filter((s) => s.count > 0);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="border-t border-black/10 py-10 last:border-b"
                >
                  <div className="mb-3 flex items-center gap-3 text-[#6b7884]">
                    <Icon size={28} strokeWidth={1.4} />
                    <h2 className="text-[22px] font-semibold text-[#1f2d3a]">
                      {c.name}
                    </h2>
                    <button
                      onClick={() => onNavigate("shop", { shopFilters: { category: c.slug } })}
                      className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#1f2d3a] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#15202b]"
                    >
                      {lang === "no" ? "Se alle" : "See all"} ({c.count})
                      <ArrowRight size={12} />
                    </button>
                  </div>
                  <p className="max-w-2xl pl-0 text-[17px] font-light leading-[1.75] text-[#3a4856] md:pl-10">
                    {description}
                  </p>

                  {/* Subcategory chips */}
                  {subs.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 pl-0 md:pl-10">
                      {subs.slice(0, 8).map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => onNavigate("shop", { shopFilters: { subcategory: sub.slug } })}
                          className="rounded-full bg-[#f0c548]/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] transition-colors hover:bg-[#f0c548] hover:text-[#1f2d3a]"
                        >
                          {sub.name} ({sub.count})
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>

        {/* Footer CTA area */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[8px] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] md:flex-row md:items-center">
          <div>
            <h3 className="text-[20px] font-semibold text-[#1f2d3a]">
              {t("categories.readyToShop")}
            </h3>
            <p className="mt-1 text-[14px] font-light text-[#6b7884]">
              {t("categories.readyToShopDesc")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CategoriesChip onClick={() => onNavigate("about")} />
            <button
              onClick={() => onNavigate("shop")}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2d3a] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#15202b]"
            >
              {t("categories.toShop")}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
