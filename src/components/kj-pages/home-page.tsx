"use client";

import { ArrowRight } from "lucide-react";
import type { PageId } from "../kj/header";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="kj-page-enter">
      {/* HERO — minimal split layout matching reference screenshot */}
      <section className="relative w-full overflow-hidden">
        {/* Soft light-blue gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #b9cdd9 0%, #c5d6e0 55%, #d2e0e8 100%)",
          }}
        />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-10 pt-2 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-14 lg:pt-6">
          {/* Text column */}
          <div className="flex flex-col items-start">
            <h1
              className="text-[clamp(3.25rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-[#1f2d3a]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Ut på tur,
              <br />
              <span className="text-[#1f2d3a]">aldri sur!</span>
            </h1>

            <p className="mt-6 max-w-md text-[20px] font-light leading-relaxed text-[#3a4856]">
              Norsk kvalitetsutstyr for jakt, fiske og friluftsliv.
            </p>

            <div className="mt-10">
              <button
                onClick={() => onNavigate("shop")}
                className="group inline-flex items-center gap-3 rounded-full bg-[#f0c548] px-9 py-4 text-[15px] font-semibold uppercase tracking-[0.12em] text-[#1f2d3a] shadow-[0_8px_24px_rgba(240,197,72,0.30)] transition-all duration-300 hover:bg-[#d9a838] hover:shadow-[0_12px_30px_rgba(217,168,56,0.40)]"
              >
                Handle Nå
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* Single hero image — clean, no overlays, no chips */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] shadow-[0_30px_60px_-15px_rgba(31,45,58,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/kelven-hero.png"
                alt="Kleven Jakt & Fiske butikkbygning ved brygge med båt, snødekte fjell og nordlys i stjernehimmelen"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
