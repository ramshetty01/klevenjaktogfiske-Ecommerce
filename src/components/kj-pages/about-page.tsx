"use client";

import { ArrowRight } from "lucide-react";
import type { PageId } from "../kj/header";

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div
      className="kj-page-enter"
      style={{
        background:
          "linear-gradient(180deg, #f5f1e8 0%, #efe9dc 50%, #e9e5db 100%)",
      }}
    >
      <section className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#8a96a1]">
            Om Oss
          </p>
          <h1
            className="text-[clamp(3rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#1f2d3a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Vi er Kleven
          </h1>
          <p className="mt-6 text-[20px] font-medium text-[#3a4856]">
            Ut på tur, aldri sur — siden 1985.
          </p>
        </div>

        {/* Two-column: image + text */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[8px] shadow-[0_20px_50px_rgba(31,45,58,0.25)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about-heritage.png"
                alt="En mann i rød genser viser stolt frem to store fisker til en ung gutt på en skogsti — et øyeblikk av tradisjonsoverføring"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Small badge */}
            <div className="absolute -bottom-5 -right-5 hidden rounded-lg bg-white px-5 py-4 shadow-[0_10px_25px_rgba(31,45,58,0.18)] sm:block">
              <div className="text-[24px] font-bold text-[#1f2d3a]">40+</div>
              <div className="text-[11px] font-light uppercase tracking-[0.1em] text-[#8a96a1]">
                År med felles
                <br />
                opplevelser
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
              <div className="h-px flex-1 bg-[#1f2d3a]/15" />
              <span className="text-[14px] font-light italic text-[#6b7884]">
                — Teamet hos Kleven Jakt &amp; Fiske
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate("categories")}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#1f2d3a] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#f0c548] shadow-[0_8px_24px_rgba(31,45,58,0.25)] transition-all duration-300 hover:bg-[#15202b] hover:shadow-[0_12px_30px_rgba(31,45,58,0.35)]"
            >
              Våre Kategorier
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
            { v: "40+", l: "År i bransjen" },
            { v: "1 200+", l: "Artikler på lager" },
            { v: "60+", l: "Merkevarer" },
            { v: "30k+", l: "Norske kunder" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[clamp(2rem,3vw,2.75rem)] font-bold text-[#1f2d3a]">
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
