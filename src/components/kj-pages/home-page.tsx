"use client";

import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Award,
  MapPin,
} from "lucide-react";
import type { PageId } from "../kj/header";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

interface Product {
  name: string;
  subtitle?: string;
  price: string;
  original?: string;
  discount?: string;
  img: string;
  tag?: string;
  stock?: string;
  group: "Fiske" | "Ild & Grill" | "Kniver" | "Telt" | "Tilbehør Telt" | "Hund";
}

const PRODUCTS: Product[] = [
  // FISKE
  {
    name: "#Nord Vidda 8'",
    subtitle: "Komplett fiskesett",
    price: "kr 1 699",
    img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    tag: "Bestselger",
    group: "Fiske",
  },
  {
    name: "#Nord Fjæra 9'",
    subtitle: "Komplett fiskesett",
    price: "kr 1 799",
    img: "https://sfile.chatglm.cn/images-ppt/6496eef3ed4e.jpg",
    group: "Fiske",
  },
  {
    name: "Pool 12 Accelerator",
    subtitle: "Fluefiske combo",
    price: "kr 2 999",
    img: "https://sfile.chatglm.cn/images-ppt/7c4578463445.jpg",
    tag: "Nyhet",
    group: "Fiske",
  },
  {
    name: "#Northern Alligator",
    subtitle: "Agn",
    price: "kr 69",
    img: "https://sfile.chatglm.cn/images-ppt/ec00f18b6c4c.jpg",
    group: "Fiske",
  },
  {
    name: "#North Scorpio 13g",
    subtitle: "Agn",
    price: "kr 59",
    img: "https://sfile.chatglm.cn/images-ppt/391eff434f76.jpg",
    group: "Fiske",
  },
  {
    name: "Sølvkroken SX Special 40",
    subtitle: "Limited Edition 8' 4–18g",
    price: "kr 4 990",
    img: "https://sfile.chatglm.cn/images-ppt/b08d3757a058.jpg",
    tag: "Begrenset",
    group: "Fiske",
  },

  // ILD & GRILL
  {
    name: "Bålpanne / Ildsted",
    subtitle: "Bålpanne / Ildsted",
    price: "kr 2 799",
    img: "https://sfile.chatglm.cn/images-ppt/511d20454805.jpg",
    group: "Ild & Grill",
  },
  {
    name: "LotusGrill Classic",
    subtitle: "Bærbar grill",
    price: "kr 3 140",
    img: "https://sfile.chatglm.cn/images-ppt/68a193c4b5cb.jpg",
    tag: "Bestselger",
    group: "Ild & Grill",
  },

  // KNIVER
  {
    name: "Brusletto Bamsen Masur",
    subtitle: "Knallgod Allround Kniv",
    price: "kr 1 599",
    img: "https://sfile.chatglm.cn/images-ppt/718b6c83dd87.jpg",
    group: "Kniver",
  },

  // TELT
  {
    name: "#Nord 6 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 14 999",
    img: "https://sfile.chatglm.cn/images-ppt/e8afc2db251f.jpg",
    stock: "20+ på lager",
    group: "Telt",
  },
  {
    name: "#Nord 8 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 16 999",
    img: "https://sfile.chatglm.cn/images-ppt/68aba7a27084.jpg",
    stock: "20+ på lager",
    group: "Telt",
  },
  {
    name: "#Nord 9 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 16 999",
    img: "https://sfile.chatglm.cn/images-ppt/f1163f0b7bce.jpg",
    stock: "20+ på lager",
    group: "Telt",
  },

  // TILBEHØR TELT
  {
    name: "Regntrekk til Pop-Up telt",
    subtitle: "Regntrekk",
    price: "Fra kr 1 200",
    img: "https://sfile.chatglm.cn/images-ppt/37ddf71eb9cb.jpg",
    stock: "20+ på lager",
    group: "Tilbehør Telt",
  },
  {
    name: "Gulv til isfisketelt",
    subtitle: "Gulv",
    price: "Fra kr 1 470",
    original: "kr 2 100",
    discount: "30%",
    img: "https://sfile.chatglm.cn/images-ppt/2ba5cae55a30.jpg",
    stock: "20+ på lager",
    tag: "Tilbud",
    group: "Tilbehør Telt",
  },
  {
    name: "Innertelt",
    subtitle: "Innertelt",
    price: "Fra kr 3 200",
    img: "https://sfile.chatglm.cn/images-ppt/fb2c1ac6bffc.jpg",
    stock: "20+ på lager",
    group: "Tilbehør Telt",
  },

  // HUND
  {
    name: "Non-Stop Trekking Bowl",
    subtitle: "Trekking skål",
    price: "Fra kr 259",
    img: "https://sfile.chatglm.cn/images-ppt/f8e4ba8a50d3.jpg",
    stock: "9 på lager",
    group: "Hund",
  },
  {
    name: "Beef Jerky 5kg",
    subtitle: "Beef Jerky 5kg",
    price: "kr 10",
    img: "https://sfile.chatglm.cn/images-ppt/4deb304f7225.jpg",
    stock: "100+ på lager",
    group: "Hund",
  },
  {
    name: "Fjord overall regn Jakke",
    subtitle: "Fjord overall — Sort",
    price: "kr 1 499",
    img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    stock: "13 på lager",
    group: "Hund",
  },
  {
    name: "Bungee tau 2 m",
    subtitle: "Bungee leash 2 m",
    price: "kr 649",
    img: "https://sfile.chatglm.cn/images-ppt/c0a192b80802.jpg",
    stock: "På vei 07/07/2026",
    group: "Hund",
  },
  {
    name: "Provit Extra Energy 185g",
    subtitle: "Provit Extra Energy",
    price: "kr 29",
    img: "https://sfile.chatglm.cn/images-ppt/03fad624c5b0.jpg",
    stock: "20+ på lager",
    group: "Hund",
  },
  {
    name: "Hals per stykk",
    subtitle: "Hals per stykk",
    price: "kr 20",
    img: "https://sfile.chatglm.cn/images-ppt/85b57c70fe64.jpeg",
    stock: "100+ på lager",
    group: "Hund",
  },
  {
    name: "Omega 3 Olje 300ml",
    subtitle: "Non-Stop Omega 3 Olje",
    price: "kr 258,75",
    img: "https://sfile.chatglm.cn/images-ppt/057f28164bd6.jpg",
    stock: "3 på lager",
    group: "Hund",
  },
  {
    name: "Provit Frossen Okse m/vitaminer 3kg",
    subtitle: "PROVIT Frossen Okse",
    price: "kr 199",
    img: "https://sfile.chatglm.cn/images-ppt/ca46f4f946e3.jpg",
    stock: "12 på lager",
    group: "Hund",
  },
];

