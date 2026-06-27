"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/kj/lang-store";
import type { PageId, NavContext } from "../kj/header";

interface AboutPageProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { t, lang } = useLang();
  return (
    <div
      className="kj-page-enter"
      style={{
        background:
          "linear-gradient(180deg, #f5f1e8 0%, #efe9dc 50%, #e9e5db 100%)",
      }}
    >
      {/* Hero banner — Kleven store under northern lights */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[40vh] min-h-[280px] w-full">
          { }
          <img
            src="/images/kelven-hero.png"
            alt="Kleven Jakt & Fiske butikk under nordlyset i Hammerfest"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1280px] px-6 pb-8 lg:px-10">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]"
              >
                Hammerfest · 70°N
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-bold text-white"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Brenneriveien 2 · 9601 Hammerfest
              </motion.h2>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#8a96a1]">
            {t("about.aboutUs")}
          </p>
          <h1
            className="text-[clamp(3rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {t("about.title")}
          </h1>
          <p className="mt-6 text-[20px] font-medium text-[#3a4856]">
            {t("about.since")}
          </p>
        </div>

        {/* Two-column: image + text */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[8px] shadow-[0_20px_50px_rgba(31,45,58,0.25)]">
              { }
              <img
                src="/images/about-heritage.png"
                alt="En mann i rød genser viser stolt frem to store fisker til en ung gutt på en skogsti — et øyeblikk av tradisjonsoverføring"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Small badge */}
            <div className="absolute -bottom-5 -right-5 hidden rounded-lg bg-white px-5 py-4 shadow-[0_10px_25px_rgba(31,45,58,0.18)] sm:block">
              <div className="text-[24px] font-bold text-[#1a1a1a]">40+</div>
              <div className="text-[11px] font-light uppercase tracking-[0.1em] text-[#8a96a1]">
                {t("about.yearsBadge")}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="max-w-[680px]">
            <p className="text-[18px] font-light leading-[1.85] text-[#3a4856]">
              Kleven Jakt &amp; Fiske startet som en liten butikk i Lyngdal i
              1985 — et sted hvor lokale jegere og fiskere kunne finne utstyr
              som faktisk fungerte i norsk natur. Det begynte med enighet om én
              ting: dersom vi ikke ville bruke det selv, skulle vi ikke selge
              det.
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#3a4856]">
              Førti år senere er vi fortsatt den samme butikken, men vi har
              vokst. Vårt utvalg spenner nå fra presisjonsvåpen og optikk til
              fluefiskeutstyr, kniver, telt og bekledning fra de beste
              skandinaviske og internasjonale merkevareene. Vi er stolte av å
              være autoriserte forhandlere for merker som Sauer, Zeiss, Helle,
              Fjellreven, Bergans og Harkila.
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#3a4856]">
              Det som ikke har endret seg er folka våre. Teamet består av
              erfarne jegere, fiskere og friluftsfolk som kjenner utstyret
              innvendig — fordi de selv bruker det hver eneste sesong. Hos oss
              får du råd fra mennesker som faktisk har vært ute i skogen, på
              fjellet eller på havet.
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#3a4856]">
              For oss handler jakt og fiske om mer enn utstyr. Det handler om
              tradisjoner som føres videre — fra den som viser en ung gutt sin
              første fisk, til felles opplevelser rundt leirbålet. Derfor
              selger vi bare utstyr vi selv ville delt med våre egne barn.
            </p>

            {/* Signature */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#1a1a1a]/15" />
              <span className="text-[14px] font-light italic text-[#6b7884]">
                {t("about.signature")}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate("categories")}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d4af37] shadow-[0_8px_24px_rgba(31,45,58,0.25)] transition-all duration-300 hover:bg-[#121212] hover:shadow-[0_12px_30px_rgba(31,45,58,0.35)]"
            >
              {t("about.cta")}
              <ArrowRight
                size={16}
                strokeWidth={2.2}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-black/10 pt-12 md:grid-cols-4">
          {[
            { v: "40+", l: lang === "no" ? "År i bransjen" : "Years in business" },
            { v: "4 300+", l: lang === "no" ? "Artikler på lager" : "Articles in stock" },
            { v: "400+", l: lang === "no" ? "Merkevarer" : "Brands" },
            { v: "30k+", l: lang === "no" ? "Norske kunder" : "Norwegian customers" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[clamp(2rem,3vw,2.75rem)] font-bold text-[#1a1a1a]">
                {s.v}
              </div>
              <div className="mt-2 text-[12px] font-light uppercase tracking-[0.15em] text-[#6b7884]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
