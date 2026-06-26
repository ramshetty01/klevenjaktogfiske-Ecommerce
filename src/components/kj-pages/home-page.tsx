"use client";

import { ArrowRight, Truck, ShieldCheck, Award } from "lucide-react";
import type { PageId } from "../kj/header";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

const CATEGORIES = [
  {
    label: "Jakt",
    count: "320+ artikler",
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    desc: "Våpen, optikk og bekledning",
  },
  {
    label: "Fiske",
    count: "480+ artikler",
    img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    desc: "Stenger, sneller og agn",
  },
  {
    label: "Camping",
    count: "260+ artikler",
    img: "https://sfile.chatglm.cn/images-ppt/c0a192b80802.jpg",
    desc: "Telt, soveposer og ovner",
  },
  {
    label: "Kniver",
    count: "95+ artikler",
    img: "https://sfile.chatglm.cn/images-ppt/718b6c83dd87.jpg",
    desc: "Jaktkniver og multiverktøy",
  },
];

const FEATURED = [
  {
    name: "Sauer 100 Highland XLT",
    price: "kr 14 990",
    img: "https://sfile.chatglm.cn/images-ppt/1e092c6839b8.jpg",
    tag: "Bestselger",
    cat: "Jakt",
  },
  {
    name: "Svartvass Havs fiskesett",
    price: "kr 2 290",
    img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    tag: "Nyhet",
    cat: "Fiske",
  },
  {
    name: "Helle Vegge Kniv",
    price: "kr 1 450",
    img: "https://sfile.chatglm.cn/images-ppt/718b6c83dd87.jpg",
    tag: "",
    cat: "Kniver",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="kj-page-enter">
      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* Fjord image backdrop */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://sfile.chatglm.cn/images-ppt/c38ec7daf628.jpg"
            alt="Norsk fjord landskap med tåke over fjellene"
            className="h-full w-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(31,45,58,0.92) 0%, rgba(31,45,58,0.75) 38%, rgba(31,45,58,0.35) 65%, rgba(31,45,58,0.15) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-32">
          {/* Text column */}
          <div className="flex flex-col items-start">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0c548]/40 bg-[#f0c548]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f0c548] backdrop-blur-sm">
              Siden 1985 · Norsk Eiet
            </span>

            <h1
              className="text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Ut på tur,
              <br />
              <span className="text-[#f0c548]">aldri sur!</span>
            </h1>

            <p className="mt-6 max-w-md text-[18px] font-light leading-relaxed text-white/85">
              Norsk kvalitetsutstyr for jakt, fiske og friluftsliv. Håndplukkede
              produkter fra de merkevareene nordmenn stoler på — med rådgivning
              fra ekte friluftsmennesker.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate("shop")}
                className="group inline-flex items-center gap-3 rounded-full bg-[#f0c548] px-9 py-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#1f2d3a] shadow-[0_8px_24px_rgba(240,197,72,0.35)] transition-all duration-300 hover:bg-[#d9a838] hover:shadow-[0_12px_30px_rgba(217,168,56,0.45)]"
              >
                Handle Nå
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="text-[13px] font-medium uppercase tracking-[0.12em] text-white underline-offset-4 hover:underline"
              >
                Vår Historie
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-14 flex flex-wrap gap-x-10 gap-y-6">
              {[
                { Icon: Truck, v: "Fraktfritt", l: "Over 2500,-" },
                { Icon: ShieldCheck, v: "30 dager", l: "Åpent kjøp" },
                { Icon: Award, v: "Ekte varer", l: "Fra autoriserte forhandlere" },
              ].map(({ Icon, v, l }) => (
                <div key={l} className="flex items-center gap-3">
                  <Icon size={22} strokeWidth={1.6} className="text-[#f0c548]" />
                  <div>
                    <div className="text-[14px] font-semibold text-white">
                      {v}
                    </div>
                    <div className="text-[11px] font-light uppercase tracking-[0.1em] text-white/65">
                      {l}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image column (visual chip) */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://sfile.chatglm.cn/images-ppt/46bfa558e93e.jpg"
                alt="Jeger i norsk skog på høsten"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d3a]/60 to-transparent" />
            </div>

            {/* Floating product chip */}
            <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-lg bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur md:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0c548] text-[#1f2d3a]">
                <ArrowRight size={16} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a]">
                  Høstkolleksjon
                </p>
                <p className="text-[11px] text-[#8a96a1]">Inntil 25% rabatt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-black/5 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => onNavigate("shop")}
              className="group relative flex flex-col items-start gap-1 overflow-hidden px-6 py-10 text-left transition-colors hover:bg-[#f5f1e8]"
            >
              <div className="absolute right-4 top-4 h-16 w-16 overflow-hidden rounded-full opacity-90 transition-transform duration-500 group-hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.label}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-[20px] font-semibold text-[#1f2d3a]">
                {c.label}
              </span>
              <span className="text-[12px] font-light uppercase tracking-[0.1em] text-[#8a96a1]">
                {c.desc}
              </span>
              <span className="mt-1 text-[12px] font-medium text-[#6b7884]">
                {c.count}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f2d3a] opacity-0 transition-opacity group-hover:opacity-100">
                Se alle <ArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[#f5f1e8]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10">
          <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a96a1]">
                Bestselgere
              </p>
              <h2
                className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#1f2d3a]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Anbefalte Produkter
              </h2>
            </div>
            <button
              onClick={() => onNavigate("shop")}
              className="hidden items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] hover:underline sm:inline-flex"
            >
              Se alle <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((p) => (
              <button
                key={p.name}
                onClick={() => onNavigate("shop")}
                className="group block rounded-[8px] border border-black/5 bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,45,58,0.15)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#f4f3ef]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        p.tag === "Nyhet"
                          ? "bg-[#1f2d3a] text-white"
                          : "bg-[#f0c548] text-[#1f2d3a]"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="px-2 py-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
                    {p.cat}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-[#1f2d3a]">
                      {p.name}
                    </span>
                    <span className="text-[15px] font-bold text-[#1f2d3a]">
                      {p.price}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY MINI SECTION */}
      <section className="relative w-full overflow-hidden bg-[#1f2d3a]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#f0c548]">
              Vår historie
            </p>
            <h2
              className="text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-tight tracking-[-0.01em] text-white"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Vi er Kleven Jakt &amp; Fiske
            </h2>
            <p className="mt-6 max-w-lg text-[16px] font-light leading-relaxed text-white/80">
              I over 40 år har vi utstyrt norske jegere, fiskere og friluftsfolk
              med kvalitetsutstyr som tåler norske forhold. Vårt team består av
              mennesker som selv bruker utstyret vi selger — fra fjellet til
              kysten.
            </p>
            <button
              onClick={() => onNavigate("about")}
              className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#f0c548] hover:underline"
            >
              Les mer om oss <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://sfile.chatglm.cn/images-ppt/e8a0a8db34cc.jpg"
              alt="Fluefiske i norsk elv ved solnedgang"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-[#f5f1e8]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[10px] border border-[#d4cfc1] bg-white p-8 md:flex-row md:items-center">
            <div>
              <h3
                className="text-[22px] font-bold text-[#1f2d3a]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Nyhetsmail
              </h3>
              <p className="mt-1 max-w-md text-[14px] font-light text-[#6b7884]">
                Få nyheter, kampanjer og gode tilbud direkte i innboksen. Vi
                sender cirka 1–2 ganger i måneden.
              </p>
            </div>
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="din@epost.no"
                className="flex-1 rounded-full border border-[#d4cfc1] bg-[#f5f1e8] px-5 py-3 text-[14px] text-[#1f2d3a] outline-none transition-colors placeholder:text-[#8a96a1] focus:border-[#f0c548]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#1f2d3a] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#15202b]"
              >
                Meld meg på
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
