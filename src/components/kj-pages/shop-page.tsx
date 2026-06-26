"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ShippingBanner } from "../kj/shipping-banner";

type Category =
  | "Camping"
  | "Fiske"
  | "Footwear"
  | "Gavekort"
  | "Jakt"
  | "Husdyr"
  | "Kleven Fluer"
  | "Bekledning"
  | "Outlet"
  | "Vintersport";

interface Product {
  name: string;
  subtitle?: string;
  price: string;
  original?: string;
  img: string;
  tag?: string;
  stock?: string;
  category: Category;
}

const PRODUCTS: Product[] = [
  // ============ CAMPING ============
  {
    name: "#Nord 6 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 14 999",
    img: "https://sfile.chatglm.cn/images-ppt/e8afc2db251f.jpg",
    tag: "Bestselger",
    stock: "20+ på lager",
    category: "Camping",
  },
  {
    name: "#Nord 8 Model 2025",
    subtitle: "Pop-up telt for hele året",
    price: "kr 16 999",
    img: "https://sfile.chatglm.cn/images-ppt/68aba7a27084.jpg",
    stock: "20+ på lager",
    category: "Camping",
  },
  {
    name: "Bålpanne / Ildsted",
    subtitle: "Bålpanne",
    price: "kr 2 799",
    img: "https://sfile.chatglm.cn/images-ppt/511d20454805.jpg",
    category: "Camping",
  },
  {
    name: "LotusGrill Classic",
    subtitle: "Bærbar grill",
    price: "kr 3 140",
    img: "https://sfile.chatglm.cn/images-ppt/68a193c4b5cb.jpg",
    tag: "Nyhet",
    category: "Camping",
  },
  {
    name: "Regntrekk til Pop-Up telt",
    subtitle: "Regntrekk",
    price: "Fra kr 1 200",
    img: "https://sfile.chatglm.cn/images-ppt/37ddf71eb9cb.jpg",
    stock: "20+ på lager",
    category: "Camping",
  },
  {
    name: "Innertelt",
    subtitle: "Innertelt",
    price: "Fra kr 3 200",
    img: "https://sfile.chatglm.cn/images-ppt/fb2c1ac6bffc.jpg",
    stock: "20+ på lager",
    category: "Camping",
  },

  // ============ FISKE ============
  {
    name: "#Nord Vidda 8'",
    subtitle: "Komplett fiskesett",
    price: "kr 1 699",
    img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    tag: "Bestselger",
    category: "Fiske",
  },
  {
    name: "#Nord Fjæra 9'",
    subtitle: "Komplett fiskesett",
    price: "kr 1 799",
    img: "https://sfile.chatglm.cn/images-ppt/6496eef3ed4e.jpg",
    category: "Fiske",
  },
  {
    name: "Pool 12 Accelerator",
    subtitle: "Fluefiske combo",
    price: "kr 2 999",
    img: "https://sfile.chatglm.cn/images-ppt/7c4578463445.jpg",
    tag: "Nyhet",
    category: "Fiske",
  },
  {
    name: "Sølvkroken SX Special 40",
    subtitle: "Limited Edition 8' 4–18g",
    price: "kr 4 990",
    img: "https://sfile.chatglm.cn/images-ppt/b08d3757a058.jpg",
    tag: "Begrenset",
    category: "Fiske",
  },
  {
    name: "#Northern Alligator",
    subtitle: "Agn",
    price: "kr 69",
    img: "https://sfile.chatglm.cn/images-ppt/ec00f18b6c4c.jpg",
    category: "Fiske",
  },
  {
    name: "#North Scorpio 13g",
    subtitle: "Agn",
    price: "kr 59",
    img: "https://sfile.chatglm.cn/images-ppt/391eff434f76.jpg",
    category: "Fiske",
  },

  // ============ FOOTWEAR ============
  {
    name: "Harkila Pro Hunter Boot",
    subtitle: "Vannavstøtende jaktko",
    price: "kr 3 490",
    img: "https://sfile.chatglm.cn/images-ppt/b77fba9987e5.jpg",
    tag: "Bestselger",
    category: "Footwear",
  },
  {
    name: "Lundhags Tornby Sole",
    subtitle: "Allround fjellstøvel",
    price: "kr 2 890",
    original: "kr 3 290",
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "Tilbud",
    category: "Footwear",
  },
  {
    name: "Aigle Parcours 2 ISO",
    subtitle: "Vadestøvel med isolasjon",
    price: "kr 2 490",
    img: "https://sfile.chatglm.cn/images-ppt/74620968cbac.jpg",
    category: "Footwear",
  },

  // ============ GAVEKORT ============
  {
    name: "Gavekort kr 500",
    subtitle: "Digitalt gavekort",
    price: "kr 500",
    img: "https://sfile.chatglm.cn/images-ppt/ec7f1e008582.jpg",
    category: "Gavekort",
  },
  {
    name: "Gavekort kr 1000",
    subtitle: "Digitalt gavekort",
    price: "kr 1 000",
    img: "https://sfile.chatglm.cn/images-ppt/4ef7051f7361.jpg",
    tag: "Populært",
    category: "Gavekort",
  },
  {
    name: "Gavekort kr 2500",
    subtitle: "Digitalt gavekort — fri frakt",
    price: "kr 2 500",
    img: "https://sfile.chatglm.cn/images-ppt/9abfed96bd32.jpg",
    category: "Gavekort",
  },

  // ============ JAKT ============
  {
    name: "Sauer 100 Highland XLT",
    subtitle: "Presisjonsrifle",
    price: "kr 14 990",
    img: "https://sfile.chatglm.cn/images-ppt/1e092c6839b8.jpg",
    tag: "Bestselger",
    category: "Jakt",
  },
  {
    name: "Zeiss Conquest HD 10x42",
    subtitle: "Kikkert",
    price: "kr 8 490",
    original: "kr 9 990",
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "Tilbud",
    category: "Jakt",
  },
  {
    name: "ThermTec Cyclops 235",
    subtitle: "Termisk kamera",
    price: "kr 22 500",
    img: "https://sfile.chatglm.cn/images-ppt/b7d97df6e6e1.png",
    tag: "Nyhet",
    category: "Jakt",
  },

  // ============ HUSDYR ============
  {
    name: "Non-Stop Trekking Bowl",
    subtitle: "Trekking skål",
    price: "Fra kr 259",
    img: "https://sfile.chatglm.cn/images-ppt/f8e4ba8a50d3.jpg",
    stock: "9 på lager",
    category: "Husdyr",
  },
  {
    name: "Fjord Overall Regn Jakke",
    subtitle: "Sort — hund",
    price: "kr 1 499",
    img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    stock: "13 på lager",
    category: "Husdyr",
  },
  {
    name: "Bungee Tau 2 m",
    subtitle: "Bungee leash",
    price: "kr 649",
    img: "https://sfile.chatglm.cn/images-ppt/c0a192b80802.jpg",
    stock: "På vei 07/07",
    category: "Husdyr",
  },
  {
    name: "Omega 3 Olje 300ml",
    subtitle: "Non-Stop Omega 3",
    price: "kr 258,75",
    img: "https://sfile.chatglm.cn/images-ppt/057f28164bd6.jpg",
    stock: "3 på lager",
    category: "Husdyr",
  },
  {
    name: "Provit Frossen Okse 3kg",
    subtitle: "m/vitaminer",
    price: "kr 199",
    img: "https://sfile.chatglm.cn/images-ppt/ca46f4f946e3.jpg",
    stock: "12 på lager",
    category: "Husdyr",
  },

  // ============ KLEVEN FLUER ============
  {
    name: "Kleven Flue — Røye Special",
    subtitle: "Bundet for hånd",
    price: "kr 49",
    img: "https://sfile.chatglm.cn/images-ppt/655eb41c69e7.jpg",
    tag: "Bestselger",
    category: "Kleven Fluer",
  },
  {
    name: "Kleven Flue — Ørret Select",
    subtitle: "Bundet for hånd",
    price: "kr 49",
    img: "https://sfile.chatglm.cn/images-ppt/6ca9d31706cd.jpg",
    category: "Kleven Fluer",
  },
  {
    name: "Kleven Fluesett 12stk",
    subtitle: "Assorterte fluer",
    price: "kr 449",
    original: "kr 549",
    img: "https://sfile.chatglm.cn/images-ppt/e6eb82c6baa6.jpg",
    tag: "Tilbud",
    category: "Kleven Fluer",
  },

  // ============ BEKLEDNING ============
  {
    name: "Harkila Pro Hunter X",
    subtitle: "Jaktkoøye",
    price: "kr 5 990",
    original: "kr 6 990",
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "Tilbud",
    category: "Bekledning",
  },
  {
    name: "Fjellreven Skogso Jacket",
    subtitle: "Friluftsjakke",
    price: "kr 2 499",
    img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    category: "Bekledning",
  },
  {
    name: "Jerven Fjellduk Hunter",
    subtitle: "Allsidig fjellduk",
    price: "kr 1 990",
    img: "https://sfile.chatglm.cn/images-ppt/1b317ecc40f9.png",
    tag: "Bestselger",
    category: "Bekledning",
  },

  // ============ OUTLET ============
  {
    name: "Gulv til isfisketelt",
    subtitle: "Gulv",
    price: "Fra kr 1 470",
    original: "kr 2 100",
    img: "https://sfile.chatglm.cn/images-ppt/2ba5cae55a30.jpg",
    tag: "-30%",
    stock: "20+ på lager",
    category: "Outlet",
  },
  {
    name: "Lundhags Tornby Sole",
    subtitle: "Allround fjellstøvel",
    price: "kr 2 890",
    original: "kr 3 290",
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "-12%",
    category: "Outlet",
  },
  {
    name: "Harkila Pro Hunter X",
    subtitle: "Jaktkoøye",
    price: "kr 5 990",
    original: "kr 6 990",
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "-14%",
    category: "Outlet",
  },
  {
    name: "Zeiss Conquest HD 10x42",
    subtitle: "Kikkert",
    price: "kr 8 490",
    original: "kr 9 990",
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "-15%",
    category: "Outlet",
  },

  // ============ VINTERSPORT ============
  {
    name: "Madshus Hyper R Skate",
    subtitle: "Skøyteklasser",
    price: "kr 3 490",
    img: "https://sfile.chatglm.cn/images-ppt/d680255f301c.jpg",
    tag: "Nyhet",
    category: "Vintersport",
  },
  {
    name: "Fischer Cruiser Crown",
    subtitle: "Turski med feller",
    price: "kr 2 290",
    img: "https://sfile.chatglm.cn/images-ppt/5e0d4721eea5.jpg",
    category: "Vintersport",
  },
  {
    name: "Rottefella Move Switch",
    subtitle: "Binding",
    price: "kr 1 190",
    img: "https://sfile.chatglm.cn/images-ppt/8b3b12109609.png",
    category: "Vintersport",
  },
];

