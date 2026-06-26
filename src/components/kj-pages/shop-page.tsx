"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ShippingBanner } from "../kj/shipping-banner";

type Category = "Jakt" | "Fiske" | "Camping" | "Kniver" | "Bekledning";

interface Product {
  name: string;
  price: string;
  original?: string;
  img: string;
  tag?: string;
  category: Category;
}

const PRODUCTS: Product[] = [
  {
    name: "Sauer 100 Highland XLT",
    price: "kr 14 990",
    img: "https://sfile.chatglm.cn/images-ppt/1e092c6839b8.jpg",
    tag: "Bestselger",
    category: "Jakt",
  },
  {
    name: "Zeiss Conquest HD 10x42",
    price: "kr 8 490",
    original: "kr 9 990",
    img: "https://sfile.chatglm.cn/images-ppt/aa16d454229c.webp",
    tag: "Tilbud",
    category: "Jakt",
  },
  {
    name: "ThermTec Cyclops 235",
    price: "kr 22 500",
    img: "https://sfile.chatglm.cn/images-ppt/b7d97df6e6e1.png",
    tag: "Nyhet",
    category: "Jakt",
  },
  {
    name: "Svartvass Havs fiskesett",
    price: "kr 2 290",
    img: "https://sfile.chatglm.cn/images-ppt/23bba380e05b.webp",
    tag: "Nyhet",
    category: "Fiske",
  },
  {
    name: "Abel TR Flysnelle",
    price: "kr 6 790",
    img: "https://sfile.chatglm.cn/images-ppt/7c4578463445.jpg",
    category: "Fiske",
  },
  {
    name: "Guideline Le Cie Flueset",
    price: "kr 3 450",
    original: "kr 4 200",
    img: "https://sfile.chatglm.cn/images-ppt/6496eef3ed4e.jpg",
    tag: "Tilbud",
    category: "Fiske",
  },
  {
    name: "Helle Vegge Kniv",
    price: "kr 1 450",
    img: "https://sfile.chatglm.cn/images-ppt/718b6c83dd87.jpg",
    tag: "Bestselger",
    category: "Kniver",
  },
  {
    name: "Morakniv Companion",
    price: "kr 249",
    img: "https://sfile.chatglm.cn/images-ppt/8339352aa10e.jpg",
    category: "Kniver",
  },
  {
    name: "Fallkniven F1 Pilot",
    price: "kr 1 290",
    img: "https://sfile.chatglm.cn/images-ppt/addecd50cb3a.jpg",
    tag: "Nyhet",
    category: "Kniver",
  },
  {
    name: "Bergans Hetland 70L",
    price: "kr 2 890",
    img: "https://sfile.chatglm.cn/images-ppt/c0a192b80802.jpg",
    category: "Camping",
  },
  {
    name: "Fjellreven Kånken No.2",
    price: "kr 1 199",
    original: "kr 1 399",
    img: "https://sfile.chatglm.cn/images-ppt/c148d45427d0.jpeg",
    tag: "Tilbud",
    category: "Camping",
  },
  {
    name: "Mountaintop Trek 65L",
    price: "kr 1 690",
    img: "https://sfile.chatglm.cn/images-ppt/39be2561c0f6.jpg",
    category: "Camping",
  },
  {
    name: "Jerven Fjellduk Hunter",
    price: "kr 1 990",
    img: "https://sfile.chatglm.cn/images-ppt/1b317ecc40f9.png",
    tag: "Bestselger",
    category: "Bekledning",
  },
  {
    name: "Fjellreven Skogso Jacket",
    price: "kr 2 499",
    img: "https://sfile.chatglm.cn/images-ppt/d6a883334e47.jpg",
    category: "Bekledning",
  },
  {
    name: "Harkila Pro Hunter X",
    price: "kr 5 990",
    original: "kr 6 990",
    img: "https://sfile.chatglm.cn/images-ppt/7dd4d6512c58.jpg",
    tag: "Tilbud",
    category: "Bekledning",
  },
];

const CATEGORIES = ["Alle", "Jakt", "Fiske", "Camping", "Kniver", "Bekledning"] as const;
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
            Over 1 200 håndplukkede artikler for jakt, fiske og friluftsliv.
            Bruk filteret for å finne akkurat det du leter etter.
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
                    className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
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
                key={p.name}
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
                        p.tag === "Tilbud"
                          ? "bg-[#c75d2c] text-white"
                          : p.tag === "Nyhet"
                          ? "bg-[#1f2d3a] text-white"
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