const GROUPS: {
  id: Product["group"];
  title: string;
  subtitle: string;
  layout: "grid" | "feature";
}[] = [
  {
    id: "Fiske",
    title: "Fiskeutstyr",
    subtitle: "Komplettsett, sneller, agn og stenger",
    layout: "grid",
  },
  {
    id: "Telt",
    title: "Pop-up Telt",
    subtitle: "For bruk hele året",
    layout: "feature",
  },
  {
    id: "Ild & Grill",
    title: "Ild & Grill",
    subtitle: "Bålpanner og bærbare griller",
    layout: "grid",
  },
  {
    id: "Kniver",
    title: "Kniver",
    subtitle: "Norsk håndverk og allroundkniver",
    layout: "grid",
  },
  {
    id: "Tilbehør Telt",
    title: "Telttilbehør",
    subtitle: "Regntrekk, gulv og innertelt",
    layout: "grid",
  },
  {
    id: "Hund",
    title: "Til Din Beste Venn",
    subtitle: "Stort utvalg til hunden",
    layout: "grid",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="kj-page-enter">
      {/* ============ HERO ============ */}
      <section className="relative w-full overflow-hidden">
        {/* Deeper, more atmospheric gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #2d4a3e 0%, #1f2d3a 45%, #15202b 100%)",
          }}
        />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(240,197,72,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(45,74,62,0.4) 0%, transparent 50%)",
          }}
        />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-10 lg:py-20">
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

            <p className="mt-6 max-w-md text-[19px] font-light leading-relaxed text-white/80">
              Norsk kvalitetsutstyr for jakt, fiske og friluftsliv — fra
              mennesker som selv bruker utstyret vi selger.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate("shop")}
                className="group inline-flex items-center gap-3 rounded-full bg-[#f0c548] px-9 py-4 text-[14px] font-semibold uppercase tracking-[0.14em] text-[#1f2d3a] shadow-[0_8px_24px_rgba(240,197,72,0.35)] transition-all duration-300 hover:bg-[#d9a838] hover:shadow-[0_14px_34px_rgba(217,168,56,0.5)]"
              >
                Handle Nå
                <ArrowRight
                  size={16}
                  strokeWidth={2.4}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Vår Historie
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { Icon: Truck, v: "Fraktfritt", l: "Over 2 500,-" },
                { Icon: ShieldCheck, v: "30 dager", l: "Åpent kjøp" },
                { Icon: Award, v: "Ekte varer", l: "Autoriserte forhandlere" },
              ].map(({ Icon, v, l }) => (
                <div key={l} className="flex items-center gap-2.5">
                  <Icon size={20} strokeWidth={1.6} className="text-[#f0c548]" />
                  <div>
                    <div className="text-[13px] font-semibold text-white">
                      {v}
                    </div>
                    <div className="text-[10px] font-light uppercase tracking-[0.1em] text-white/55">
                      {l}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative flex justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[380px] overflow-hidden rounded-[14px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/kelven-hero.png"
                alt="Kleven Jakt & Fiske butikkbygning ved brygge med båt, snødekte fjell og nordlys i stjernehimmelen"
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay at bottom for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f2d3a]/40 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 hidden items-center gap-2.5 rounded-lg bg-white px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)] md:flex">
              <MapPin size={16} className="text-[#2d4a3e]" strokeWidth={2} />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a]">
                  Hammerfest
                </p>
                <p className="text-[10px] text-[#8a96a1]">9601, Norge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge: transition into products section */}
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #f5f1e8 100%)",
          }}
        />
      </section>

      {/* ============ PRODUCTS ============ */}
      <section className="relative bg-[#f5f1e8]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          {/* Section heading */}
          <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-[#d4cfc1] pb-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2d4a3e]">
                Vårt Utvalg
              </p>
              <h2
                className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.02em] text-[#1f2d3a]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Populære Produkter
              </h2>
              <p className="mt-3 text-[15px] font-light leading-relaxed text-[#6b7884]">
                Håndplukkede produkter fra de merkevareene norske friluftsfolk
                stoler på.
              </p>
            </div>
            <button
              onClick={() => onNavigate("shop")}
              className="group inline-flex items-center gap-2 rounded-full border border-[#1f2d3a]/15 bg-white px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1f2d3a] transition-all duration-300 hover:bg-[#1f2d3a] hover:text-white"
            >
              Se hele butikken
              <ArrowRight
                size={14}
                strokeWidth={2.2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          {/* Grouped product lists */}
          {GROUPS.map((group, groupIdx) => {
            const items = PRODUCTS.filter((p) => p.group === group.id);
            if (items.length === 0) return null;

            // Alternate background for visual rhythm
            const isAlt = groupIdx % 2 === 1;

            return (
              <div
                key={group.id}
                className={`mb-16 last:mb-0 ${
                  isAlt ? "rounded-[12px] bg-white/60 p-6 lg:p-8" : ""
                }`}
              >
                {/* Group heading */}
                <div className="mb-6 flex items-end justify-between border-b border-[#d4cfc1]/70 pb-4">
                  <div>
                    <h3
                      className="text-[24px] font-bold tracking-[-0.01em] text-[#1f2d3a]"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      {group.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-light text-[#6b7884]">
                      {group.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("shop")}
                    className="hidden items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1f2d3a] transition-colors hover:text-[#2d4a3e] sm:inline-flex"
                  >
                    Se alle <ArrowRight size={12} />
                  </button>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {items.map((p) => (
                    <article
                      key={p.name + p.subtitle}
                      className="group flex flex-col overflow-hidden rounded-[8px] border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(31,45,58,0.18)]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#f4f3ef]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.img}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {p.tag && (
                          <span
                            className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${
                              p.tag === "Tilbud"
                                ? "bg-[#c75d2c] text-white"
                                : p.tag === "Nyhet"
                                ? "bg-[#1f2d3a] text-white"
                                : p.tag === "Begrenset"
                                ? "bg-[#2d4a3e] text-white"
                                : "bg-[#f0c548] text-[#1f2d3a]"
                            }`}
                          >
                            {p.tag}
                          </span>
                        )}
                        {p.discount && (
                          <span className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#c75d2c] text-[11px] font-bold text-white shadow-md">
                            -{p.discount}
                          </span>
                        )}
                        {/* Quick add button on hover */}
                        <button
                          aria-label="Legg i handlevogn"
                          className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-white text-[#1f2d3a] opacity-0 shadow-md transition-all duration-300 hover:bg-[#f0c548] group-hover:translate-y-0 group-hover:opacity-100"
                        >
                          <ArrowRight size={14} strokeWidth={2} />
                        </button>
                      </div>

                      <div className="flex flex-1 flex-col gap-0.5 px-3 py-3">
                        <h4 className="text-[13px] font-semibold leading-snug text-[#1f2d3a] line-clamp-2">
                          {p.name}
                        </h4>
                        {p.subtitle && p.subtitle !== p.name && (
                          <p className="text-[11px] font-light text-[#8a96a1] line-clamp-1">
                            {p.subtitle}
                          </p>
                        )}
                        {p.stock && (
                          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-[#3d5e4f]">
                            {p.stock}
                          </p>
                        )}
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-[14px] font-bold text-[#1f2d3a]">
                            {p.price}
                          </span>
                          {p.original && (
                            <span className="text-[11px] font-light text-[#a0a8b0] line-through">
                              {p.original}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ BRAND PROMISE BAND ============ */}
      <section className="relative overflow-hidden bg-[#1f2d3a]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, rgba(240,197,72,0.3) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                Icon: Award,
                title: "Kvalitetsutstyr",
                text: "Hvert produkt er felttestet av vårt eget team før det havner på hylla.",
              },
              {
                Icon: Truck,
                title: "Rask Levering",
                text: "Fraktfritt i Norge på ordre over 2 500,-. Levering 2–4 dager.",
              },
              {
                Icon: MapPin,
                title: "Lokal Forhandler",
                text: "Brenneriveien 2, 9601 Hammerfest. Besøk oss eller handle online.",
              },
            ].map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#f0c548]/15 text-[#f0c548]">
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-white">
                    {title}
                  </h4>
                  <p className="mt-1 text-[13px] font-light leading-relaxed text-white/70">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
