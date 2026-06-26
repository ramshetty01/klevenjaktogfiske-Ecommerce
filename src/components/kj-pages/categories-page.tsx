"use client";

import { Crosshair, Fish, Tent, Utensils, Shirt, Backpack, ArrowRight } from "lucide-react";
import type { PageId } from "../kj/header";
import { CategoriesChip } from "../kj/footer";

interface CategoriesPageProps {
  onNavigate: (page: PageId) => void;
}

const CATEGORIES = [
  {
    icon: Crosshair,
    title: "Jakt",
    description:
      "Presisjonsvåpen fra Sauer og Tikka, optikk fra Zeiss og Swarovski, termobekledning og alt annet du trenger for en vellykket jakt. Vi fører kun utstyr fra autoriserte forhandlere — kvalitet du kan stole på når det gjelder.",
    count: "320+ artikler",
    brands: "Sauer · Zeiss · Harkila · ThermTec",
  },
  {
    icon: Fish,
    title: "Fiske",
    description:
      "Fra havfiske til fluefiske i fjellet. Vi har stenger, sneller, agn og tilbehør fra de beste merkene — for nybegynnere som for den erfarne sportsfisker. Ekspertene våre fisker selv, og vet hva som fungerer.",
    count: "480+ artikler",
    brands: "Abel · Guideline · Svartvass · Bull Bay",
  },
  {
    icon: Tent,
    title: "Camping & Friluftsliv",
    description:
      "Telt, soveposer, kokeutstyr, hodelykter og alt du trenger for overnattingsturer i norsk natur. Vi har valgt ut produkter som tåler de tøffeste forholdene — fra fjellet til skogen til kysten.",
    count: "260+ artikler",
    brands: "Bergans · Fjellreven · Jerven · Thermos",
  },
  {
    icon: Utensils,
    title: "Kniver",
    description:
      "Norsk tradisjon møter moderne design. Vi fører kniver fra Helle, Fallkniven, Morakniv og Leatherman — fra enklebrukskniver til profesjonelle jaktkniver med tuppfeste og multiverktøy for enhver oppgave.",
    count: "95+ artikler",
    brands: "Helle · Fallkniven · Morakniv · Leatherman",
  },
  {
    icon: Shirt,
    title: "Bekledning",
    description:
      "Jaktklær, friluftsbekledning og utstyr som holder deg varm og tørr gjennom hele sesongen. Vi fører Fjellreven, Bergans, Harkila og Jerven — bekledning designet for og testet i skandinaviske forhold.",
    count: "180+ artikler",
    brands: "Fjellreven · Bergans · Harkila · Jerven",
  },
  {
    icon: Backpack,
    title: "Sekker & Ryggsekker",
    description:
      "Dagsekker, ekspedisjonssekker og alt imellom. Bergans, Osprey, Fjellreven og Eagel Products — valgt for komfort, holdbarhet og funksjonalitet uansett hvor langt du skal gå.",
    count: "75+ artikler",
    brands: "Bergans · Osprey · Fjellreven · Eagel Products",
  },
];

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  return (
    <div className="kj-page-enter" style={{ backgroundColor: "#f5f1e8" }}>
      <section className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#8a96a1]">
            Vårt Sortiment
          </p>
          <h1
            className="text-[clamp(2.75rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#1f2d3a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Våre Kategorier
          </h1>
          <p className="mt-6 max-w-2xl text-[20px] font-light leading-relaxed text-[#3a4856]">
            Seks hovedkategorier, over 1 200 artikler. Hver kategori er kuratert
            av eksperter som kjenner utstyret innvendig — fordi de bruker det
            selv.
          </p>
        </div>

        {/* Category list */}
        <div className="flex flex-col">
          {CATEGORIES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="border-t border-black/10 py-10 last:border-b"
              >
                {/* Icon + heading inline */}
                <div className="mb-3 flex items-center gap-3 text-[#6b7884]">
                  <Icon size={28} strokeWidth={1.4} />
                  <h2 className="text-[22px] font-semibold text-[#1f2d3a]">
                    {f.title}
                  </h2>
                  <span className="ml-2 rounded-full bg-[#f0c548]/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a]">
                    {f.count}
                  </span>
                </div>
                <p className="max-w-2xl pl-0 text-[17px] font-light leading-[1.75] text-[#3a4856] md:pl-10">
                  {f.description}
                </p>
                <p className="mt-3 pl-0 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1] md:pl-10">
                  Merkevarer: <span className="text-[#1f2d3a]">{f.brands}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer CTA area */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[8px] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] md:flex-row md:items-center">
          <div>
            <h3 className="text-[20px] font-semibold text-[#1f2d3a]">
              Klar for å handle?
            </h3>
            <p className="mt-1 text-[14px] font-light text-[#6b7884]">
              Utforsk hele sortimentet med over 1 200 artikler på lager.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CategoriesChip onClick={() => onNavigate("about")} />
            <button
              onClick={() => onNavigate("shop")}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2d3a] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#15202b]"
            >
              Til Butikken
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
