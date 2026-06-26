"use client";

import { ArrowRight } from "lucide-react";
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
  // FISKE — Complete sets & combos
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

  // TELT — Pop-up
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

  // HUND — "Stort utvalg til din beste venn"
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

const GROUPS: { id: Product["group"]; title: string; subtitle: string }[] = [
  {
    id: "Fiske",
    title: "Fiskeutstyr",
    subtitle: "Komplettsett, sneller, agn og stenger",
  },
  {
    id: "Ild & Grill",
    title: "Ild & Grill",
    subtitle: "Bålpanner og bærbare griller",
  },
  {
    id: "Kniver",
    title: "Kniver",
    subtitle: "Norsk håndverk og allroundkniver",
  },
  {
    id: "Telt",
    title: "Pop-up Telt",
    subtitle: "For bruk hele året",
  },
  {
    id: "Tilbehør Telt",
    title: "Telttilbehør",
    subtitle: "Regntrekk, gulv og innertelt",
  },
  {
    id: "Hund",
    title: "Til Din Beste Venn",
    subtitle: "Stort utvalg til hunden",
  },
];

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

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-10 pt-2 lg:gap-16 lg:px-10 lg:py-14 lg:pt-6">
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
        </div>
      </section>

      {/* PRODUCTS — grouped catalog below hero */}
      <section className="bg-[#f5f1e8]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          {/* Section heading */}
          <div className="mb-12 max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8a96a1]">
              Vårt Utvalg
            </p>
            <h2
              className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#1f2d3a]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Populære Produkter
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-[#6b7884]">
              Håndplukkede produkter fra de merkevareene norske friluftsfolk
              stoler på. Fri frakt i Norge på ordre over 2 500,-.
            </p>
          </div>

          {/* Grouped product lists */}
          {GROUPS.map((group) => {
            const items = PRODUCTS.filter((p) => p.group === group.id);
            if (items.length === 0) return null;

            return (
              <div key={group.id} className="mb-14 last:mb-0">
                {/* Group heading */}
                <div className="mb-6 flex items-end justify-between border-b border-[#d4cfc1] pb-4">
                  <div>
                    <h3 className="text-[22px] font-bold tracking-[-0.01em] text-[#1f2d3a]">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-light text-[#6b7884]">
                      {group.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("shop")}
                    className="hidden items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] hover:underline sm:inline-flex"
                  >
                    Se alle <ArrowRight size={12} />
                  </button>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (
                    <article
                      key={p.name + p.subtitle}
                      className="group flex flex-col overflow-hidden rounded-[6px] border border-black/5 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(31,45,58,0.15)]"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#f4f3ef]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.img}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Top-left tag */}
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
                        {/* Top-right discount badge */}
                        {p.discount && (
                          <span className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#c75d2c] text-[11px] font-bold text-white">
                            -{p.discount}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
                        <h4 className="text-[13px] font-semibold leading-snug text-[#1f2d3a]">
                          {p.name}
                        </h4>
                        {p.subtitle && p.subtitle !== p.name && (
                          <p className="text-[11px] font-light text-[#8a96a1]">
                            {p.subtitle}
                          </p>
                        )}
                        {p.stock && (
                          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[#3d5e4f]">
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
    </div>
  );
}