const CATEGORIES = [
  "Alle",
  "Camping",
  "Fiske",
  "Footwear",
  "Gavekort",
  "Jakt",
  "Husdyr",
  "Kleven Fluer",
  "Bekledning",
  "Outlet",
  "Vintersport",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export function ShopPage() {
  const [active, setActive] = useState<CategoryFilter>("Alle");

  const filtered =
    active === "Alle"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === active);

  return (
    <div className="kj-page-enter">
      {/* 1. Scrolling yellow banner */}
      <ShippingBanner size="md" />

      {/* 2. Shop header */}
      <section className="w-full" style={{ backgroundColor: "#e9e5db" }}>
        <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-10 lg:px-10">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a96a1]">
            Vareutvalg
          </div>
          <h1
            className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold tracking-[-0.02em] text-[#1f2d3a]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Hele Butikken
          </h1>
          <p className="mt-4 max-w-xl text-[15px] font-light leading-relaxed text-[#6b7884]">
            Over 1 200 håndplukkede artikler for jakt, fiske, friluftsliv og
            vintersport. Bruk filteret for å finne akkurat det du leter etter.
          </p>

          {/* Category filter row */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#d4cfc1] pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((c) => {
                const isActive = active === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#1f2d3a] text-white"
                        : "bg-white text-[#1f2d3a] hover:bg-[#f0c548]"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 text-[13px] font-light text-[#6b7884]">
              <span>
                {filtered.length} artikkel{filtered.length !== 1 ? "er" : ""}
              </span>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Forrige"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc1] bg-white text-[#1f2d3a] transition-colors hover:bg-[#1f2d3a] hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  aria-label="Neste"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4cfc1] bg-white text-[#1f2d3a] transition-colors hover:bg-[#1f2d3a] hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product grid */}
      <section className="w-full pb-24" style={{ backgroundColor: "#e9e5db" }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article
                key={p.name + p.category}
                className="group flex flex-col overflow-hidden rounded-[8px] border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(31,45,58,0.18)]"
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
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        p.tag.startsWith("-") || p.tag === "Tilbud"
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
                  <button
                    aria-label="Legg i handlevogn"
                    className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-[#1f2d3a] opacity-0 shadow-md transition-all duration-300 hover:bg-[#f0c548] group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <ArrowRight size={16} strokeWidth={2} />
                  </button>
                </div>

                <div className="flex flex-col gap-1 px-5 py-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a96a1]">
                    {p.category}
                  </div>
                  <h3 className="text-[16px] font-semibold leading-snug text-[#1f2d3a]">
                    {p.name}
                  </h3>
                  {p.subtitle && (
                    <p className="text-[13px] font-light text-[#6b7884]">
                      {p.subtitle}
                    </p>
                  )}
                  {p.stock && (
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.05em] text-[#3d5e4f]">
                      {p.stock}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[16px] font-bold text-[#1f2d3a]">
                      {p.price}
                    </span>
                    {p.original && (
                      <span className="text-[13px] font-light text-[#a0a8b0] line-through">
                        {p.original}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
