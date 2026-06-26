"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ShippingBanner } from "../la/shipping-banner";

interface Product {
  name: string;
  price: string;
  original?: string;
  img: string;
  tag?: string;
  category: "Backpacks" | "Jackets" | "Tents" | "Footwear";
}

const PRODUCTS: Product[] = [
  {
    name: "Summit Pro Backpack 45L",
    price: "$148",
    img: "https://sfile.chatglm.cn/images-ppt/80b2911ed043.webp",
    tag: "Best Seller",
    category: "Backpacks",
  },
  {
    name: "Trailhead Daypack 22L",
    price: "$89",
    original: "$110",
    img: "https://sfile.chatglm.cn/images-ppt/a421dec6bcc4.jpg",
    tag: "Sale",
    category: "Backpacks",
  },
  {
    name: "Alpine Trail Jacket",
    price: "$220",
    img: "https://sfile.chatglm.cn/images-ppt/7f36c1d2522b.png",
    tag: "New",
    category: "Jackets",
  },
  {
    name: "Explorer Puffer Jacket",
    price: "$265",
    img: "https://sfile.chatglm.cn/images-ppt/0a3c80ab8ca7.jpg",
    category: "Jackets",
  },
  {
    name: "Basecamp Tent 2P",
    price: "$315",
    img: "https://sfile.chatglm.cn/images-ppt/a783f82be288.jpg",
    category: "Tents",
  },
  {
    name: "Backcountry Dome Tent",
    price: "$279",
    img: "https://sfile.chatglm.cn/images-ppt/1d16d80063e9.jpg",
    category: "Tents",
  },
  {
    name: "Summit Trek Boots",
    price: "$185",
    img: "https://sfile.chatglm.cn/images-ppt/b77fba9987e5.jpg",
    tag: "New",
    category: "Footwear",
  },
  {
    name: "Ridge Walker Boots",
    price: "$162",
    original: "$199",
    img: "https://sfile.chatglm.cn/images-ppt/991d03607009.png",
    tag: "Sale",
    category: "Footwear",
  },
  {
    name: "Expedition Backpack 60L",
    price: "$210",
    img: "https://sfile.chatglm.cn/images-ppt/8fd8dbb1df43.jpg",
    category: "Backpacks",
  },
];

const CATEGORIES = ["All", "Backpacks", "Jackets", "Tents", "Footwear"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export function ShopPage() {
  const [active, setActive] = useState<CategoryFilter>("All");

  const filtered =
    active === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === active);

  return (
    <div className="la-page-enter">
      {/* 1. Scrolling yellow banner */}
      <ShippingBanner size="md" />

      {/* 2. All Products header */}
      <section
        className="w-full"
        style={{ backgroundColor: "#e6e9ed" }}
      >
        <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-10 lg:px-10">
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#718096]">
            Catalog
          </div>
          <h1
            className="text-[clamp(2.5rem,5vw,3.75rem)] font-bold tracking-[-0.02em] text-[#2d3748]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            All Products
          </h1>

          {/* Category filter row */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#a0aec0] pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((c) => {
                const isActive = active === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#2c3e50] text-white"
                        : "bg-white text-[#2d3748] hover:bg-[#f7dc6f]"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 text-[13px] font-light text-[#4a5568]">
              <span>
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center gap-1">
                <button
                  aria-label="Previous"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a0aec0] bg-white text-[#2d3748] transition-colors hover:bg-[#2c3e50] hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  aria-label="Next"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#a0aec0] bg-white text-[#2d3748] transition-colors hover:bg-[#2c3e50] hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product grid */}
      <section
        className="w-full pb-24"
        style={{ backgroundColor: "#e6e9ed" }}
      >
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <article
                key={p.name}
                className="group flex flex-col overflow-hidden rounded-[8px] border border-black/5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(44,62,80,0.15)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f4f5f7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        p.tag === "Sale"
                          ? "bg-[#e74c3c] text-white"
                          : p.tag === "New"
                          ? "bg-[#2c3e50] text-white"
                          : "bg-[#f7dc6f] text-[#2c3e50]"
                      }`}
                    >
                      {p.tag}
                    </span>
                  )}
                  <button
                    aria-label="Quick add"
                    className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-[#2c3e50] opacity-0 shadow-md transition-all duration-300 hover:bg-[#f7dc6f] group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <ArrowRight size={16} strokeWidth={2} />
                  </button>
                </div>

                <div className="flex flex-col gap-1 px-5 py-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#718096]">
                    {p.category}
                  </div>
                  <h3 className="text-[16px] font-semibold leading-snug text-[#2d3748]">
                    {p.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[16px] font-bold text-[#2c3e50]">
                      {p.price}
                    </span>
                    {p.original && (
                      <span className="text-[13px] font-light text-[#a0aec0] line-through">
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
