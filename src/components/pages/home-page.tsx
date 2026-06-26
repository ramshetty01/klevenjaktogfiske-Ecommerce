"use client";

import { ArrowRight } from "lucide-react";
import type { PageId } from "../la/header";

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="la-page-enter">
      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* Soft blue gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #a8c5d6 0%, #b9d2e0 55%, #c4d8e5 100%)",
          }}
        />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          {/* Text column */}
          <div className="flex flex-col items-start">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2c3e50]/15 bg-white/30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2c3e50] backdrop-blur-sm">
              New Season · Adventure Collection
            </span>

            <h1
              className="text-[clamp(3.25rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-[#2c3e50]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Adventure
              <br />
              Awaits
            </h1>

            <p className="mt-6 max-w-md text-[18px] font-light leading-relaxed text-[#34495e]">
              Equip for exciting journeys. Premium outdoor gear, carefully
              curated for explorers who refuse to settle.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate("shop")}
                className="group inline-flex items-center gap-3 rounded-full bg-[#f7dc6f] px-9 py-4 text-[15px] font-semibold uppercase tracking-[0.12em] text-[#2c3e50] shadow-[0_8px_24px_rgba(247,220,111,0.35)] transition-all duration-300 hover:bg-[#f1c40f] hover:shadow-[0_12px_30px_rgba(241,196,15,0.45)]"
              >
                Shop Now
                <ArrowRight
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={() => onNavigate("about")}
                className="text-[14px] font-medium uppercase tracking-[0.12em] text-[#2c3e50] underline-offset-4 hover:underline"
              >
                Our Story
              </button>
            </div>

            {/* Mini stats */}
            <div className="mt-14 flex flex-wrap gap-10">
              {[
                { value: "120+", label: "Premium Products" },
                { value: "30k", label: "Happy Explorers" },
                { value: "4.9★", label: "Avg. Review" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-[28px] font-bold text-[#2c3e50]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[12px] font-light uppercase tracking-[0.1em] text-[#34495e]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] shadow-[0_30px_60px_-15px_rgba(44,62,80,0.45)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://sfile.chatglm.cn/images-ppt/ede0d37f7618.jpg"
                alt="Explorer wearing a brown puffer jacket and backpack against a blue sky"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating product chip */}
            <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-lg bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgba(44,62,80,0.25)] backdrop-blur sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7dc6f] text-[#2c3e50]">
                <ArrowRight size={16} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2d3748]">
                  Winter Collection
                </p>
                <p className="text-[11px] text-[#718096]">Up to 25% off</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-black/5 md:grid-cols-4">
          {[
            { label: "Backpacks", count: "32 items" },
            { label: "Jackets", count: "48 items" },
            { label: "Tents", count: "18 items" },
            { label: "Footwear", count: "24 items" },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() => onNavigate("shop")}
              className="group flex flex-col items-start gap-1 px-6 py-8 text-left transition-colors hover:bg-[#f8f5f0]"
            >
              <span className="text-[18px] font-semibold text-[#2d3748]">
                {c.label}
              </span>
              <span className="text-[12px] font-light uppercase tracking-[0.1em] text-[#718096]">
                {c.count}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[#2c3e50] opacity-0 transition-opacity group-hover:opacity-100">
                Browse <ArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[#f8f5f0]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10">
          <div className="mb-10 flex items-end justify-between border-b border-black/10 pb-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#718096]">
                Best Sellers
              </p>
              <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#2d3748]">
                Featured Gear
              </h2>
            </div>
            <button
              onClick={() => onNavigate("shop")}
              className="hidden items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#2c3e50] hover:underline sm:inline-flex"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Summit Pro Backpack",
                price: "$148",
                img: "https://sfile.chatglm.cn/images-ppt/80b2911ed043.webp",
                tag: "Best Seller",
              },
              {
                name: "Alpine Trail Jacket",
                price: "$220",
                img: "https://sfile.chatglm.cn/images-ppt/7f36c1d2522b.png",
                tag: "New",
              },
              {
                name: "Basecamp Tent 2P",
                price: "$315",
                img: "https://sfile.chatglm.cn/images-ppt/a783f82be288.jpg",
                tag: "",
              },
            ].map((p) => (
              <button
                key={p.name}
                onClick={() => onNavigate("shop")}
                className="group block rounded-[8px] border border-black/5 bg-white p-3 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(44,62,80,0.15)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-[6px] bg-[#f4f5f7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#f7dc6f] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#2c3e50]">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between px-2 py-4">
                  <span className="text-[15px] font-semibold text-[#2d3748]">
                    {p.name}
                  </span>
                  <span className="text-[15px] font-bold text-[#2c3e50]">
                    {p.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
