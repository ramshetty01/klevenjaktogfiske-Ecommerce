"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Crosshair, Fish, Tent, Utensils, Shirt, Backpack } from "lucide-react";
import { motion } from "framer-motion";
import type { PageId, NavContext } from "../kj/header";
import { ShippingBanner } from "../kj/shipping-banner";
import { ProductCard, ProductCardSkeleton } from "../kj/product-card";
import type { Product, CategoryNode, BrandNode } from "@/lib/kj/types";

interface HomePageProps {
  onNavigate: (page: PageId, ctx?: NavContext) => void;
}

const CATEGORY_TILES = [
  { name: "Jakt", icon: Crosshair, slug: "jakt", color: "#2d4a3e" },
  { name: "Fiske", icon: Fish, slug: "fiske", color: "#1f6f8b" },
  { name: "Camping", icon: Tent, slug: "camping", color: "#c75d2c" },
  { name: "Kniver", icon: Utensils, slug: "kniver", color: "#5d4037" },
  { name: "Bekledning", icon: Shirt, slug: "bekledning", color: "#3d5e4f" },
  { name: "Vintersport", icon: Backpack, slug: "vintersport", color: "#5b6e8a" },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [brands, setBrands] = useState<BrandNode[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [featRes, catRes, brandRes] = await Promise.all([
          fetch("/api/products/featured", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/brands", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (featRes.ok) {
          const data = await featRes.json();
          setFeatured(data.products ?? []);
        } else {
          setFeatured([]);
        }
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories ?? []);
        }
        if (brandRes.ok) {
          const data = await brandRes.json();
          // Show top brands by product count
          const sorted = (data.brands ?? [])
            .filter((b: BrandNode) => b.count > 0)
            .sort((a: BrandNode, b: BrandNode) => b.count - a.count)
            .slice(0, 14);
          setBrands(sorted);
        }
      } catch {
        if (!cancelled) setFeatured([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="kj-page-enter">
      {/* HERO — light blue gradient backdrop */}
      <section className="relative w-full overflow-hidden min-h-[calc(100vh-5rem)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #b9cdd9 0%, #c5d6e0 55%, #d2e0e8 100%)",
          }}
        />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-10 pt-2 lg:gap-16 lg:px-10 lg:py-14 lg:pt-6">
          <div className="flex flex-col items-start">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-[clamp(3.25rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.02em] text-[#1f2d3a]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Ut på tur,
              <br />
              <span className="text-[#1f2d3a]">aldri sur!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
              className="mt-6 max-w-md text-[20px] font-light leading-relaxed text-[#3a4856]"
            >
              Norsk kvalitetsutstyr for jakt, fiske og friluftsliv — siden 1985.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
              className="mt-10 flex flex-wrap gap-3"
            >
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
              <button
                onClick={() => onNavigate("categories")}
                className="inline-flex items-center gap-3 rounded-full border-2 border-[#1f2d3a] bg-transparent px-9 py-4 text-[15px] font-semibold uppercase tracking-[0.12em] text-[#1f2d3a] transition-all duration-300 hover:bg-[#1f2d3a] hover:text-white"
              >
                Våre Kategorier
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shipping marquee */}
      <ShippingBanner size="md" />

      {/* CATEGORY GRID */}
      <section className="w-full bg-[#f5f1e8]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8a96a1]">
              Finn det du trenger
            </p>
            <h2
              className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#1f2d3a]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Våre Hovedkategorier
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-[#6b7884]">
              Håndplukkede produkter fra merkevarer norske friluftsfolk stoler på.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {CATEGORY_TILES.map((c, i) => {
              const Icon = c.icon;
              const cat = categories.find((x) => x.slug === c.slug);
              return (
                <motion.button
                  key={c.slug}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onClick={() => onNavigate("shop", { shopFilters: { category: c.slug } })}
                  className="group flex flex-col items-center justify-center gap-3 rounded-[8px] border border-black/5 bg-white px-3 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(31,45,58,0.12)]"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: c.color + "20", color: c.color }}
                  >
                    <Icon size={22} strokeWidth={1.6} />
                  </span>
                  <span className="text-[13px] font-semibold text-[#1f2d3a]">
                    {c.name}
                  </span>
                  {cat && (
                    <span className="text-[10px] font-light uppercase tracking-[0.1em] text-[#8a96a1]">
                      {cat.count} artikler
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#d4cfc1] pb-5">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8a96a1]">
                Anbefalt for deg
              </p>
              <h2
                className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#1f2d3a]"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Populære Produkter
              </h2>
            </div>
            <button
              onClick={() => onNavigate("shop")}
              className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#1f2d3a] hover:underline"
            >
              Se alle <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4">
            {featured === null
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.length === 0
                ? <p className="col-span-full py-12 text-center text-[14px] text-[#6b7884]">Ingen produkter tilgjengelig.</p>
                : featured.slice(0, 8).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpen={(slug) => onNavigate("product", { productSlug: slug })}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* BRAND SHOWCASE */}
      <section className="w-full bg-[#f5f1e8]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8a96a1]">
              Våre Merkevarer
            </p>
            <h2
              className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-[#1f2d3a]"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              Merker vi stoler på
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-[#6b7884]">
              Vi er autoriserte forhandlere for over 60 merkevarer — fra
              Sauer og Zeiss til Helle, Fjellreven og Bergans.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-4">
            {brands.length === 0
              ? Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/2] animate-pulse rounded-md bg-white/60"
                />
              ))
              : brands.map((b, i) => (
                <motion.button
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  onClick={() => onNavigate("shop", { shopFilters: { brand: b.slug } })}
                  className="group flex aspect-[3/2] flex-col items-center justify-center rounded-md border border-black/5 bg-white px-3 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(31,45,58,0.10)]"
                >
                  <span className="text-[14px] font-bold tracking-[-0.01em] text-[#1f2d3a] transition-colors group-hover:text-[#2d4a3e]">
                    {b.name}
                  </span>
                  {b.country && (
                    <span className="mt-1 text-[10px] font-light uppercase tracking-[0.1em] text-[#8a96a1]">
                      {b.country}
                    </span>
                  )}
                </motion.button>
              ))}
          </div>
        </div>
      </section>

      {/* BRAND PROMISE BAND */}
      <section className="w-full bg-[#1f2d3a]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                title: "Kvalitetsutstyr",
                body: "Håndplukket sortiment fra merkevarer vi selv bruker. Vi selger bare utstyr vi ville delt med våre egne barn.",
                icon: "✓",
              },
              {
                title: "Rask Levering",
                body: "Fraktfritt i Norge på ordre over 2 500,-. Levering 2–4 dager til hele landet.",
                icon: "→",
              },
              {
                title: "Lokal Forhandler",
                body: "Ekspertene våre kjenner utstyret innvendig — fordi de bruker det hver sesong. Spør oss gjerne!",
                icon: "★",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0c548] text-[18px] font-bold text-[#1f2d3a]">
                  {item.icon}
                </span>
                <h3 className="text-[16px] font-semibold uppercase tracking-[0.1em] text-white">
                  {item.title}
                </h3>
                <p className="text-[13px] font-light leading-relaxed text-[#b8c0c8]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
