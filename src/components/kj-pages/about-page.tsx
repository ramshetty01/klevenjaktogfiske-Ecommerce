"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
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
          "linear-gradient(180deg, #F4F4F4 0%, #EAF4E6 50%, #F4F4F4 100%)",
      }}
    >
      {/* Hero banner — Kleven store under northern lights */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[40vh] min-h-[280px] w-full">
          { }
          <Image
            src="/images/kelven-hero.webp"
            alt="Kleven Jakt & Fiske butikk under nordlyset i Hammerfest"
            fill
            priority
            sizes="100vw"
            quality={82}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#212121]/80 via-[#212121]/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1280px] px-4 pb-6 sm:px-6 sm:pb-8 lg:px-10">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#428701]"
              >
                {t("about.heroLocation")}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-bold text-white"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {t("about.address")}
              </motion.h2>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-10 max-w-3xl sm:mb-16">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#858585]">
            {t("about.aboutUs")}
          </p>
          <h1
            className="text-[clamp(3rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#212121]"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            {t("about.title")}
          </h1>
          <p className="mt-6 text-[20px] font-medium text-[#212121]">
            {t("about.since")}
          </p>
        </div>

        {/* Two-column: image + text */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[8px] shadow-[0_20px_50px_rgba(31,45,58,0.25)]">
              { }
              <Image
                src="/images/about-heritage.webp"
                alt="En mann i rød genser viser stolt frem to store fisker til en ung gutt på en skogsti — et øyeblikk av tradisjonsoverføring"
                fill
                sizes="(max-width: 1023px) calc(100vw - 32px), 420px"
                quality={80}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Small badge */}
            <div className="absolute -bottom-5 -right-5 hidden rounded-lg bg-white px-5 py-4 shadow-[0_10px_25px_rgba(31,45,58,0.18)] sm:block">
              <div className="text-[24px] font-bold text-[#212121]">40+</div>
              <div className="text-[11px] font-light uppercase tracking-[0.1em] text-[#858585]">
                {t("about.yearsBadge")}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="max-w-[680px]">
            <p className="text-[18px] font-light leading-[1.85] text-[#212121]">
              {t("about.p1")}
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#212121]">
              {t("about.p2")}
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#212121]">
              {t("about.p3")}
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#212121]">
              {t("about.p4")}
            </p>

            {/* Signature */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#212121]/15" />
              <span className="text-[14px] font-light italic text-[#858585]">
                {t("about.signature")}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate("categories")}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#212121] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#428701] shadow-[0_8px_24px_rgba(31,45,58,0.25)] transition-all duration-300 hover:bg-[#0056a7] hover:shadow-[0_12px_30px_rgba(31,45,58,0.35)]"
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
            { v: "40+", l: t("about.statsYears") },
            { v: "4 300+", l: t("about.statsItems") },
            { v: "400+", l: t("about.statsBrands") },
            { v: "30k+", l: t("about.statsCustomers") },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[clamp(2rem,3vw,2.75rem)] font-bold text-[#212121]">
                {s.v}
              </div>
              <div className="mt-2 text-[12px] font-light uppercase tracking-[0.15em] text-[#858585]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
